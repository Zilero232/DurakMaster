import { clientMessageSchema, computeRatingGain } from '@durak-master/schemas';
import { Logger } from '@nestjs/common';
import {
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  type OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets';
import { RateLimiterMemory } from 'rate-limiter-flexible';

import { AuthService } from '../../lib/auth/auth.service';
import { RoomsService } from '../game/rooms.service';
import { ProfilesService } from '../profile/profiles.service';
import { SessionsService } from './sessions.service';

import type {
  ClientMessage,
  CreateTableInput,
  GameAction,
  GameErrorCode,
  ServerMessage,
} from '@durak-master/schemas';
import type { WebSocket } from 'ws';
import type { RoomEvent } from '../game/game-room';

type Socket = WebSocket & { userId?: string; isAlive?: boolean };

/**
 * WebSocket-шлюз.
 *
 * Отвечает только за транспорт: разбор и валидацию сообщений, маршрутизацию
 * в комнаты и рассылку. Правила игры живут в game-core, состояние — в комнатах.
 */
@WebSocketGateway({ path: '/ws' })
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(RealtimeGateway.name);

  private readonly sockets = new Map<string, Socket>();
  /** Кто подписан на список столов. */
  private readonly lobbySubscribers = new Set<string>();

  /**
   * Ограничение частоты сообщений на соединение. У обычного игрока в дураке
   * это единицы действий в секунду; всё сверх — либо баг клиента, либо
   * попытка нагрузить сервер.
   */
  private readonly rateLimiter = new RateLimiterMemory({
    points: 25,
    duration: 5,
  });

  constructor(
    private readonly rooms: RoomsService,
    private readonly sessions: SessionsService,
    private readonly auth: AuthService,
    private readonly profiles: ProfilesService,
  ) {}

  /**
   * Заголовки апгрейда в веб-стандартный `Headers` — в таком виде их ждёт
   * better-auth. Cookie и `Authorization` проходят насквозь, поэтому
   * работает браузерная сессия.
   *
   * Токен из query — запасной путь для нативной обёртки: браузерный
   * WebSocket не позволяет задать заголовки, а в Tauri нет общих cookie.
   * Значение всё равно проверяется подписью, поэтому подделать его нельзя.
   */
  private toHeaders(request: {
    url?: string;
    headers: Record<string, string | string[] | undefined>;
  }): Headers {
    const headers = new Headers();

    for (const [key, value] of Object.entries(request.headers)) {
      if (typeof value === 'string') {
        headers.set(key, value);
      } else if (Array.isArray(value)) {
        headers.set(key, value.join('; '));
      }
    }

    if (!headers.has('authorization')) {
      const token = new URL(request.url ?? '/ws', 'http://localhost').searchParams.get('token');

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }

  afterInit(): void {
    this.rooms.onEvent((roomId, event) => this.handleRoomEvent(roomId, event));

    // Пинг живости: соединения в мобильных сетях умирают молча.
    setInterval(() => {
      for (const socket of this.sockets.values()) {
        if (socket.isAlive === false) {
          socket.terminate();

          continue;
        }

        socket.isAlive = false;
        socket.ping();
      }
    }, 30_000);

    this.logger.log('Realtime gateway ready on /ws');
  }

  async handleConnection(
    socket: Socket,
    request: { url?: string; headers: Record<string, string | string[] | undefined> },
  ): Promise<void> {
    // Слушатель вешается ДО любого await: проверка сессии и загрузка профиля
    // занимают время, а клиент шлёт первую команду сразу после `open`.
    // Без буфера эти сообщения пропали бы молча.
    const buffered: Buffer[] = [];
    let isReady = false;

    const dispatch = (raw: Buffer) => {
      // Ошибку обработчика нельзя терять: без лога сбой выглядит как
      // «сервер молча не ответил» и не находится по симптомам.
      this.handleMessage(socket, raw).catch((error) => {
        this.logger.error(`Ошибка обработки сообщения от ${socket.userId}`, error);

        this.send(socket, {
          type: 'error',
          payload: { message: 'Внутренняя ошибка', code: 'INTERNAL_ERROR' },
        });
      });
    };

    socket.on('message', (raw: Buffer) => {
      if (isReady) {
        dispatch(raw);

        return;
      }

      buffered.push(raw);
    });

    socket.on('pong', () => {
      socket.isAlive = true;
    });

    // Личность берётся ТОЛЬКО из проверенной сессии. Идентификатор из
    // параметров запроса принимать нельзя: он позволил бы подключиться
    // от чужого имени и увидеть чужую руку.
    const userId = await this.auth.resolveUserId(this.toHeaders(request));

    if (!userId) {
      this.send(socket, {
        type: 'error',
        payload: { message: 'Требуется вход', code: 'UNAUTHORIZED' },
      });
      socket.close(4401, 'Unauthorized');

      return;
    }

    const profile = await this.sessions.load(userId);

    // Второе подключение того же игрока вытесняет первое: иначе за столом
    // окажутся два сокета с одной личностью и рассылка станет неоднозначной.
    const previous = this.sockets.get(userId);

    if (previous && previous !== socket) {
      previous.close(4409, 'Replaced by a new connection');
    }

    socket.userId = profile.userId;
    socket.isAlive = true;
    this.sockets.set(profile.userId, socket);

    this.send(socket, { type: 'connected', payload: { profile } });

    // Профиль готов — разбираем накопленное в порядке поступления.
    isReady = true;

    for (const raw of buffered) {
      dispatch(raw);
    }

    buffered.length = 0;

    // Игрок мог вернуться в идущую партию — сразу отдаём состояние.
    const room = this.rooms.getRoomOfUser(profile.userId);

    if (room) {
      room.reconnect(profile.userId);
      this.sendTableJoined(profile.userId, room.id);
      this.sendGameState(room.id);
    }
  }

  handleDisconnect(socket: Socket): void {
    const userId = socket.userId;

    if (!userId) {
      return;
    }

    this.sockets.delete(userId);
    this.lobbySubscribers.delete(userId);
    this.rooms.handleDisconnect(userId);
    this.sessions.setOnline(userId, false);
    this.broadcastLobby();
  }

  // --- Обработка сообщений -------------------------------------------------

  private async handleMessage(socket: Socket, raw: Buffer): Promise<void> {
    const userId = socket.userId;

    if (!userId) {
      return;
    }

    try {
      await this.rateLimiter.consume(userId);
    } catch {
      this.send(socket, {
        type: 'error',
        payload: { message: 'Слишком много запросов', code: 'RATE_LIMITED' },
      });

      return;
    }

    let message: ClientMessage;

    try {
      // Форме клиентских данных доверять нельзя — валидируем схемой.
      message = clientMessageSchema.parse(JSON.parse(raw.toString()));
    } catch {
      this.send(socket, {
        type: 'error',
        payload: { message: 'Некорректное сообщение', code: 'BAD_MESSAGE' },
      });

      return;
    }

    switch (message.type) {
      case 'ping':
        this.send(socket, { type: 'pong' });
        break;

      case 'lobby:subscribe':
        this.lobbySubscribers.add(userId);
        this.send(socket, {
          type: 'lobby:tables',
          payload: { tables: this.rooms.listTables() },
        });
        break;

      case 'lobby:unsubscribe':
        this.lobbySubscribers.delete(userId);
        break;

      case 'table:create':
        await this.handleCreateTable(socket, userId, message.payload);
        break;

      case 'table:join':
        await this.handleJoinTable(socket, userId, message.payload);
        break;

      case 'table:leave':
        this.rooms.leave(userId);
        this.send(socket, { type: 'table:left' });
        this.broadcastLobby();
        break;

      case 'table:ready': {
        const room = this.rooms.getRoomOfUser(userId);

        room?.setReady(userId, message.payload.isReady);
        break;
      }

      case 'table:add-bot':
        this.handleAddBot(socket, userId);
        break;

      case 'game:action':
        this.handleGameAction(socket, userId, message.payload);
        break;

      case 'table:phrase': {
        const room = this.rooms.getRoomOfUser(userId);

        room?.sendPhrase(userId, message.payload.phraseId);
        break;
      }

      case 'table:emoji': {
        const room = this.rooms.getRoomOfUser(userId);

        room?.sendEmoji(userId, message.payload.emoji);
        break;
      }

      default:
        break;
    }
  }

  private async handleCreateTable(
    socket: Socket,
    userId: string,
    payload: CreateTableInput,
  ): Promise<void> {
    const profile = this.sessions.get(userId);

    if (!profile) {
      return;
    }

    // Ставка резервируется рукой игрока: сесть за стол дороже своего
    // баланса нельзя, иначе проигрыш увёл бы счёт в минус.
    if (!(await this.profiles.canAfford(userId, payload.settings.bet))) {
      this.send(socket, {
        type: 'error',
        payload: { message: 'Не хватает кредитов на эту ставку', code: 'NOT_ENOUGH_CREDITS' },
      });

      return;
    }

    // Игрок не может сидеть за двумя столами одновременно.
    this.rooms.leave(userId);

    const room = this.rooms.createRoom(payload.settings, null);

    this.rooms.join(room, profile);
    this.sendTableJoined(userId, room.id);
    this.broadcastLobby();
  }

  private async handleJoinTable(
    socket: Socket,
    userId: string,
    payload: { tableId: string },
  ): Promise<void> {
    const profile = this.sessions.get(userId);
    const room = this.rooms.getRoom(payload.tableId);

    if (!profile || !room) {
      this.send(socket, {
        type: 'error',
        payload: { message: 'Стол не найден', code: 'TABLE_NOT_FOUND' },
      });

      return;
    }

    if (!(await this.profiles.canAfford(userId, room.settings.bet))) {
      this.send(socket, {
        type: 'error',
        payload: { message: 'Не хватает кредитов на эту ставку', code: 'NOT_ENOUGH_CREDITS' },
      });

      return;
    }

    if (!this.rooms.join(room, profile)) {
      this.send(socket, {
        type: 'error',
        payload: { message: 'За столом нет мест', code: 'TABLE_FULL' },
      });

      return;
    }

    this.sendTableJoined(userId, room.id);
    this.broadcastLobby();
  }

  /**
   * Сажает бота на свободное место.
   *
   * Бот — не пользователь БД: профиль собирается на лету и живёт только
   * в памяти комнаты. Записывать ему рейтинг и кредиты некуда, поэтому
   * итоги партии для ботов не сохраняются.
   */
  private handleAddBot(socket: Socket, userId: string): void {
    const room = this.rooms.getRoomOfUser(userId);

    if (!room) {
      return;
    }

    if (room.isPlaying || room.isFull) {
      this.send(socket, {
        type: 'error',
        payload: { message: 'За столом нет мест', code: 'TABLE_FULL' },
      });

      return;
    }

    const index = room.getMembers().filter((member) => member.isBot).length + 1;

    room.join(
      {
        userId: `bot:${room.id}:${index}`,
        name: `Бот ${index}`,
        avatarUrl: null,
        rating: 0,
        seasonRating: 0,
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        isPremium: false,
        isOnline: true,
      },
      true,
    );

    this.broadcastLobby();
  }

  private handleGameAction(
    socket: Socket,
    userId: string,
    payload: { action: GameAction; expectedVersion: number },
  ): void {
    const room = this.rooms.getRoomOfUser(userId);

    if (!room) {
      return;
    }

    const error = room.applyAction(userId, payload.action, payload.expectedVersion);

    if (error) {
      this.send(socket, {
        type: 'game:rejected',
        payload: { code: error as GameErrorCode },
      });
    }
  }

  // --- Рассылка ------------------------------------------------------------

  private handleRoomEvent(roomId: string, event: RoomEvent): void {
    switch (event.type) {
      case 'state-changed':
        this.sendGameState(roomId);
        this.broadcastLobby();
        break;

      case 'finished':
        void this.handleGameFinished(roomId, event.loserUserId, event.isDraw);
        break;

      case 'phrase':
        this.broadcastToRoom(roomId, {
          type: 'table:phrase',
          payload: { phrase: event.phrase },
        });
        break;

      case 'emoji':
        this.broadcastToRoom(roomId, {
          type: 'table:emoji',
          payload: { userId: event.userId, emoji: event.emoji },
        });
        break;

      default:
        break;
    }
  }

  /**
   * Итоги партии: ставка проигравшего делится между остальными,
   * победителям начисляется рейтинг по логарифму выигрыша.
   */
  private async handleGameFinished(
    roomId: string,
    loserUserId: string | null,
    isDraw: boolean,
  ): Promise<void> {
    const room = this.rooms.getRoom(roomId);

    if (!room) {
      return;
    }

    const members = room.getMembers();
    const bet = room.settings.bet;
    const winners = members.filter((member) => member.profile.userId !== loserUserId);
    const prize = isDraw || winners.length === 0 ? 0 : Math.floor(bet / winners.length);

    for (const member of members) {
      const userId = member.profile.userId;
      const isLoser = userId === loserUserId;
      const creditsDelta = isDraw ? 0 : isLoser ? -bet : prize;
      const ratingDelta = isDraw || isLoser ? 0 : computeRatingGain(prize, member.profile.rating);

      // У ботов нет профиля в БД — записывать им итоги некуда.
      if (!member.isBot) {
        await this.sessions.applyGameResult({
          userId,
          creditsDelta,
          ratingDelta,
          isWinner: !isLoser && !isDraw,
          isDraw,
        });
      }

      const socket = this.sockets.get(userId);

      if (socket) {
        this.send(socket, {
          type: 'game:finished',
          payload: { loserUserId, isDraw, creditsDelta, ratingDelta },
        });
      }
    }
  }

  /**
   * Состояние партии рассылается ПЕРСОНАЛЬНО: каждый получает только свою
   * руку. Общая рассылка одного объекта раскрыла бы карты соперников.
   */
  private sendGameState(roomId: string): void {
    const room = this.rooms.getRoom(roomId);

    if (!room) {
      return;
    }

    const profiles = room.getProfiles();

    for (const member of room.getMembers()) {
      if (member.isBot) {
        continue;
      }

      const socket = this.sockets.get(member.profile.userId);
      const view = room.getViewFor(member.profile.userId);

      if (!socket || !view) {
        continue;
      }

      this.send(socket, { type: 'game:state', payload: { view, players: profiles } });
    }
  }

  private sendTableJoined(userId: string, roomId: string): void {
    const socket = this.sockets.get(userId);
    const room = this.rooms.getRoom(roomId);

    if (!socket || !room) {
      return;
    }

    const seat = room.getMember(userId)?.seat ?? 0;

    this.send(socket, {
      type: 'table:joined',
      payload: { table: room.toLobbyTable(), seat },
    });
  }

  private broadcastToRoom(roomId: string, message: ServerMessage): void {
    const room = this.rooms.getRoom(roomId);

    if (!room) {
      return;
    }

    for (const member of room.getMembers()) {
      const socket = this.sockets.get(member.profile.userId);

      if (socket) {
        this.send(socket, message);
      }
    }
  }

  private broadcastLobby(): void {
    const tables = this.rooms.listTables();

    for (const userId of this.lobbySubscribers) {
      const socket = this.sockets.get(userId);

      if (socket) {
        this.send(socket, { type: 'lobby:tables', payload: { tables } });
      }
    }
  }

  private send(socket: Socket, message: ServerMessage): void {
    if (socket.readyState !== socket.OPEN) {
      return;
    }

    socket.send(JSON.stringify(message));
  }
}
