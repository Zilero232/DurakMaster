import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

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
    return <View style={styles.root} />;
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
