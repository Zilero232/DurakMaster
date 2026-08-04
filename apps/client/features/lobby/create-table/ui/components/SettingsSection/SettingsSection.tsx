import s from './SettingsSection.module.scss';

import type { SettingsSectionProps } from './SettingsSection.types';

export const SettingsSection = ({ title, children }: SettingsSectionProps) => (
  <section className={s.root}>
    <h3 className={s.title}>{title}</h3>
    {children}
  </section>
);
