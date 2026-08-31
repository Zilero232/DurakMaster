import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { cardKey } from '@/shared/lib/cards';
import { PlayingCard, Sheet } from '@/ui-kit';

import type { RevealedCardsProps } from './RevealedCards.types';

import { CARD_WIDTH } from './RevealedCards.config';
import { styles } from './RevealedCards.styles';

export const RevealedCards = ({ boost, cards, onClose }: RevealedCardsProps) => {
  const { t } = useTranslation();

  return (
    <Sheet isOpen={boost !== null} title={boost ? t(`boosts.${boost}`) : ''} onClose={onClose}>
      <View style={styles.cards}>
        {cards.map((card) => (
          <PlayingCard key={cardKey(card)} card={card} width={CARD_WIDTH} />
        ))}
      </View>
    </Sheet>
  );
};
