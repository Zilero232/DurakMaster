import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { ARE_BOTS_ENABLED } from '@/shared/config';
import { Avatar, Button, LoserHat } from '@/ui-kit';

import type { TableBarProps } from './TableBar.types';

import { SeatChatter } from '../SeatChatter';
import { SeatTimer } from '../SeatTimer';
import { WalletChip } from '../WalletChip';
import { AVATAR_DIAMETER, HAT_SIZE, RING_DIAMETER, styles } from './TableBar.styles';

export const TableBar = ({
  profile,
  chatter,
  isWaiting,
  isReady,
  isMyTurn,
  isLoser = false,
  hasFreeSeat,
  turnDeadline,
  turnSeconds,
  actions,
  extras,
  onReady,
  onAddBot,
  onOpenEmojis
}: TableBarProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.wrap}>
      {profile && (
        <View style={styles.walletRow}>
          <WalletChip coins={profile.coins} credits={profile.credits} />
        </View>
      )}

      <View style={styles.root}>
        <View style={styles.slot}>
          {isWaiting ? (
            <>
              <Button
                style={styles.action}
                variant={isReady ? 'ghost' : 'primary'}
                onPress={() => onReady(!isReady)}
              >
                {t(isReady ? 'table.notReady' : 'table.ready')}
              </Button>

              {ARE_BOTS_ENABLED && hasFreeSeat && (
                <Button style={styles.action} variant='ghost' onPress={onAddBot}>
                  {t('table.addBot')}
                </Button>
              )}
            </>
          ) : (
            actions
          )}
        </View>

        <Pressable
          accessibilityLabel={t('emojis.title')}
          accessibilityRole='button'
          style={styles.seat}
          onPress={onOpenEmojis}
        >
          <View style={styles.avatarRing}>
            {isLoser && <LoserHat size={HAT_SIZE} style={styles.hat} />}

            <Avatar
              name={profile?.name ?? ''}
              size={AVATAR_DIAMETER}
              src={profile?.avatarUrl ?? null}
            />

            {isMyTurn && turnSeconds > 0 && (
              <SeatTimer deadline={turnDeadline} size={RING_DIAMETER} totalSeconds={turnSeconds} />
            )}

            <SeatChatter chatter={chatter} size={AVATAR_DIAMETER} />
          </View>
        </Pressable>

        <View style={[styles.slot, styles.slotEnd]}>{isWaiting ? null : extras}</View>
      </View>
    </View>
  );
};
