import { toAvatarUrl } from '@durak-master/schemas';
import { Check } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Avatar, colors, iconSize } from '@/ui-kit';

import type { AvatarChoiceProps } from './AvatarChoice.types';

import { AVATAR_SIZE, styles } from './AvatarChoice.styles';

export const AvatarChoice = ({ seed, isSelected, onSelect }: AvatarChoiceProps) => (
  <Pressable
    style={({ pressed }) => [styles.root, isSelected && styles.selected, pressed && styles.pressed]}
    accessibilityRole='button'
    accessibilityState={{ selected: isSelected }}
    onPress={() => onSelect(seed)}
  >
    <Avatar name={seed} size={AVATAR_SIZE} src={toAvatarUrl(seed)} />

    {isSelected && (
      <View style={styles.check}>
        <Check color={colors.primaryForeground} size={iconSize.xs} />
      </View>
    )}
  </Pressable>
);
