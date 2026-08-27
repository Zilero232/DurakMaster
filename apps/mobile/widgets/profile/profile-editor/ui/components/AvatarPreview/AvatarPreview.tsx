import { Text, View } from 'react-native';

import { Avatar } from '@/ui-kit';

import type { AvatarPreviewProps } from './AvatarPreview.types';

import { AVATAR_SIZE, styles } from './AvatarPreview.styles';

export const AvatarPreview = ({ name, avatarUrl, league, level }: AvatarPreviewProps) => (
  <View style={styles.root}>
    <View style={styles.ring}>
      <Avatar name={name} size={AVATAR_SIZE} src={avatarUrl} />
    </View>

    <Text numberOfLines={1} style={styles.name}>
      {name}
    </Text>

    <Text style={styles.meta}>
      {league} · {level}
    </Text>
  </View>
);
