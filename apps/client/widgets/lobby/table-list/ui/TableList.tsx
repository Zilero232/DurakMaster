'use client';

import { ChevronRight, Crown, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { formatCredits } from '@/shared/lib/format';
import { Avatar } from '@/shared/ui';
import { TableBadges } from './components';

import s from './TableList.module.scss';

import type { TableListProps } from './TableList.types';

/** Строки появляются лесенкой — список оживает вместо мгновенной вспышки. */
const ROW_MOTION = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
} as const;

export const TableList = ({ tables, onJoin }: TableListProps) => {
  const t = useTranslations('lobby');

  if (tables.length === 0) {
    return (
      <div className={s.empty}>
        <p className={s.emptyTitle}>{t('empty')}</p>
        <p className={s.emptyHint}>{t('emptyHint')}</p>
      </div>
    );
  }

  return (
    <ul className={s.list}>
      {tables.map((table, index) => {
        const { players, settings, hasPremiumPlayer } = table;
        const isFull = players.length >= settings.maxPlayers;
        const isPlaying = table.status === 'playing';
        const isBlocked = isFull || isPlaying;

        return (
          <motion.li
            key={table.id}
            className={s.item}
            data-premium={hasPremiumPlayer}
            data-blocked={isBlocked}
            {...ROW_MOTION}
            transition={{ delay: Math.min(index * 0.04, 0.3) }}
          >
            <button
              type="button"
              className={s.row}
              disabled={isBlocked}
              onClick={() => onJoin(table.id)}
            >
              <span className={s.betColumn}>
                <span className={s.bet}>{formatCredits(settings.bet)}</span>

                <span className={s.seats}>
                  {/* Точками показываем занятые и свободные места: «3/4»
                      требует чтения, а точки видно боковым зрением. */}
                  {Array.from({ length: settings.maxPlayers }, (_, seat) => (
                    <span
                      // biome-ignore lint/suspicious/noArrayIndexKey: место за столом определяется номером
                      key={`${table.id}-seat-${seat}`}
                      className={s.seat}
                      data-taken={seat < players.length}
                    />
                  ))}
                </span>
              </span>

              <span className={s.main}>
                <span className={s.players}>
                  {players.slice(0, 4).map((player) => (
                    <Avatar
                      key={player.userId}
                      name={player.name}
                      src={player.avatarUrl}
                      size={26}
                      className={s.playerAvatar}
                    />
                  ))}

                  <span className={s.names}>
                    {players.map((player) => player.name).join(', ') || t('emptySeats')}
                  </span>

                  {hasPremiumPlayer && (
                    <Crown size={15} className={s.premium} aria-label={t('premiumPlayer')} />
                  )}
                  {settings.isPrivate && (
                    <Lock size={14} className={s.lock} aria-label={t('privateTable')} />
                  )}
                </span>

                <TableBadges settings={settings} />
              </span>

              <span className={s.action}>
                {isBlocked ? (
                  <span className={s.blocked}>{isPlaying ? t('inProgress') : t('full')}</span>
                ) : (
                  <ChevronRight size={22} aria-hidden />
                )}
              </span>
            </button>
          </motion.li>
        );
      })}
    </ul>
  );
};
