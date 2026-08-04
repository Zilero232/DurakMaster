'use client';

import { getRankInfo } from '@durak-master/schemas';
import NumberFlow from '@number-flow/react';
import { Coins, Crown, Gift, Plus, Wallet } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Avatar } from '@/shared/ui';

import s from './WalletBar.module.scss';

import type { WalletBarProps } from './WalletBar.types';

/**
 * Шапка профиля: кто ты, какого ты уровня и сколько у тебя.
 *
 * Балансы анимируются перекатом цифр — выигрыш должен ощущаться, а не
 * просто менять число на экране.
 */
export const WalletBar = ({
  profile,
  onClaimBonus,
  onTopUpCoins,
  onTopUpCredits,
}: WalletBarProps) => {
  const t = useTranslations('profile');

  const { credits, coins, nextFreeCreditsAt } = profile;
  const rank = getRankInfo(profile.rating);
  const winRate =
    profile.gamesPlayed > 0 ? Math.round((profile.gamesWon / profile.gamesPlayed) * 100) : 0;

  // Бонус доступен, если его ещё не брали либо интервал уже прошёл.
  const isBonusReady = nextFreeCreditsAt === null || nextFreeCreditsAt <= Date.now();

  return (
    <div className={s.root}>
      <div className={s.top}>
        <div className={s.identity}>
          <div className={s.avatarWrap}>
            <Avatar name={profile.name} src={profile.avatarUrl} size={52} />
            <span className={s.level}>{rank.level}</span>
          </div>

          <div className={s.info}>
            <span className={s.name}>{profile.name}</span>
            <span className={s.league} style={{ color: rank.league.color }}>
              {rank.league.name}
            </span>
          </div>

          {profile.isPremium && <Crown size={22} className={s.premium} aria-label={t('premium')} />}
        </div>

        <div className={s.wallets}>
          <div className={s.wallet}>
            <Coins size={20} className={s.coinIcon} aria-hidden />
            <NumberFlow value={coins} className={s.amount} />
            <button
              type="button"
              className={s.topUp}
              aria-label={t('topUpCoins')}
              onClick={onTopUpCoins}
            >
              <Plus size={16} aria-hidden />
            </button>
          </div>

          <div className={s.wallet}>
            <Wallet size={20} className={s.creditIcon} aria-hidden />
            <NumberFlow value={credits} className={s.amount} />
            <button
              type="button"
              className={s.topUp}
              aria-label={t('topUpCredits')}
              onClick={onTopUpCredits}
            >
              <Plus size={16} aria-hidden />
            </button>
          </div>
        </div>
      </div>

      {/* Бонус показывается только когда доступен — иначе это мёртвая кнопка,
          которая приучает по ней не нажимать. */}
      {isBonusReady && onClaimBonus && (
        <button type="button" className={s.bonus} onClick={onClaimBonus}>
          <Gift size={18} aria-hidden />
          <span>{t('claimBonus')}</span>
        </button>
      )}

      {/* Прогресс до следующего уровня: шкала показывает, что рост идёт. */}
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
        <Stat label={t('rating')} value={profile.rating} />
        <Stat label={t('games', { count: profile.gamesPlayed })} value={profile.gamesPlayed} />
        <Stat label={t('wins')} value={winRate} suffix="%" />
      </dl>
    </div>
  );
};

type StatProps = {
  label: string;
  value: number;
  suffix?: string;
};

const Stat = ({ label, value, suffix }: StatProps) => (
  <div className={s.stat}>
    <dt className={s.statLabel}>{label}</dt>
    <dd className={s.statValue}>
      <NumberFlow value={value} />
      {suffix}
    </dd>
  </div>
);
