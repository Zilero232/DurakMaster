'use client';

import { getRankInfo } from '@durak-master/schemas';
import { Crown, LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { logout } from '@/shared/api/auth/auth-client';
import { formatNumber } from '@/shared/lib/format';
import { Avatar } from '@/shared/ui';

import s from './ProfileCard.module.scss';

import type { PublicProfile } from '@durak-master/schemas';

type ProfileCardProps = {
  profile: PublicProfile;
  credits?: number;
  coins?: number;
};

export const ProfileCard = ({ profile, credits, coins }: ProfileCardProps) => {
  const t = useTranslations('profile');
  const tAuth = useTranslations('auth');

  const rank = getRankInfo(profile.rating);
  const winRate =
    profile.gamesPlayed > 0 ? Math.round((profile.gamesWon / profile.gamesPlayed) * 100) : 0;

  const handleLogout = async () => {
    await logout();
    // Полная перезагрузка: соединение и состояние стола должны обнулиться
    // вместе с сессией, иначе останутся данные прошлого игрока.
    window.location.reload();
  };

  return (
    <div className={s.root}>
      <div className={s.header}>
        <Avatar name={profile.name} src={profile.avatarUrl} size={56} />

        <div className={s.identity}>
          <div className={s.nameRow}>
            <span className={s.name}>{profile.name}</span>
            {profile.isPremium && (
              <Crown size={15} className={s.premium} aria-label={t('premium')} />
            )}
          </div>

          <div className={s.league} style={{ color: rank.league.color }}>
            {t('level', { league: rank.league.name, level: rank.level })}
          </div>
        </div>

        <button
          type="button"
          className={s.logout}
          aria-label={tAuth('signOut')}
          onClick={handleLogout}
        >
          <LogOut size={18} aria-hidden />
        </button>
      </div>

      {/* Прогресс до следующего уровня — как полоски в референсе. */}
      <div className={s.progressTrack}>
        <div
          className={s.progressFill}
          style={
            {
              '--progress': rank.progress,
              background: rank.league.color,
            } as React.CSSProperties
          }
        />
      </div>

      <dl className={s.stats}>
        <Stat label={t('rating')} value={formatNumber(profile.rating)} />
        {/* Множественное число берёт ICU-формат из переводов: правила
            для русского и английского различаются. */}
        <Stat
          label={t('games', { count: profile.gamesPlayed })}
          value={formatNumber(profile.gamesPlayed)}
        />
        <Stat label={t('wins')} value={`${winRate}%`} />
      </dl>

      {(credits !== undefined || coins !== undefined) && (
        <div className={s.wallet}>
          {credits !== undefined && (
            <span className={s.credits}>{t('credits', { value: formatNumber(credits) })}</span>
          )}
          {coins !== undefined && (
            <span className={s.coins}>{t('coins', { value: formatNumber(coins) })}</span>
          )}
        </div>
      )}
    </div>
  );
};

type StatProps = {
  label: string;
  value: string;
};

const Stat = ({ label, value }: StatProps) => (
  <div className={s.stat}>
    <dt className={s.statLabel}>{label}</dt>
    <dd className={s.statValue}>{value}</dd>
  </div>
);
