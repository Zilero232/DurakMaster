import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ARE_BOTS_ENABLED } from '@/shared/config';
import { Button } from '@/ui-kit';

import type { WaitingRoomProps } from './WaitingRoom.types';

import { styles } from './WaitingRoom.styles';

export const WaitingRoom = ({ table, mySeat, onReady, onAddBot, onLeave }: WaitingRoomProps) => {
  const { t } = useTranslation();

  const insets = useSafeAreaInsets();

  const me = table.players.find((player) => player.seat === mySeat);
  const isReady = me?.isReady ?? false;
  const hasFreeSeat = table.players.length < table.settings.maxPlayers;

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.panel}>
        <Text style={styles.title}>{t('table.waitingTitle')}</Text>

        <Text style={styles.count}>
          {t('table.waitingCount', {
            current: table.players.length,
            max: table.settings.maxPlayers
          })}
        </Text>

        <View style={styles.list}>
          {table.players.map((player) => (
            <View key={player.userId} style={styles.player}>
              <Text numberOfLines={1} style={styles.playerName}>
                {player.name}
              </Text>

              <Text style={[styles.mark, player.isReady && styles.markReady]}>
                {player.isReady ? t('table.readyMark') : t('table.waitingMark')}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Button
            isFullWidth
            variant='primary'
            onPress={() => {
              onReady(!isReady);
            }}
          >
            {isReady ? t('table.notReady') : t('table.ready')}
          </Button>

          {hasFreeSeat && ARE_BOTS_ENABLED && (
            <Button isFullWidth variant='ghost' onPress={onAddBot}>
              {t('table.addBot')}
            </Button>
          )}

          <Button isFullWidth variant='ghost' onPress={onLeave}>
            {t('table.leave')}
          </Button>
        </View>
      </View>
    </View>
  );
};
