import type { GameModule, ReduceResult } from '@durak-master/game-core';
import type {
  GameAction,
  GameCoreState,
  GameErrorCode,
  GameId,
  PlayerState,
  PlayerView,
  SettingsForGame,
  StateForGame
} from '@durak-master/schemas';

import { getGameModule } from '@durak-master/game-core';

export type GameOutcome = {
  loserUserId: string | null;
  isDraw: boolean;
};

export type GameSession = {
  readonly game: GameId;
  readonly state: GameCoreState;

  apply: (userId: string, action: GameAction) => GameErrorCode | null;
  applyBotTurn: (userId: string) => string | null;
  applyTimeout: (userId: string) => boolean;
  markDisconnected: (userId: string, isDisconnected: boolean) => void;
  setTurnDeadline: (deadline: number) => void;
  getOutcome: () => GameOutcome;
  getViewFor: (userId: string) => PlayerView;
};

export type CreateSessionInput<G extends GameId = GameId> = {
  tableId: string;
  settings: SettingsForGame<G>;
  userIds: string[];
  randomInt: (maxExclusive: number) => number;
};

type ModuleAction<G extends GameId> = Parameters<GameModule<G>['reduce']>[2];

class TypedGameSession<G extends GameId> implements GameSession {
  private current: StateForGame<G>;

  constructor(
    private readonly module: GameModule<G>,
    initial: StateForGame<G>,
    private readonly randomInt: (maxExclusive: number) => number
  ) {
    this.current = initial;
  }

  get game(): GameId {
    return this.module.id;
  }

  get state(): GameCoreState {
    return this.current;
  }

  apply(userId: string, action: GameAction): GameErrorCode | null {
    if (action.game !== this.module.id) {
      return 'WRONG_GAME';
    }

    const own = action.action as ModuleAction<G>;

    return this.commit(this.module.reduce(this.current, userId, own));
  }

  applyBotTurn(userId: string): string | null {
    const action = this.module.decideBotAction(this.current, userId);

    if (this.commit(this.module.reduce(this.current, userId, action)) === null) {
      return action.type;
    }

    const timeoutAction = this.module.decideTimeoutAction(this.current, userId);

    if (this.commit(this.module.reduce(this.current, userId, timeoutAction)) === null) {
      return timeoutAction.type;
    }

    return null;
  }

  applyTimeout(userId: string): boolean {
    const action = this.module.decideTimeoutAction(this.current, userId);

    return this.commit(this.module.reduce(this.current, userId, action)) === null;
  }

  markDisconnected(userId: string, isDisconnected: boolean): void {
    this.current = {
      ...this.current,
      players: this.current.players.map((player: PlayerState) =>
        player.userId === userId ? { ...player, isDisconnected } : player
      )
    };
  }

  setTurnDeadline(deadline: number): void {
    this.current = { ...this.current, turnDeadline: deadline };
  }

  getOutcome(): GameOutcome {
    const state: Record<string, unknown> = this.current;
    const loserUserId = state.loserUserId;
    const isDraw = state.isDraw;

    return {
      loserUserId: typeof loserUserId === 'string' ? loserUserId : null,
      isDraw: isDraw === true
    };
  }

  getViewFor(userId: string): PlayerView {
    return this.module.toPlayerView(this.current, userId);
  }

  private commit(result: ReduceResult<G>): GameErrorCode | null {
    if (!result.ok) {
      return result.error;
    }

    this.current = result.state;
    this.dealAgainIfNeeded();

    return null;
  }

  private dealAgainIfNeeded(): void {
    const next = this.module.startNextDeal?.(this.current, this.randomInt);

    if (next) {
      this.current = next;
    }
  }
}

export function createGameSession<G extends GameId>(input: CreateSessionInput<G>): GameSession {
  const module = getGameModule(input.settings.game as G);
  const state = module.createGame({
    tableId: input.tableId,
    settings: input.settings,
    userIds: input.userIds,
    randomInt: input.randomInt
  });

  return new TypedGameSession(module, state, input.randomInt);
}
