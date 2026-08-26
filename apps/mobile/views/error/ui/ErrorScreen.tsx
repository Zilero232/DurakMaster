import { AlertTriangle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { Button, colors, StatusScreen } from '@/ui-kit';

import type { ErrorScreenProps } from './ErrorScreen.types';

export const ErrorScreen = ({ error, onRetry }: ErrorScreenProps) => {
  const { t } = useTranslation();

  return (
    <StatusScreen
      actions={
        onRetry && (
          <Button isFullWidth variant='primary' onPress={onRetry}>
            {t('errorPage.retry')}
          </Button>
        )
      }
      description={t('errorPage.description')}
      details={__DEV__ ? error?.message : undefined}
      icon={<AlertTriangle color={colors.danger} size={56} />}
      title={t('errorPage.title')}
    />
  );
};
