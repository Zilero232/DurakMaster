'use client';

import { Check } from 'lucide-react';

import s from './ModeCard.module.scss';

import type { ModeCardProps } from './ModeCard.types';

/** Плитка режима игры. Активная помечается галочкой — как в референсе. */
export const ModeCard = ({ label, hint, isActive, onClick }: ModeCardProps) => (
  <button
    type="button"
    className={s.root}
    data-active={isActive}
    aria-pressed={isActive}
    onClick={onClick}
  >
    <span className={s.label}>{label}</span>
    {hint && <span className={s.hint}>{hint}</span>}
    {isActive && <Check size={13} className={s.check} aria-hidden />}
  </button>
);
