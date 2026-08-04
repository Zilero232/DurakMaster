'use client';

import { useTranslations } from 'next-intl';

import { useSettingsStore } from '@/entities/settings';
import { LOCALE_LABELS, LOCALES, useLocale } from '@/shared/i18n';
import { CARD_THEMES } from '@/shared/lib/cards';
import { playSound } from '@/shared/lib/sound';
import { Modal } from '@/shared/ui';

import s from './SettingsPanel.module.scss';

type SettingsPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * Карта в образце колоды.
 *
 * Обычный <img>: карты — статические SVG фиксированного размера,
 * оптимизировать нечего, а в статическом экспорте оптимизатор отключён.
 */
const ThemeImage = ({ src, className }: { src: string; className: string }) => (
  // biome-ignore lint/performance/noImgElement: статический SVG, next/image не даёт выигрыша
  <img src={src} alt="" className={className} draggable={false} />
);

export const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
  const t = useTranslations('settings');
  const { locale, setLocale } = useLocale();

  const cardTheme = useSettingsStore((store) => store.cardTheme);
  const setCardTheme = useSettingsStore((store) => store.setCardTheme);
  const volume = useSettingsStore((store) => store.volume);
  const setVolume = useSettingsStore((store) => store.setVolume);
  const showHints = useSettingsStore((store) => store.showHints);
  const setShowHints = useSettingsStore((store) => store.setShowHints);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('title')}>
      <div className={s.sections}>
        <section className={s.section}>
          <h3 className={s.sectionTitle}>{t('language')}</h3>

          <div className={s.options}>
            {LOCALES.map((item) => (
              <button
                key={item}
                type="button"
                className={s.option}
                data-active={locale === item}
                onClick={() => setLocale(item)}
              >
                {LOCALE_LABELS[item]}
              </button>
            ))}
          </div>
        </section>

        <section className={s.section}>
          <h3 className={s.sectionTitle}>{t('cardTheme')}</h3>

          <div className={s.themes}>
            {CARD_THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                className={s.theme}
                data-active={cardTheme === theme.id}
                onClick={() => {
                  setCardTheme(theme.id);
                  playSound('deal');
                }}
              >
                {/* Живой образец колоды: подписи мало — тему выбирают глазами. */}
                <span className={s.themePreview} style={{ filter: theme.filter ?? 'none' }}>
                  <ThemeImage src={`/cards/atlas/back_${theme.back}.svg`} className={s.themeBack} />
                  <ThemeImage src="/cards/atlas/ace_spades.svg" className={s.themeCard} />
                </span>

                <span className={s.themeName}>{t(`themes.${theme.id}`)}</span>
              </button>
            ))}
          </div>
        </section>

        <section className={s.section}>
          <h3 className={s.sectionTitle}>{t('sound')}</h3>

          <label className={s.slider}>
            <span className={s.sliderLabel}>{t('volume')}</span>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={Math.round(volume * 100)}
              aria-label={t('volume')}
              onChange={(event) => setVolume(Number(event.target.value) / 100)}
              // Звук проверяется на отпускании: на каждом шаге получилась бы трель.
              onPointerUp={() => playSound('play')}
            />
            <span className={s.sliderValue}>{Math.round(volume * 100)}%</span>
          </label>
        </section>

        <section className={s.section}>
          <label className={s.toggle}>
            <input
              type="checkbox"
              checked={showHints}
              onChange={(event) => setShowHints(event.target.checked)}
            />
            <span>
              <span className={s.toggleTitle}>{t('hints')}</span>
              <span className={s.toggleHint}>{t('hintsDescription')}</span>
            </span>
          </label>
        </section>
      </div>
    </Modal>
  );
};
