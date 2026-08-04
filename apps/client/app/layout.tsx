import { Alegreya_Sans, Playfair_Display } from 'next/font/google';

import { DEFAULT_LOCALE } from '@/shared/i18n/config';
import { AppProviders } from './providers';

import type { Metadata, Viewport } from 'next';

import './globals.scss';

/**
 * Интерфейсный шрифт. Гуманистический гротеск: у него есть характер,
 * которого нет у системного, и полноценная кириллица — имена игроков
 * и ставки не должны проваливаться в подстановочный шрифт.
 */
const sans = Alegreya_Sans({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

/**
 * Акцидентный шрифт заголовков и ставок. Антиква с высоким контрастом
 * штрихов задаёт тон карточного клуба — гротеском такого не добиться.
 */
const display = Playfair_Display({
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
