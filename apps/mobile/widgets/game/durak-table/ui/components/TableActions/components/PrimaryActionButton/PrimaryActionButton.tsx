import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { match } from 'ts-pattern';

import { useReadyPrompt } from '@/entities/game-table';
import { Button, iconSize } from '@/ui-kit';

import { useTableContext } from '../../../../../model';
import { PRIMARY_ACTIONS } from './PrimaryActionButton.config';
import { styles } from './PrimaryActionButton.styles';

export const PrimaryActionButton = () => {
  const { t } = useTranslation();

  const { turn, moves } = useTableContext();

  useReadyPrompt({
    isWaiting: turn.isWaiting,
    isReady: turn.isReady,
    hasFreeSeat: turn.hasFreeSeat
  });

  if (!turn.primaryAction) {
    const status = match(turn.status)
      .with(null, () => '')
      .with({ kind: 'mine' }, () => t('table.status.mine'))
      .with({ kind: 'defends' }, ({ name }) => t('table.status.defends', { name }))
      .with({ kind: 'moves' }, ({ name }) => t('table.status.moves', { name }))
      .exhaustive();

    return (
      <View style={[styles.root, styles.status]}>
        <Text numberOfLines={1} style={styles.statusText}>
          {status}
        </Text>
      </View>
    );
  }

  const { icon: Icon, label, variant } = PRIMARY_ACTIONS[turn.primaryAction];

  return (
    <Button
      icon={(color) => <Icon color={color} size={iconSize.lg} />}
      size='lg'
      style={styles.root}
      variant={variant}
      onPress={moves.onPrimaryAction}
    >
      {t(label)}
    </Button>
  );
};
