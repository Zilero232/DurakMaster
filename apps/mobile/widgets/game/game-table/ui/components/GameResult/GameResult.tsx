import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { match } from 'ts-pattern';

import { haptic } from '@/shared/lib/haptics';
import { playSound } from '@/shared/lib/sound';
import { Button } from '@/ui-kit';

import type { GameResultProps, ResultTone } from './GameResult.types';

import { styles } from './GameResult.styles';

const TONE_STYLE = {
  win: styles.win,
  draw: styles.draw,
  lose: styles.lose
} satisfies Record<ResultTone, unknown>;

export const GameResult = ({
  isDraw,
  isLoser,
  creditsDelta = 0,
  ratingDelta = 0,
  onExit,
  onRestart
}: GameResultProps) => {
  const { t } = useTranslation();

  const isWinner = !isDraw && !isLoser;
  const tone = match({ isWinner, isDraw })
    .with({ isWinner: true }, (): ResultTone => 'win')
    .with({ isDraw: true }, (): ResultTone => 'draw')
    .otherwise((): ResultTone => 'lose');

  useEffect(() => {
    if (isWinner) {
      playSound('win');
      haptic('win');

      return;
    }

    if (isLoser) {
      playSound('lose');
      haptic('lose');
    }
  }, [isWinner, isLoser]);

  return (
    <Animated.View entering={FadeIn.duration(200)} style={styles.root}>
      <Animated.View entering={ZoomIn.springify().damping(26).stiffness(320)} style={styles.panel}>
        <Text style={[styles.title, TONE_STYLE[tone]]}>{t(`result.${tone}`)}</Text>

        <Text style={styles.subtitle}>{t(`result.${tone}Hint`)}</Text>

        {(creditsDelta !== 0 || ratingDelta !== 0) && (
          <View style={styles.deltas}>
            {creditsDelta !== 0 && (
              <Text style={[styles.delta, creditsDelta > 0 && styles.positive]}>
                {creditsDelta > 0 ? `+${creditsDelta}` : creditsDelta}
              </Text>
            )}

            {ratingDelta > 0 && (
              <Text style={styles.rating}>{t('result.rating', { value: ratingDelta })}</Text>
            )}
          </View>
        )}

        <View style={styles.actions}>
          {onRestart && (
            <Button isFullWidth size='lg' variant='primary' onPress={onRestart}>
              {t('result.playAgain')}
            </Button>
          )}

          <Button isFullWidth size='lg' variant={onRestart ? 'ghost' : 'primary'} onPress={onExit}>
            {t(onRestart ? 'result.toMenu' : 'result.leaveTable')}
          </Button>
        </View>
      </Animated.View>
    </Animated.View>
  );
};
