import type { ReactNode } from 'react';

export type StatusScreenProps = {
  /** Крупный символ над заголовком — карточная масть или знак ошибки. */
  icon?: ReactNode;
  title: string;
  description?: string;
  /** Технические подробности: код ошибки, идентификатор запроса. */
  details?: string;
  /** Кнопки действий — обычно «Повторить» и «В меню». */
  actions?: ReactNode;
};
