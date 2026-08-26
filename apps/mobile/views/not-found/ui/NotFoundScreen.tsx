import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Button, StatusScreen, SuitIcon } from '@/ui-kit';

export const NotFoundScreen = () => {
  const { t } = useTranslation();

  const router = useRouter();

  return (
    <StatusScreen
      actions={
        <Button
          isFullWidth
          variant='primary'
          onPress={() => {
            router.replace('/');
          }}
        >
          {t('notFound.toMenu')}
        </Button>
      }
      description={t('notFound.description')}
      icon={<SuitIcon size={64} suit='spades' />}
      title={t('notFound.title')}
    />
  );
};
