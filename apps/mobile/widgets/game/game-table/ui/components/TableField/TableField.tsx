import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition, ZoomIn } from 'react-native-reanimated';

import { cardKey, PlayingCard } from '@/ui-kit';

import type { TableFieldProps } from './TableField.types';

import { DEFENSE_ROTATION, styles } from './TableField.styles';

export const TableField = ({ pairs, beatableIndexes, onDefend }: TableFieldProps) => {
  const { t } = useTranslation();

  if (pairs.length === 0) {
    return (
      <View style={styles.root}>
        <Text style={styles.empty}>{t('table.attackerTurn')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {pairs.map((pair, index) => {
        const canBeat = beatableIndexes.has(index);

        return (
          <Animated.View
            key={cardKey(pair.attack)}
            entering={ZoomIn.springify().damping(28).stiffness(420)}
            exiting={FadeOut.duration(160)}
            layout={LinearTransition.springify().damping(28).stiffness(420)}
            style={styles.pair}
          >
            <View style={[styles.attack, canBeat && styles.beatable]}>
              <PlayingCard
                card={pair.attack}
                isPlayable={canBeat}
                onPress={() => onDefend(index)}
              />
            </View>

            {pair.defense && (
              <Animated.View entering={FadeIn.duration(180)} style={styles.defense}>
                <PlayingCard card={pair.defense} rotation={DEFENSE_ROTATION} />
              </Animated.View>
            )}
          </Animated.View>
        );
      })}
    </View>
  );
};
