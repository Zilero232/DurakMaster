'use client';

import './globals.scss';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Сбой в самом корневом layout.
 *
 * Эта страница ЗАМЕНЯЕТ корневую разметку целиком, поэтому объявляет
 * собственные `<html>` и `<body>`. Провайдеры сюда подключать нельзя:
 * упасть мог как раз один из них, и тогда экран ошибки упал бы следом.
 * По той же причине текст зашит строками, а не берётся из переводов.
 */
const GlobalError = ({ error, reset }: GlobalErrorProps) => (
  <html lang="ru">
    <body>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100dvh',
          padding: '24px',
          background: '#151a24',
          color: '#f3f4f6',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '420px' }}>
          <h1 style={{ margin: '0 0 12px', fontSize: '24px', color: '#e0b64a' }}>
            Приложение не запустилось
          </h1>

          <p style={{ margin: '0 0 20px', lineHeight: 1.5, color: '#9ca3af' }}>
            Произошёл сбой при загрузке. Перезапустите приложение — прогресс и партии сохранены на
            сервере.
          </p>

          {error.digest && (
            <p style={{ margin: '0 0 20px', fontSize: '12px', color: '#6b7280' }}>
              Код ошибки: {error.digest}
            </p>
          )}

          <button
            type="button"
            onClick={reset}
            style={{
              padding: '12px 28px',
              border: '1px solid rgba(224, 182, 74, 0.45)',
              borderRadius: '8px',
              background: 'rgba(224, 182, 74, 0.14)',
              color: '#e0b64a',
              fontSize: '15px',
              cursor: 'pointer',
            }}
          >
            Перезапустить
          </button>
        </div>
      </div>
    </body>
  </html>
);

export default GlobalError;
