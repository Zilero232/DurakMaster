import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import type { PlayingCardProps } from './PlayingCard.types';

import { cardSize, useCardTheme } from '../../theme';
import { CardBack, CardFace } from './components';
import { createStyles, getSelectedLift } from './PlayingCard.styles';

export const PlayingCard = ({
  card,
  isPlayable = false,
  isSelected = false,
  isDimmed = false,
  rotation = 0,
  width = cardSize.width,
  theme: themeOverride,
  style,
  onPress
}: PlayingCardProps) => {
  const { t } = useTranslation();

  const contextTheme = useCardTheme();

  const theme = themeOverride ?? contextTheme;
  const styles = createStyles(width, theme);

  const label = card
    ? t('card.label', { rank: t(`card.rank.${card.rank}`), suit: t(`card.suit.${card.suit}`) })
    : t('card.faceDown');

  return (
    <Pressable
      style={[
        styles.root,
        isSelected && styles.selected,
        isDimmed && styles.dimmed,
        {
          transform: [
            { rotate: `${rotation}deg` },
            { translateY: isSelected ? getSelectedLift(width) : 0 }
          ]
        },
        style
      ]}
      accessibilityLabel={label}
      accessibilityRole='button'
      accessibilityState={{ disabled: !isPlayable, selected: isSelected }}
      disabled={!isPlayable || !onPress}
      onPress={onPress}
    >
      {card ? (
        <CardFace card={card} theme={theme} width={width} />
      ) : (
        <CardBack theme={theme} width={width} />
      )}

      {isPlayable && <View style={styles.playableRing} />}
    </Pressable>
  );
};
