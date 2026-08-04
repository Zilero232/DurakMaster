'use client';

import { Coins, Crown, Lock, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { formatCredits } from '@/shared/lib/format';
import { Button } from '@/shared/ui';

import s from './TableList.module.scss';

import type { LobbyTable } from '@durak-master/schemas';

type TableListProps = {
  tables: LobbyTable[];
  onJoin: (tableId: string) => void;
};

export const TableList = ({ tables, onJoin }: TableListProps) => {
  const t = useTranslations('lobby');
  const tMode = useTranslations('create.mode');

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
      {tables.map((table) => {
        const isFull = table.players.length >= table.settings.maxPlayers;
        const isPlaying = table.status === 'playing';
        const isBlocked = isFull || isPlaying;

        return (
          <li key={table.id} className={s.item} data-premium={table.hasPremiumPlayer}>
            <div className={s.info}>
              <div className={s.bet}>
                <Coins size={16} aria-hidden />
                <span>{formatCredits(table.settings.bet)}</span>
                {table.hasPremiumPlayer && (
                  <Crown size={14} className={s.premium} aria-label={t('premiumPlayer')} />
                )}
                {table.settings.isPrivate && <Lock size={13} aria-label={t('privateTable')} />}
              </div>

              <div className={s.meta}>
                <span>{tMode(table.settings.mode)}</span>
                <Dot />
                <span>{table.settings.deckSize}</span>
                {table.settings.fairness === 'cheaters' && (
                  <>
                    <Dot />
                    <span className={s.cheaters}>{tMode('cheaters')}</span>
                  </>
                )}
              </div>
            </div>

            <div className={s.right}>
              <span className={s.players}>
                <Users size={14} aria-hidden />
                {t('playersCount', {
                  current: table.players.length,
                  max: table.settings.maxPlayers,
                })}
              </span>

              <Button
                size="sm"
                variant={isBlocked ? 'ghost' : 'primary'}
                isDisabled={isBlocked}
                onClick={() => onJoin(table.id)}
              >
                {isPlaying ? t('inProgress') : isFull ? t('full') : t('join')}
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const Dot = () => (
  <span className={s.dot} aria-hidden>
    ·
  </span>
);
