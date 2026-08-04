'use client';

import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/shared/ui';
import { StatusScreen } from '@/shared/ui/molecules/StatusScreen';

type ErrorPageProps = {
  error?: Error & { digest?: string };
  /** Повторный рендер участка дерева, где произошёл сбой. */
  reset?: () => void;
};

export const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  const t = useTranslations('errorPage');

  // В продакшене текст ошибки скрыт: он может содержать внутренние пути.
  // `digest` безопасен и позволяет найти запись в логах.
  const details =
    process.env.NODE_ENV === 'development'
      ? (error?.stack ?? error?.message)
      : error?.digest && t('digest', { digest: error.digest });

  return (
    <StatusScreen
      icon={<AlertTriangle size={56} />}
      title={t('title')}
      description={t('description')}
      details={details || undefined}
      actions={
        <>
          {reset && (
            <Button variant="primary" isFullWidth onClick={reset}>
              {t('retry')}
            </Button>
          )}
          <Button variant="ghost" isFullWidth onClick={() => window.location.assign('/')}>
            {t('toMenu')}
          </Button>
        </>
      }
    />
  );
};
