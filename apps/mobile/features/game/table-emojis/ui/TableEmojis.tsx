import { QUICK_PHRASES } from '@durak-master/schemas';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { Sheet } from '@/ui-kit';

import type { TableEmojisProps } from './TableEmojis.types';

import { EmojiGrid } from './components';
import { EMOJI_COOLDOWN_MS } from './TableEmojis.config';
import { styles } from './TableEmojis.styles';

export const TableEmojis = ({ isOpen, onClose, onSendEmoji, onSendPhrase }: TableEmojisProps) => {
  const { t } = useTranslation();

  const cooldownUntilRef = useRef(0);

  const guard = (send: () => void) => {
    if (Date.now() < cooldownUntilRef.current) {
      return;
    }

    send();
    cooldownUntilRef.current = Date.now() + EMOJI_COOLDOWN_MS;
    onClose();
  };

  return (
    <Sheet isOpen={isOpen} title={t('emojis.title')} onClose={onClose}>
      <View style={styles.root}>
        <EmojiGrid onSelect={(emoji) => guard(() => onSendEmoji(emoji))} />

        <View style={styles.phrases}>
          {QUICK_PHRASES.map((phraseId) => (
            <Pressable
              key={phraseId}
              accessibilityRole='button'
              style={styles.phrase}
              onPress={() => guard(() => onSendPhrase(phraseId))}
            >
              <Text style={styles.phraseLabel}>{t(`phrases.${phraseId}`)}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Sheet>
  );
};
