import { Text, View } from 'react-native';

import { PlayingCard, SuitIcon } from '@/ui-kit';

import type { TalonStackProps } from './TalonStack.types';

import {
  EMPTY_BADGE_SIZE,
  styles,
  SUIT_BADGE_SIZE,
  talonCard,
  TRUMP_ROTATION
} from './TalonStack.styles';

export const TalonStack = ({ count, trump, trumpCard }: TalonStackProps) => {
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

  return (
    <View style={styles.root}>
      <View style={styles.stack}>
        {trumpCard && (
          <View style={styles.trumpCard}>
            <PlayingCard card={trumpCard} rotation={TRUMP_ROTATION} width={talonCard.width} />
          </View>
        )}

        {count > 0 && (
          <View style={styles.back}>
            <PlayingCard card={null} width={talonCard.width} />

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
