'use client';

import { Toaster } from 'sonner';

import { LocaleProvider } from '@/shared/i18n';

type AppProvidersProps = {
  children: React.ReactNode;
};

/**
 * Служебные страницы (`not-found`, `error`) рендерятся вне обычного дерева
 * и не наследуют провайдеры из layout — поэтому каждая подключает эту
 * обёртку сама, иначе на них не будет ни переводов, ни тостов.
 */
export const AppProviders = ({ children }: AppProvidersProps) => (
  <LocaleProvider>
    {children}

    <Toaster
      position="top-center"
      duration={3500}
      toastOptions={{
        style: {
          border: '1px solid var(--border)',
          background: 'var(--surface-overlay)',
          color: 'var(--foreground)',
          backdropFilter: 'blur(var(--glass-blur))',
        },
      }}
    />
  </LocaleProvider>
);
