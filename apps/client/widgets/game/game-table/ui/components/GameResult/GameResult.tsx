'use client';

import confetti from 'canvas-confetti';
import { useEffect } from 'react';

import { formatNumber } from '@/shared/lib/format';
import { playSound } from '@/shared/lib/sound';
import { Button } from '@/shared/ui';

import s from './GameResult.module.scss';

type GameResultProps = {
  isDraw: boolean;
  isLoser: boolean;
  creditsDelta?: number;
  ratingDelta?: number;
  onExit: () => void;
  onRestart?: () => void;
};

export const GameResult = ({
  isDraw,
  isLoser,
  creditsDelta = 0,
  ratingDelta = 0,
  onExit,
  onRestart,
}: GameResultProps) => {
  const isWinner = !isDraw && !isLoser;

  useEffect(() => {
    if (isWinner) {
      playSound('win');
      confetti({
        particleCount: 90,
        spread: 74,
        origin: { y: 0.62 },
        // Золото и зелень сукна — те же цвета, что в интерфейсе.
        colors: ['#d4af37', '#f0d98c', '#4a9d7a'],
      });

      return;
    }

    if (isLoser) {
      playSound('lose');
    }
  }, [isWinner, isLoser]);

  return (
    <div className={s.root}>
      <div className={s.panel}>
        <p className={s.title} data-tone={isWinner ? 'win' : isDraw ? 'draw' : 'lose'}>
          {isDraw ? 'Ничья' : isLoser ? 'Вы дурак' : 'Победа'}
        </p>

        <p className={s.subtitle}>
          {isDraw
            ? 'Карты закончились у всех одновременно'
            : isLoser
              ? 'Соперники разошлись раньше вас'
              : 'Вы избавились от карт первым'}
        </p>

        {(creditsDelta !== 0 || ratingDelta !== 0) && (
          <div className={s.deltas}>
            {creditsDelta !== 0 && (
              <span className={s.delta} data-positive={creditsDelta > 0}>
                {creditsDelta > 0 ? '+' : ''}
                {formatNumber(creditsDelta)} кредитов
              </span>
            )}
            {ratingDelta > 0 && <span className={s.rating}>+{ratingDelta} рейтинга</span>}
          </div>
        )}

        <div className={s.actions}>
          {onRestart && (
            <Button variant="primary" size="lg" isFullWidth onClick={onRestart}>
              Ещё партию
            </Button>
          )}
          <Button variant={onRestart ? 'ghost' : 'primary'} size="lg" isFullWidth onClick={onExit}>
            {onRestart ? 'В меню' : 'Выйти из-за стола'}
          </Button>
        </div>
      </div>
    </div>
  );
};
