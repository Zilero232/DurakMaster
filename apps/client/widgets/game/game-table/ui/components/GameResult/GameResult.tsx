'use client';

import NumberFlow from '@number-flow/react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { match } from 'ts-pattern';

import { playSound } from '@/shared/lib/sound';
import { Button } from '@/shared/ui';

import s from './GameResult.module.scss';

import type { GameResultProps } from './GameResult.types';

/** Салют пускается двумя залпами от краёв — один сноп по центру выглядит бедно. */
const fireConfetti = () => {
  const colors = ['#e0b64a', '#f2d98c', '#ffffff', '#d84a3f'];

  confetti({ particleCount: 70, spread: 66, origin: { x: 0.2, y: 0.7 }, angle: 60, colors });
  confetti({ particleCount: 70, spread: 66, origin: { x: 0.8, y: 0.7 }, angle: 120, colors });
};

export const GameResult = ({
  isDraw,
  isLoser,
  creditsDelta = 0,
  ratingDelta = 0,
  onExit,
  onRestart,
}: GameResultProps) => {
  const t = useTranslations('result');

  const isWinner = !isDraw && !isLoser;
  const tone = match({ isWinner, isDraw })
    .with({ isWinner: true }, () => 'win' as const)
    .with({ isDraw: true }, () => 'draw' as const)
    .otherwise(() => 'lose' as const);

  useEffect(() => {
    if (isWinner) {
      playSound('win');
      fireConfetti();

      return;
    }

    if (isLoser) {
      playSound('lose');
    }
  }, [isWinner, isLoser]);

  return (
    <div className={s.root}>
      <motion.div
        className={s.panel}
        initial={{ opacity: 0, scale: 0.86, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      >
        <p className={s.title} data-tone={tone}>
          {t(tone === 'win' ? 'win' : tone === 'draw' ? 'draw' : 'lose')}
        </p>

        <p className={s.subtitle}>
          {t(tone === 'win' ? 'winHint' : tone === 'draw' ? 'drawHint' : 'loseHint')}
        </p>

        {(creditsDelta !== 0 || ratingDelta !== 0) && (
          <div className={s.deltas}>
            {creditsDelta !== 0 && (
              <span className={s.delta} data-positive={creditsDelta > 0}>
                <NumberFlow value={creditsDelta} format={{ signDisplay: 'always' }} />
              </span>
            )}

            {ratingDelta > 0 && (
              <span className={s.rating}>{t('rating', { value: ratingDelta })}</span>
            )}
          </div>
        )}

        <div className={s.actions}>
          {onRestart && (
            <Button variant="primary" size="lg" isFullWidth onClick={onRestart}>
              {t('playAgain')}
            </Button>
          )}

          <Button variant={onRestart ? 'ghost' : 'primary'} size="lg" isFullWidth onClick={onExit}>
            {t(onRestart ? 'toMenu' : 'leaveTable')}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
