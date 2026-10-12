import { Smile } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';

import { colors, iconSize } from '@/ui-kit';

import type { EmojiButtonProps } from './EmojiButton.types';

import { styles } from './EmojiButton.styles';

export const EmojiButton = ({ onPress }: EmojiButtonProps) => {
  const { t } = useTranslation();

  return (
    <Pressable
      accessibilityLabel={t('emojis.title')}
      accessibilityRole='button'
      style={({ pressed }) => [styles.root, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Smile color={colors.onFelt} size={iconSize.lg} />
    </Pressable>
  );
};
