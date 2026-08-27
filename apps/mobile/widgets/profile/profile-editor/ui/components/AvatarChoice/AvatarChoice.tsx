import { toAvatarUrl } from '@durak-master/schemas';
import { Pressable } from 'react-native';

import { Avatar } from '@/ui-kit';

import type { AvatarChoiceProps } from './AvatarChoice.types';

import { styles } from './AvatarChoice.styles';

const SIZE = 56;

export const AvatarChoice = ({ seed, isSelected, onSelect }: AvatarChoiceProps) => (
  <Pressable
    accessibilityRole='button'
    accessibilityState={{ selected: isSelected }}
    style={({ pressed }) => [styles.root, isSelected && styles.selected, pressed && styles.pressed]}
    onPress={() => onSelect(seed)}
  >
    <Avatar name={seed} size={SIZE} src={toAvatarUrl(seed)} />
  </Pressable>
);
