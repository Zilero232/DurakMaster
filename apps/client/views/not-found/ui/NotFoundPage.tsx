'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/shared/ui';
import { StatusScreen } from '@/shared/ui/molecules/StatusScreen';

/**
 * Страница 404.
 *
 * Возврат делается через `window.location`, а не router.push: приложение
 * собирается статически и живёт в том числе внутри Tauri, где переход
 * должен полностью пересобрать состояние сессии.
 */
export const NotFoundPage = () => {
  const t = useTranslations('notFound');

  return (
    <StatusScreen
      icon={<SuitGlyph />}
      title={t('title')}
      description={t('description')}
      actions={
        <Button variant="primary" isFullWidth onClick={() => window.location.assign('/')}>
          {t('toMenu')}
        </Button>
      }
    />
  );
};

/** Перевёрнутая карта вместо абстрактной иконки — язык самой игры. */
const SuitGlyph = () => (
  <svg width="72" height="72" viewBox="0 0 64 64" fill="none" role="presentation">
    <rect
      x="14"
      y="8"
      width="36"
      height="48"
      rx="5"
      fill="var(--surface-2)"
      stroke="var(--border-gold)"
      strokeWidth="2"
    />
    <text
      x="32"
      y="42"
      textAnchor="middle"
      fontSize="26"
      fontWeight="700"
      fill="var(--gold)"
      fontFamily="system-ui, sans-serif"
    >
      ?
    </text>
  </svg>
);
