import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSessionStore } from '@/entities/session';
import { ARE_BOTS_ENABLED } from '@/shared/config';
import { Button, ContentWidth, FeltBackground, TABLE_MAX_WIDTH } from '@/ui-kit';

import type { WaitingTableProps } from './WaitingTable.types';

import { styles } from './WaitingTable.styles';

export const WaitingTable = ({ settings, onLeave }: WaitingTableProps) => {
  const { t } = useTranslation();

  const insets = useSafeAreaInsets();

  const currentTable = useSessionStore((store) => store.currentTable);
  const setReady = useSessionStore((store) => store.setReady);
  const addBot = useSessionStore((store) => store.addBot);
  const profile = useSessionStore((store) => store.profile);

  const players = currentTable?.players ?? [];
  const isReady = players.find((player) => player.userId === profile?.userId)?.isReady ?? false;
  const hasFreeSeat = players.length < settings.maxPlayers;

  return (
    <FeltBackground style={styles.root}>
      <ContentWidth
        maxWidth={TABLE_MAX_WIDTH}
        style={[styles.table, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      >
        <Text style={styles.title}>{t('table.waitingTitle')}</Text>

        <Text style={styles.hint}>
          {t('table.waitingCount', { current: players.length, max: settings.maxPlayers })}
        </Text>

        <View style={styles.actions}>
          <Button
            isFullWidth
            size='lg'
            variant={isReady ? 'ghost' : 'primary'}
            onPress={() => setReady(!isReady)}
          >
            {t(isReady ? 'table.notReady' : 'table.ready')}
          </Button>

          {ARE_BOTS_ENABLED && hasFreeSeat && (
            <Button isFullWidth variant='ghost' onPress={addBot}>
              {t('table.addBot')}
            </Button>
          )}

          <Button isFullWidth variant='ghost' onPress={onLeave}>
            {t('table.leave')}
          </Button>
        </View>
      </ContentWidth>
    </FeltBackground>
  );
};
