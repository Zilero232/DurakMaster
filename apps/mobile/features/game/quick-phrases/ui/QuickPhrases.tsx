import type { QuickPhraseId } from '@durak-master/schemas';

import { QUICK_PHRASES } from '@durak-master/schemas';
import { useBoolean } from '@siberiacancode/reactuse';
import { MessageSquare } from 'lucide-react-native';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { colors, Sheet } from '@/ui-kit';

import type { QuickPhrasesProps } from './QuickPhrases.types';

import { styles } from './QuickPhrases.styles';

const COOLDOWN_MS = 3000;

export const QuickPhrases = ({ onSend }: QuickPhrasesProps) => {
  const { t } = useTranslation();

  const [isOpen, toggleOpen] = useBoolean(false);

  const cooldownUntilRef = useRef(0);

  const handleSend = (phraseId: QuickPhraseId) => {
    if (Date.now() < cooldownUntilRef.current) {
      return;
    }

    onSend(phraseId);
    cooldownUntilRef.current = Date.now() + COOLDOWN_MS;
    toggleOpen(false);
  };

  const openList = () => {
    toggleOpen(true);
  };

  const closeList = () => {
    toggleOpen(false);
  };

  return (
    <View>
      <Pressable
        accessibilityLabel={t('phrases.title')}
        accessibilityRole='button'
        accessibilityState={{ expanded: isOpen }}
        style={[styles.trigger, isOpen && styles.triggerOpen]}
        onPress={openList}
      >
        <MessageSquare color={isOpen ? colors.gold : colors.mutedForeground} size={18} />
      </Pressable>

      <Sheet isOpen={isOpen} title={t('phrases.title')} onClose={closeList}>
        <View style={styles.list}>
          {QUICK_PHRASES.map((phraseId) => (
            <Pressable
              key={phraseId}
              accessibilityRole='button'
              style={({ pressed }) => [styles.phrase, pressed && styles.phrasePressed]}
              onPress={() => handleSend(phraseId)}
            >
              <Text style={styles.phraseLabel}>{t(`phrases.${phraseId}`)}</Text>
            </Pressable>
          ))}
        </View>
      </Sheet>
    </View>
  );
};
