import s from './AppSplash.module.scss';

/**
 * Экран загрузки.
 *
 * Веер из четырёх мастей вместо спиннера: он задаёт тон игры с первого
 * кадра и не требует переводов — важно, потому что сплэш показывается
 * раньше, чем поднимется провайдер локали.
 */
export const AppSplash = () => (
  <div className={s.root}>
    <div className={s.fan} aria-hidden>
      {['♠', '♥', '♦', '♣'].map((suit, index) => (
        <span key={suit} className={s.card} style={{ '--index': index } as React.CSSProperties}>
          {suit}
        </span>
      ))}
    </div>

    <span className={s.brand}>DurakMaster</span>
  </div>
);
