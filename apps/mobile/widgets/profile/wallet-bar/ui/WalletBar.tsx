import { getRankInfo } from '@durak-master/schemas';
import { Coins, Wallet } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { isNullish } from 'remeda';

import { formatCountdown } from '@/shared/lib/format';
import { useNow } from '@/shared/model/time';
import { colors, Panel } from '@/ui-kit';

import type { WalletBarProps } from './WalletBar.types';

import { BonusButton, PlayerIdentity, WalletAmount } from './components';
import { BONUS_COUNTDOWN_TICK_MS, BONUS_IDLE_TICK_MS } from './WalletBar.config';
import { styles } from './WalletBar.styles';

export const WalletBar = ({
  profile,
  onEdit,
  onClaimBonus,
  onTopUpCoins,
  onTopUpCredits
}: WalletBarProps) => {
  const { t } = useTranslation();

  const { credits, coins, nextFreeCreditsAt } = profile;

  const now = useNow(isNullish(nextFreeCreditsAt) ? BONUS_IDLE_TICK_MS : BONUS_COUNTDOWN_TICK_MS);

  const rank = getRankInfo(profile.rating);
  const isBonusReady = isNullish(nextFreeCreditsAt) || nextFreeCreditsAt <= now;

  const countdown = isBonusReady ? '' : formatCountdown(nextFreeCreditsAt - now);

  return (
    <Panel elevation='floating' style={styles.root}>
      <View style={styles.top}>
        <PlayerIdentity
          avatarUrl={profile.avatarUrl}
          isPremium={profile.isPremium}
          name={profile.name}
          rank={rank}
          onEdit={onEdit}
        />

        <View style={styles.wallets}>
          <WalletAmount
            icon={Coins}
            iconColor={colors.gold}
            topUpLabel={t('profile.topUpCoins')}
            value={coins}
            onTopUp={onTopUpCoins}
          />

          <WalletAmount
            icon={Wallet}
            iconColor={colors.success}
            topUpLabel={t('profile.topUpCredits')}
            value={credits}
            onTopUp={onTopUpCredits}
          />
        </View>
      </View>

      {onClaimBonus && (
        <BonusButton countdown={countdown} isReady={isBonusReady} onClaim={onClaimBonus} />
      )}

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${rank.progress * 100}%`, backgroundColor: rank.league.color }
          ]}
        />
      </View>
    </Panel>
  );
};
