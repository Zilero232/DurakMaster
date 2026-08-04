'use client';

import {
  Award,
  BookOpen,
  Gift,
  Newspaper,
  Play,
  Settings,
  Share2,
  UserRound,
  Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { playSound } from '@/shared/lib/sound';

import s from './ProfileMenu.module.scss';

import type { ProfileMenuItem, ProfileMenuProps } from './ProfileMenu.types';

/**
 * Главное меню игрока.
 *
 * Сетка плиток вместо списка ссылок: разделы игры равноправны, и плитка
 * с иконкой находится взглядом быстрее строки текста.
 */
export const ProfileMenu = ({ onQuickGame, onOpenSettings, onOpenRules }: ProfileMenuProps) => {
  const t = useTranslations('menu');

  const items: ProfileMenuItem[] = [
    { id: 'news', icon: Newspaper, labelKey: 'news', isLocked: true },
    { id: 'friends', icon: Users, labelKey: 'friends', isLocked: true },
    { id: 'items', icon: Gift, labelKey: 'items', isLocked: true },
    { id: 'leaderboard', icon: Award, labelKey: 'leaderboard', isLocked: true },
    { id: 'achievements', icon: UserRound, labelKey: 'achievements', isLocked: true },
    { id: 'settings', icon: Settings, labelKey: 'settings', onClick: onOpenSettings },
    { id: 'share', icon: Share2, labelKey: 'share', isLocked: true },
    { id: 'rules', icon: BookOpen, labelKey: 'rules', onClick: onOpenRules },
  ];

  const handleQuickGame = () => {
    playSound('click');
    onQuickGame();
  };

  return (
    <div className={s.root}>
      <button type="button" className={s.quickGame} onClick={handleQuickGame}>
        <Play size={30} fill="currentColor" aria-hidden />
        <span className={s.quickGameLabel}>{t('quickGame')}</span>
      </button>

      <div className={s.grid}>
        {items.map(({ id, icon: Icon, labelKey, badge, isLocked, onClick }) => (
          <button
            key={id}
            type="button"
            className={s.item}
            data-locked={isLocked}
            disabled={isLocked}
            onClick={onClick}
          >
            <span className={s.itemTop}>
              <Icon size={22} aria-hidden />
              {badge && <span className={s.badge}>{badge}</span>}
            </span>

            <span className={s.itemLabel}>{t(labelKey)}</span>
            {isLocked && <span className={s.soon}>{t('soon')}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};
