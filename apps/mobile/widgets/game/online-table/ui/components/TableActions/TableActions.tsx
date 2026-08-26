import { Layers, Settings } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { QuickPhrases } from '@/features/game/quick-phrases';
import { Button, colors } from '@/ui-kit';

import type { TableActionsProps } from './TableActions.types';

import { styles } from './TableActions.styles';

export const TableActions = ({
  discardCount,
  canTake,
  canPass,
  onSendPhrase,
  onOpenDiscard,
  onOpenSettings,
  onTake,
  onPass
}: TableActionsProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <View style={styles.tools}>
        <QuickPhrases onSend={onSendPhrase} />

        <Pressable
          accessibilityLabel={t('discard.open')}
          accessibilityRole='button'
          hitSlop={8}
          style={styles.tool}
          onPress={onOpenDiscard}
        >
          <Layers color={colors.onFelt} size={18} />
          <Text style={styles.toolCount}>{discardCount}</Text>
        </Pressable>

        <Pressable
          accessibilityLabel={t('settings.title')}
          accessibilityRole='button'
          hitSlop={8}
          style={styles.tool}
          onPress={onOpenSettings}
        >
          <Settings color={colors.onFelt} size={18} />
        </Pressable>
      </View>

      <View style={styles.moves}>
        <Button isFullWidth isDisabled={!canTake} variant='danger' onPress={onTake}>
          {t('table.take')}
        </Button>

        <Button isFullWidth isDisabled={!canPass} variant='primary' onPress={onPass}>
          {t('table.pass')}
        </Button>
      </View>
    </View>
  );
};
