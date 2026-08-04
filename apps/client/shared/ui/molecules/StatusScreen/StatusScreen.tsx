import s from './StatusScreen.module.scss';

import type { StatusScreenProps } from './StatusScreen.types';

/**
 * Полноэкранное сообщение на сукне: 404, ошибка, загрузка.
 *
 * Общий макет вынесен сюда, потому что служебные страницы Next
 * (`not-found`, `error`, `global-error`) не могут делить между собой
 * layout — каждая рендерится самостоятельно.
 */
export const StatusScreen = ({ icon, title, description, details, actions }: StatusScreenProps) => (
  <div className={s.root}>
    <div className={s.panel}>
      {icon && (
        <div className={s.icon} aria-hidden>
          {icon}
        </div>
      )}

      <h1 className={s.title}>{title}</h1>

      {description && <p className={s.description}>{description}</p>}

      {details && <pre className={s.details}>{details}</pre>}

      {actions && <div className={s.actions}>{actions}</div>}
    </div>
  </div>
);
