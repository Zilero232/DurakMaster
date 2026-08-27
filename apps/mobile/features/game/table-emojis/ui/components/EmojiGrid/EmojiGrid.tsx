import { Pressable, Text, View } from 'react-native';

import type { EmojiGridProps } from './EmojiGrid.types';

import { TABLE_EMOJIS } from '../../TableEmojis.config';
import { styles } from './EmojiGrid.styles';

export const EmojiGrid = ({ onSelect }: EmojiGridProps) => (
  <View style={styles.root}>
    {TABLE_EMOJIS.map((emoji) => (
      <Pressable
        key={emoji}
        accessibilityLabel={emoji}
        accessibilityRole='button'
        style={styles.tile}
        onPress={() => onSelect(emoji)}
      >
        <Text style={styles.emoji}>{emoji}</Text>
      </Pressable>
    ))}
  </View>
);
