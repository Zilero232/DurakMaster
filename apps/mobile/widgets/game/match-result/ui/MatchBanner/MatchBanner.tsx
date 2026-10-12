import { Handshake, TrendingUp, Wallet } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, Text, View } from 'react-native';

import { colors, LoserHat } from '@/ui-kit';

import type { MatchBannerProps } from './MatchBanner.types';

import { pickOutcome, signed } from '../../lib';
import { useAutoDismiss, useResultFanfare } from '../../model/hooks';
import { ResultDelta } from '../components';
import { CoinBurst, PopIn, WinnerCrown } from './components';
import {
  ART_DELAY_MS,
  ART_SIZE,
  BANNER_MS,
  DELTAS_DELAY_MS,
  TITLE_DELAY_MS
} from './MatchBanner.config';
import { styles } from './MatchBanner.styles';

export const MatchBanner = ({
  isLoser,
  reason,
  isDraw,
  creditsDelta,
  ratingDelta,
  onDone
}: MatchBannerProps) => {
  const { t } = useTranslation();

  useResultFanfare({ isDraw, isLoser });
  useAutoDismiss({ afterMs: BANNER_MS, onDismiss: onDone });

  const outcome = pickOutcome({ isDraw, isLoser, reason });
  const isWin = !isDraw && !isLoser;

  return (
    <Modal statusBarTranslucent transparent visible animationType='fade' onRequestClose={onDone}>
      <View style={styles.root}>
        <Pressable
          accessibilityLabel={t(outcome.title)}
          accessibilityRole='button'
          style={styles.scrim}
          onPress={onDone}
        />

        <View pointerEvents='none' style={styles.center}>
          {isWin && <CoinBurst />}

          <PopIn delayMs={ART_DELAY_MS} motion='drop'>
            {outcome.isFool && <LoserHat size={ART_SIZE} />}

            {isWin && <WinnerCrown size={ART_SIZE} />}

            {isDraw && <Handshake color={colors.accent} size={ART_SIZE * 0.7} />}
          </PopIn>

          <PopIn delayMs={TITLE_DELAY_MS} motion='zoom'>
            <Text style={[styles.title, isLoser && styles.titleLoser, isWin && styles.titleWin]}>
              {t(outcome.title)}
            </Text>
          </PopIn>

          <PopIn delayMs={DELTAS_DELAY_MS} motion='rise' style={styles.deltas}>
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
          </PopIn>

          <Text style={styles.hint}>{t(outcome.hint)}</Text>
        </View>
      </View>
    </Modal>
  );
};
