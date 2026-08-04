'use client';

import { ArrowLeftRight, Layers, Rabbit, Users, VenetianMask } from 'lucide-react';
import { useTranslations } from 'next-intl';

import s from './TableBadges.module.scss';

import type { TableBadgesProps } from './TableBadges.types';

/**
 * Настройки стола значками.
 *
 * Каждый значок с подписью-подсказкой: ряд одних пиктограмм читается
 * быстро только теми, кто уже выучил их значения, а новичок в таком
 * ряду не различает подкидной и переводной.
 */
export const TableBadges = ({ settings }: TableBadgesProps) => {
  const t = useTranslations('create');
  const tMode = useTranslations('create.mode');

  const { deckSize, mode, throwInScope, fairness, speed } = settings;

  return (
    <ul className={s.root}>
      <li className={s.badge} title={t('deck')}>
        <Layers size={13} aria-hidden />
        <span>{deckSize}</span>
      </li>

      <li className={s.badge} title={t('modes')}>
        <ArrowLeftRight size={13} aria-hidden />
        <span>{tMode(mode)}</span>
      </li>

      <li className={s.badge} title={t('modes')}>
        <Users size={13} aria-hidden />
        <span>{tMode(throwInScope)}</span>
      </li>

      {speed === 'fast' && (
        <li className={s.badge} title={t('speed')}>
          <Rabbit size={13} aria-hidden />
          <span>{t('speedFast')}</span>
        </li>
      )}

      {fairness === 'cheaters' && (
        <li className={`${s.badge} ${s.cheaters}`} title={tMode('cheatersHint')}>
          <VenetianMask size={13} aria-hidden />
          <span>{tMode('cheaters')}</span>
        </li>
      )}
    </ul>
  );
};
