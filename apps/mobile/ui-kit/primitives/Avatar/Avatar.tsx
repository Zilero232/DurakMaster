import { thumbs } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { Image } from 'expo-image';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import type { AvatarProps } from './Avatar.types';

import { createStyles } from './Avatar.styles';

export const Avatar = ({ name, src, size = 40, style }: AvatarProps) => {
  const styles = createStyles(size);
  const xml = src ? null : createAvatar(thumbs, { seed: name, radius: 50, size }).toString();

  return (
    <View style={[styles.root, style]}>
      {src ? (
        <Image contentFit='cover' source={{ uri: src }} style={styles.image} transition={150} />
      ) : (
        <SvgXml height={size} width={size} xml={xml ?? ''} />
      )}
    </View>
  );
};
