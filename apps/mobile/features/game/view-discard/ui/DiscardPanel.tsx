import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { cardKey, PlayingCard, Sheet } from '@/ui-kit';

import type { DiscardPanelProps } from './DiscardPanel.types';

import { DISCARD_CARD_WIDTH, styles } from './DiscardPanel.styles';

export const DiscardPanel = ({ isOpen, cards, onClose }: DiscardPanelProps) => {
  const { t } = useTranslation();

  return (
    <Sheet isOpen={isOpen} title={t('discard.title')} onClose={onClose}>
      {cards.length === 0 ? (
        <Text style={styles.empty}>{t('discard.empty')}</Text>
      ) : (
        <View>
          <Text style={styles.count}>{t('discard.count', { count: cards.length })}</Text>

          <View style={styles.grid}>
            {cards.map((card) => (
              <PlayingCard key={cardKey(card)} card={card} width={DISCARD_CARD_WIDTH} />
            ))}
          </View>
        </View>
      )}
    </Sheet>
  );
};
