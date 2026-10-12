import { TrendingUp, Wallet } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { match } from 'ts-pattern';

import { Button, LobbyBackground, LoserHat, RESULT_ART_SIZE } from '@/ui-kit';

import type { MatchResultProps } from './MatchResult.types';

import { signed } from '../../lib';
import { useDismissOnBack, useResultFanfare } from '../../model/hooks';
import { ResultDelta } from './components';
import { OUTCOMES } from './MatchResult.config';
import { SCREEN_GAP, styles } from './MatchResult.styles';

export const MatchResult = ({
  isLoser,
  isDraw,
  creditsDelta,
  ratingDelta,
  canRematch,
  onRematch,
  onToMenu
}: MatchResultProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  useResultFanfare({ isDraw, isLoser });
  useDismissOnBack(canRematch ? onRematch : onToMenu);

  const outcome = match({ isDraw, isLoser })
    .with({ isDraw: true }, () => OUTCOMES.draw)
    .with({ isLoser: true }, () => OUTCOMES.lose)
    .otherwise(() => OUTCOMES.win);

  return (
    <LobbyBackground
      style={[
        styles.root,
        { paddingTop: insets.top + SCREEN_GAP, paddingBottom: insets.bottom + SCREEN_GAP }
      ]}
    >
      <View style={styles.hero}>
        {outcome.isFool && <LoserHat size={RESULT_ART_SIZE} />}

        <Text style={styles.title}>{t(outcome.title)}</Text>

        <Text style={styles.description}>{t(outcome.hint)}</Text>

        <View style={styles.deltas}>
          {creditsDelta !== 0 && (
            <ResultDelta
              icon={Wallet}
              isGain={creditsDelta > 0}
              label={t('result.credits', { value: signed(creditsDelta) })}
            />
          )}

          {ratingDelta !== 0 && (
            <ResultDelta
              icon={TrendingUp}
              isGain={ratingDelta > 0}
              label={t('result.rating', { value: signed(ratingDelta) })}
            />
          )}
        </View>
      </View>

      <View style={styles.actions}>
        {canRematch && (
          <Button isFullWidth size='lg' variant='primary' onPress={onRematch}>
            {t('result.rematch')}
          </Button>
        )}

        <Button
          isFullWidth
          size='lg'
          variant={canRematch ? 'secondary' : 'primary'}
          onPress={onToMenu}
        >
          {t('result.toMenu')}
        </Button>
      </View>
    </LobbyBackground>
  );
};
