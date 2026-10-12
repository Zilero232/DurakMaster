import { TAUNT_IDS } from '@durak-master/schemas';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { TauntIcon } from '@/ui-kit';

import type { EmojiGridProps } from './EmojiGrid.types';

import { TAUNT_TILE_SIZE } from '../../../config';
import { styles } from './EmojiGrid.styles';

export const EmojiGrid = ({ onSelect }: EmojiGridProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      {TAUNT_IDS.map((taunt) => (
        <Pressable
          key={taunt}
          accessibilityLabel={t(`emojis.taunts.${taunt}`)}
          accessibilityRole='button'
          style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
          onPress={() => onSelect(taunt)}
        >
          <TauntIcon size={TAUNT_TILE_SIZE} taunt={taunt} />
        </Pressable>
      ))}
    </View>
  );
};
