import { Nunito, Rubik } from 'next/font/google';

import { DEFAULT_LOCALE } from '@/shared/i18n/config';
import { AppProviders } from './providers';

import type { Metadata, Viewport } from 'next';

import './globals.scss';

/**
 * Интерфейсный шрифт. Скруглённый гротеск с большой высотой строчных:
 * он дружелюбный, как и положено игре, и хорошо читается мелким кеглем
 * в подписях под иконками.
 */
const sans = Nunito({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

/**
 * Заголовки и суммы. Плотный геометрический гротеск: цифры ставок должны
 * читаться как счёт на табло, а не как книжный текст — антиква с тонкими
 * засечками для этого не годится.
 */
const display = Rubik({
  subsets: ['latin', 'cyrillic'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Дурак Мастер',
  description: 'Онлайн-дурак: подкидной и переводной, 2–6 игроков',
  applicationName: 'DurakMaster',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  // Стол занимает весь экран — контент должен заходить под вырез.
  viewportFit: 'cover',
  themeColor: '#12351f',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

/**
 * Язык проставляется атрибутом по умолчанию, а на клиенте уточняется
 * из сохранённого выбора: статический экспорт не знает про запрос,
 * а в Tauri сервера нет вовсе.
 */
const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang={DEFAULT_LOCALE} className={`${sans.variable} ${display.variable}`}>
    <body>
      <AppProviders>{children}</AppProviders>
    </body>
  </html>
);

export default RootLayout;
