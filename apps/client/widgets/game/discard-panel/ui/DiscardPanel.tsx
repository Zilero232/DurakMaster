'use client';

import { useTranslations } from 'next-intl';

import { cardKey } from '@/shared/lib/cards';
import { Modal, PlayingCard } from '@/shared/ui';

import s from './DiscardPanel.module.scss';

import type { Card } from '@durak-master/schemas';

type DiscardPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  cards: Card[];
};

/**
 * Просмотр отбоя.
 *
 * Бесплатно и без ограничений — в отличие от конкурентов, которые продают
 * эту функцию за внутреннюю валюту. Отбой не содержит скрытой информации:
 * все эти карты уже лежали на столе открытыми, и платить за них значит
 * платить за собственную память.
 */
export const DiscardPanel = ({ isOpen, onClose, cards }: DiscardPanelProps) => {
  const t = useTranslations('discard');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('title')}>
      {cards.length === 0 ? (
        <p className={s.empty}>{t('empty')}</p>
      ) : (
        <>
          <p className={s.count}>{t('count', { count: cards.length })}</p>

          <div className={s.grid}>
            {cards.map((card, index) => (
              // На колоде 52 ранг и масть повторяются, поэтому в ключе нужен
              // индекс. Порядок отбоя не меняется — карты только добавляются
              // в конец, — так что переиспользования состояния не будет.
              // biome-ignore lint/suspicious/noArrayIndexKey: отбой только растёт с конца
              <PlayingCard key={`${cardKey(card)}:${index}`} card={card} className={s.card} />
            ))}
          </div>
        </>
      )}
    </Modal>
  );
};
