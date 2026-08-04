'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import { Avatar } from '@/shared/ui';

import s from './OpponentSeat.module.scss';

import type { PlayerState } from '@durak-master/schemas';

type OpponentSeatProps = {
  player: PlayerState;
  name: string;
  avatarUrl?: string | null;
  /** Последняя реплика игрока — всплывает пузырём над аватаром. */
  phrase?: string;
  isAttacker: boolean;
  isDefender: boolean;
  isActive: boolean;
};

/** Сколько рубашек рисуем максимум — дальше только счётчик. */
const MAX_VISIBLE_BACKS = 6;

export const OpponentSeat = ({
  player,
  name,
  avatarUrl = null,
  phrase,
  isAttacker,
  isDefender,
  isActive,
}: OpponentSeatProps) => {
  const t = useTranslations('table');

  const visible = Math.min(player.handCount, MAX_VISIBLE_BACKS);

  return (
    <div className={clsx(s.root, isActive && s.active, player.isOut && s.out)}>
      <div className={s.cards}>
        {Array.from({ length: visible }, (_, index) => (
          <div
            // Рубашки неразличимы и не переупорядочиваются — индекс безопасен.
            // biome-ignore lint/suspicious/noArrayIndexKey: одинаковые рубашки без идентичности
            key={`back-${player.userId}-${index}`}
            className={s.back}
            style={{ transform: `translateX(${index * 11}px) rotate(${(index - 2) * 3}deg)` }}
          />
        ))}
        {player.handCount > 0 && <span className={s.count}>{player.handCount}</span>}
      </div>

      <div className={s.identity}>
        <Avatar name={name} src={avatarUrl} size={28} />

        <div className={s.info}>
          <span className={s.name}>{name}</span>
          {isAttacker && <span className={s.role}>{t('role.attacks')}</span>}
          {isDefender && <span className={clsx(s.role, s.defender)}>{t('role.defends')}</span>}
          {player.isOut && <span className={s.role}>{t('role.out')}</span>}
          {player.isDisconnected && (
            <span className={clsx(s.role, s.offline)}>{t('role.offline')}</span>
          )}
        </div>
      </div>

      {/* key по тексту перезапускает анимацию, когда фраза повторяется. */}
      {phrase && (
        <span key={phrase} className={s.phrase}>
          {phrase}
        </span>
      )}
    </div>
  );
};
