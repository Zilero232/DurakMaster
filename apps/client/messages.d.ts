import type { Messages } from '@/shared/i18n';

/**
 * Типизация ключей переводов.
 *
 * Даёт автодополнение в `useTranslations` и ошибку компиляции на
 * несуществующем ключе — опечатка в строке перевода не доедет до продакшена.
 */
declare module 'next-intl' {
  // Расширение чужого модуля работает только через слияние деклараций,
  // а оно доступно исключительно интерфейсам: с `type` типизация ключей отвалится.
  // biome-ignore lint/style/useConsistentTypeDefinitions: нужно слияние деклараций
  interface AppConfig {
    Messages: Messages;
  }
}
