'use client';

import s from './ModeCard.module.scss';

import type { ModeCardProps } from './ModeCard.types';

/** Плитка режима игры. Активная помечается галочкой — как в референсе. */
export const ModeCard = ({ icon: Icon, label, hint, isActive, onClick }: ModeCardProps) => (
  <button
    type="button"
    className={s.root}
    data-active={isActive}
    aria-pressed={isActive}
    onClick={onClick}
  >
    <span className={s.icon}>
      <Icon size={26} strokeWidth={1.6} aria-hidden />
    </span>

    <span className={s.label}>{label}</span>
    {hint && <span className={s.hint}>{hint}</span>}
  </button>
);
