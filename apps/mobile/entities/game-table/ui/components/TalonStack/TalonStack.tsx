import { Text, View } from 'react-native';

import { card, PlayingCard, SuitIcon } from '@/ui-kit';

import type { TalonStackProps } from './TalonStack.types';

import {
  EMPTY_BADGE_SIZE,
  SUIT_BADGE_SIZE,
  talonLayout,
  TRUMP_ROTATION
} from './TalonStack.config';
import { styles } from './TalonStack.styles';

export const TalonStack = ({ cardWidth, count, trump, trumpCard }: TalonStackProps) => {
  const isEmpty = count === 0 && !trumpCard;

  if (isEmpty) {
    return (
      <View style={styles.emptyRoot}>
        <View style={styles.emptyBadge}>
          <SuitIcon size={EMPTY_BADGE_SIZE} suit={trump} />
        </View>
      </View>
    );
  }

  const layout = talonLayout({ cardWidth, cardHeight: cardWidth / card.ratio });

  return (
    <View style={styles.root}>
      <View style={layout.stack}>
        {trumpCard !== null && (
          <View style={[styles.trumpCard, layout.trumpCard]}>
            <PlayingCard card={trumpCard} rotation={TRUMP_ROTATION} width={layout.card} />
          </View>
        )}

        {count > 0 && (
          <View style={styles.back}>
            <PlayingCard card={null} width={layout.card} />

            <Text style={styles.count}>{count}</Text>
          </View>
        )}

        <View style={styles.suit}>
          <SuitIcon size={SUIT_BADGE_SIZE} suit={trump} />
        </View>
      </View>
    </View>
  );
};
