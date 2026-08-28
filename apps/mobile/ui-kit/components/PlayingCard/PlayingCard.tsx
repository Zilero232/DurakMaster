import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import type { PlayingCardProps } from './PlayingCard.types';

import { cardSize } from '../../theme';
import { useCardTheme } from './card-theme-context';
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

  const rootStyle = [
    styles.root,
    isDimmed && styles.dimmed,
    isSelected && styles.selected,
    {
      transform: [
        { rotate: `${rotation}deg` },
        { translateY: isSelected ? getSelectedLift(width) : 0 }
      ]
    },
    style
  ];

  const content = (
    <>
      {card ? (
        <CardFace card={card} theme={theme} width={width} />
      ) : (
        <CardBack theme={theme} width={width} />
      )}

      {isPlayable && <View style={styles.playableRing} />}
    </>
  );

  if (!onPress) {
    return (
      <View accessibilityLabel={label} style={rootStyle}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole='button'
      accessibilityState={{ disabled: !isPlayable, selected: isSelected }}
      disabled={!isPlayable}
      style={rootStyle}
      onPress={onPress}
    >
      {content}
    </Pressable>
  );
};
