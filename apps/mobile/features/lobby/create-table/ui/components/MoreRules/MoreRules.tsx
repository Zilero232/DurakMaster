import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { colors, duration, iconSize } from '@/ui-kit';

import type { MoreRulesProps } from './MoreRules.types';

import { describeRules } from '../../../lib';
import { DurakDeckSection, DurakModesSection } from '../DurakSettings';
import { PrivacySection } from '../PrivacySection';
import { styles } from './MoreRules.styles';

export const MoreRules = ({ control, rules, isPrivate }: MoreRulesProps) => {
  const { t } = useTranslation();

  const [isExpanded, setIsExpanded] = useState(false);

  const summary = describeRules({ rules, isPrivate })
    .map(({ key, count }) => t(key, { count }))
    .join(' · ');

  const Chevron = isExpanded ? ChevronUp : ChevronDown;

  return (
    <View style={styles.root}>
      <Pressable
        accessibilityRole='button'
        accessibilityState={{ expanded: isExpanded }}
        style={({ pressed }) => [styles.toggle, pressed && styles.togglePressed]}
        onPress={() => setIsExpanded((previous) => !previous)}
      >
        <View style={styles.text}>
          <Text style={styles.title}>{t('create.moreRules')}</Text>

          <Text numberOfLines={1} style={styles.summary}>
            {summary}
          </Text>
        </View>

        <Chevron color={colors.mutedForeground} size={iconSize.lg} />
      </Pressable>

      {isExpanded && (
        <Animated.View entering={FadeIn.duration(duration.layout)} style={styles.sections}>
          <DurakDeckSection control={control} />

          <DurakModesSection control={control} mode={rules.mode} />

          <PrivacySection control={control} isPrivate={isPrivate} />
        </Animated.View>
      )}
    </View>
  );
};
