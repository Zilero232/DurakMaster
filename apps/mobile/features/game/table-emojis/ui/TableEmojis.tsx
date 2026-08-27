import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { SegmentedControl, Sheet } from '@/ui-kit';

import type { EmojiTab } from '../config';
import type { TableEmojisProps } from './TableEmojis.types';

import { EMOJI_TABS } from '../config';
import { useSendGuard } from '../model';
import { EmojiGrid, PhraseList } from './components';
import { styles } from './TableEmojis.styles';

export const TableEmojis = ({ isOpen, onClose, onSendEmoji, onSendPhrase }: TableEmojisProps) => {
  const { t } = useTranslation();

  const [tab, setTab] = useState<EmojiTab>('emoji');

  const guard = useSendGuard(onClose);

  return (
    <Sheet isOpen={isOpen} title={t('emojis.title')} onClose={onClose}>
      <View style={styles.root}>
        <SegmentedControl
          options={EMOJI_TABS.map((value) => ({ value, label: t(`emojis.tabs.${value}`) }))}
          value={tab}
          onChange={setTab}
        />

        {tab === 'emoji' ? (
          <EmojiGrid onSelect={(emoji) => guard(() => onSendEmoji(emoji))} />
        ) : (
          <PhraseList onSelect={(phraseId) => guard(() => onSendPhrase(phraseId))} />
        )}
      </View>
    </Sheet>
  );
};
