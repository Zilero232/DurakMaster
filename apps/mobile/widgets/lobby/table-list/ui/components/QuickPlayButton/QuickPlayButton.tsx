import { Zap } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Button, iconSize } from '@/ui-kit';

import type { QuickPlayButtonProps } from './QuickPlayButton.types';

import { styles } from './QuickPlayButton.styles';

export const QuickPlayButton = ({ isDisabled, onPress }: QuickPlayButtonProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <Button
        isFullWidth
        icon={(color) => <Zap color={color} fill={color} size={iconSize.md} />}
        isDisabled={isDisabled}
        size='lg'
        variant='primary'
        onPress={onPress}
      >
        {t('lobby.quickPlay')}
      </Button>
    </View>
  );
};
