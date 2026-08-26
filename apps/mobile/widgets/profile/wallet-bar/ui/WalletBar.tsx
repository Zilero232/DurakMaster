import { getRankInfo } from '@durak-master/schemas';
import { Coins, Gift, Wallet } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { isNullish } from 'remeda';

import { useNow } from '@/shared/lib/time';
import { colors } from '@/ui-kit';

import type { WalletBarProps } from './WalletBar.types';

import { PlayerIdentity, ProfileStats, WalletAmount } from './components';
import { styles } from './WalletBar.styles';

const BONUS_CHECK_INTERVAL_MS = 30_000;

export const WalletBar = ({
  profile,
  onClaimBonus,
  onTopUpCoins,
  onTopUpCredits
}: WalletBarProps) => {
  const { t } = useTranslation();

  const now = useNow(BONUS_CHECK_INTERVAL_MS);

  const { credits, coins, nextFreeCreditsAt } = profile;

  const rank = getRankInfo(profile.rating);
  const winRate =
    profile.gamesPlayed > 0 ? Math.round((profile.gamesWon / profile.gamesPlayed) * 100) : 0;

  const isBonusReady = isNullish(nextFreeCreditsAt) || nextFreeCreditsAt <= now;

  return (
    <View style={styles.root}>
      <View style={styles.top}>
        <PlayerIdentity
          avatarUrl={profile.avatarUrl}
          isPremium={profile.isPremium}
          name={profile.name}
          rank={rank}
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

      {isBonusReady && onClaimBonus && (
        <Pressable
          accessibilityHint={t('profile.bonusHint')}
          accessibilityRole='button'
          style={({ pressed }) => [styles.bonus, pressed && styles.bonusPressed]}
          onPress={onClaimBonus}
        >
          <Gift color={colors.primaryForeground} size={18} />

          <Text style={styles.bonusLabel}>{t('profile.claimBonus')}</Text>
        </Pressable>
      )}

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${rank.progress * 100}%`, backgroundColor: rank.league.color }
          ]}
        />
      </View>

      <ProfileStats gamesPlayed={profile.gamesPlayed} rating={profile.rating} winRate={winRate} />
    </View>
  );
};
