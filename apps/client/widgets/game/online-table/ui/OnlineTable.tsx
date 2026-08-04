'use client';

import clsx from 'clsx';
import { Layers, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { useOnlineGame, useSessionStore } from '@/entities/session';
import { QuickPhrases } from '@/features/game/quick-phrases';
import { DiscardPanel } from '@/features/game/view-discard';
import { SettingsPanel } from '@/features/settings/change-settings';
import { playSound } from '@/shared/lib/sound';
import { Button } from '@/shared/ui';
import {
  GameResult,
  OpponentSeat,
  PlayerHand,
  TableField,
  TalonStack,
  TurnTimer,
} from '../../game-table/ui/components';

import s from './OnlineTable.module.scss';

/** Сколько реплика висит над аватаром. Совпадает с длительностью анимации. */
const PHRASE_LIFETIME_MS = 3400;

export const OnlineTable = () => {
  const t = useTranslations('table');
  const tDiscard = useTranslations('discard');
  const tSettings = useTranslations('settings');
  const tPhrases = useTranslations('phrases');
  const tError = useTranslations('error');

  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    view,
    players,
    mySeat,
    isMyTurn,
    isDefending,
    selectedCard,
    selectedKey,
    playableKeys,
    beatableIndexes,
    outcome,
    rejectedCode,
    canTake,
    canPass,
    selectCard,
    defendPair,
    take,
    pass,
  } = useOnlineGame();

  const currentTable = useSessionStore((store) => store.currentTable);
  const leaveTable = useSessionStore((store) => store.leaveTable);
  const setReady = useSessionStore((store) => store.setReady);
  const addBot = useSessionStore((store) => store.addBot);
  const sendPhrase = useSessionStore((store) => store.sendPhrase);
  const phrases = useSessionStore((store) => store.phrases);
  const clearRejection = useSessionStore((store) => store.clearRejection);

  const prevTableSize = useRef(0);
  const prevHandSize = useRef(0);
  const wasMyTurn = useRef(false);

  /**
   * Озвучка событий стола.
   *
   * Считаем по изменению состояния, а не по своим действиям: игрок должен
   * слышать и чужие ходы — иначе стол кажется мёртвым, пока ходят соперники.
   */
  useEffect(() => {
    if (!view) {
      return;
    }

    const tableSize = view.table.length;
    const handSize = view.hand.length;

    if (tableSize > prevTableSize.current) {
      playSound(view.table.some((pair) => pair.defense) ? 'beat' : 'play');
    } else if (tableSize === 0 && prevTableSize.current > 0) {
      // Стол опустел: либо отбились, либо кто-то забрал карты.
      playSound(handSize > prevHandSize.current ? 'take' : 'pass');
    } else if (handSize > prevHandSize.current) {
      playSound('deal');
    }

    prevTableSize.current = tableSize;
    prevHandSize.current = handSize;
  }, [view]);

  /** Свой ход — короткий сигнал, чтобы не пропустить таймер. */
  useEffect(() => {
    if (isMyTurn && !wasMyTurn.current) {
      playSound('turn');
    }

    wasMyTurn.current = isMyTurn;
  }, [isMyTurn]);

  /**
   * Отказ сервера показываем тостом и озвучиваем.
   *
   * Без этого недопустимый ход выглядит как зависшая игра: карта просто
   * не легла, и непонятно — лаг это или нарушение правил.
   */
  useEffect(() => {
    if (!rejectedCode) {
      return;
    }

    playSound('error');
    toast.error(tError(rejectedCode));
    clearRejection();
  }, [rejectedCode, tError, clearRejection]);

  /**
   * Последняя свежая реплика каждого игрока.
   *
   * Отсечка по времени обязательна: пузырь исчезает по анимации, но без
   * неё фраза вернулась бы на экран при любом следующем рендере стола.
   *
   * Без useMemo намеренно — в проекте включён React Compiler, он мемоизирует
   * такие вычисления сам.
   */
  const latestPhrases: Record<string, string> = {};
  const now = Date.now();

  for (const phrase of phrases) {
    if (now - phrase.sentAt < PHRASE_LIFETIME_MS) {
      latestPhrases[phrase.userId] = tPhrases(phrase.phraseId);
    }
  }

  if (!currentTable) {
    return null;
  }

  // Партия ещё не началась — экран ожидания игроков.
  if (!view) {
    const me = currentTable.players.find((player) => player.seat === mySeat);
    const hasFreeSeat = currentTable.players.length < currentTable.settings.maxPlayers;

    return (
      <div className={s.waiting}>
        <div className={s.waitingPanel}>
          <h2 className={s.waitingTitle}>{t('waitingTitle')}</h2>
          <p className={s.waitingCount}>
            {t('waitingCount', {
              current: currentTable.players.length,
              max: currentTable.settings.maxPlayers,
            })}
          </p>

          <ul className={s.waitingList}>
            {currentTable.players.map((player) => (
              <li key={player.userId} className={s.waitingPlayer}>
                <span>{player.name}</span>
                <span className={clsx(s.readyMark, player.isReady && s.ready)}>
                  {player.isReady ? t('readyMark') : t('waitingMark')}
                </span>
              </li>
            ))}
          </ul>

          <div className={s.waitingActions}>
            <Button variant="primary" isFullWidth onClick={() => setReady(!(me?.isReady ?? false))}>
              {me?.isReady ? t('notReady') : t('ready')}
            </Button>

            {/* Позволяет играть в одиночку, не дожидаясь живых соперников. */}
            {hasFreeSeat && (
              <Button variant="ghost" isFullWidth onClick={addBot}>
                {t('addBot')}
              </Button>
            )}

            <Button variant="ghost" isFullWidth onClick={leaveTable}>
              {t('leave')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const opponents = view.players.filter((player) => player.seat !== mySeat);

  const statusText = isMyTurn
    ? isDefending
      ? selectedCard
        ? t('chooseTarget')
        : t('defend')
      : t('yourTurn')
    : t('opponentTurn');

  return (
    <div className={s.root}>
      <div className={s.rail} aria-hidden />

      <header className={s.opponents}>
        {opponents.map((player) => {
          const meta = players.find((item) => item.userId === player.userId);

          return (
            <OpponentSeat
              key={player.userId}
              player={player}
              name={meta?.name ?? t('playerFallback', { seat: player.seat + 1 })}
              avatarUrl={meta?.avatarUrl ?? null}
              phrase={latestPhrases[player.userId]}
              isAttacker={player.seat === view.attackerSeat}
              isDefender={player.seat === view.defenderSeat}
              isActive={player.seat === view.activeSeat}
            />
          );
        })}
      </header>

      <div className={s.middle}>
        <TalonStack count={view.talonCount} trump={view.trump} trumpCard={view.trumpCard} />
        <TableField pairs={view.table} beatableIndexes={beatableIndexes} onDefend={defendPair} />
      </div>

      <footer className={s.bottom}>
        <div className={s.statusRow}>
          <span className={clsx(s.turn, isMyTurn && s.turnActive)}>{statusText}</span>
          {isMyTurn && <TurnTimer deadline={view.turnDeadline} />}
        </div>

        <PlayerHand
          cards={view.hand}
          playableKeys={playableKeys}
          selectedKey={selectedKey}
          trump={view.trump}
          onSelect={selectCard}
        />

        <div className={s.actions}>
          {/* Служебные кнопки слева, игровые справа: промахнуться по «Беру»
              вместо «Настроек» дороже, чем наоборот. */}
          <div className={s.tools}>
            <QuickPhrases onSend={sendPhrase} />

            <button
              type="button"
              className={s.tool}
              aria-label={tDiscard('open')}
              onClick={() => setIsDiscardOpen(true)}
            >
              <Layers size={18} aria-hidden />
              <span className={s.toolCount}>{view.discardCount}</span>
            </button>

            <button
              type="button"
              className={s.tool}
              aria-label={tSettings('title')}
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings size={18} aria-hidden />
            </button>
          </div>

          <div className={s.moves}>
            <Button variant="danger" isFullWidth isDisabled={!canTake} onClick={take}>
              {t('take')}
            </Button>
            <Button variant="primary" isFullWidth isDisabled={!canPass} onClick={pass}>
              {t('pass')}
            </Button>
          </div>
        </div>
      </footer>

      <DiscardPanel
        isOpen={isDiscardOpen}
        cards={view.discardPile}
        onClose={() => setIsDiscardOpen(false)}
      />

      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {outcome && (
        <GameResult
          isDraw={outcome.isDraw}
          isLoser={outcome.loserUserId === view.players[mySeat]?.userId}
          creditsDelta={outcome.creditsDelta}
          ratingDelta={outcome.ratingDelta}
          onExit={leaveTable}
        />
      )}
    </div>
  );
};
