import { Text, View } from 'react-native';

import { isRedSuit, PlayingCard, suitSymbol } from '@/ui-kit';

import type { TalonStackProps } from './TalonStack.types';

import { styles, talonCard } from './TalonStack.styles';

const TRUMP_ROTATION = 90;

export const TalonStack = ({ count, trump, trumpCard }: TalonStackProps) => (
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
    </View>

    <View style={styles.trumpBadge}>
      <Text style={[styles.trumpSymbol, isRedSuit(trump) && styles.trumpSymbolRed]}>
        {suitSymbol(trump)}
      </Text>
    </View>
  </View>
);
