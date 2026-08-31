import { Clapperboard } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { Button, colors, iconSize } from '@/ui-kit';

import { useWatchAd } from '../../model';
import { styles } from './WatchAdButton.styles';

export const WatchAdButton = () => {
  const { t } = useTranslation();

  const { isAvailable, isBusy, watch } = useWatchAd();

  if (!isAvailable) {
    return null;
  }

  return (
    <Button isFullWidth isLoading={isBusy} size='sm' variant='secondary' onPress={watch}>
      <Clapperboard color={colors.foreground} size={iconSize.sm} />

      <Text style={styles.label}>{t('profile.watchAd')}</Text>
    </Button>
  );
};
