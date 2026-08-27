import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { match } from 'ts-pattern';

import { SegmentedControl, Sheet } from '@/ui-kit';

import type { SettingsTab } from './SettingsPanel.config';
import type { SettingsPanelProps } from './SettingsPanel.types';

import { GameSettingsTab, LookSettingsTab, SoundSettingsTab } from './components';
import { SETTINGS_TABS } from './SettingsPanel.config';
import { styles } from './SettingsPanel.styles';

export const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
  const { t } = useTranslation();

  const [tab, setTab] = useState<SettingsTab>('play');

  const tabOptions = SETTINGS_TABS.map(({ id, labelKey }) => ({
    value: id,
    label: t(labelKey)
  }));

  return (
    <Sheet isOpen={isOpen} title={t('settings.title')} onClose={onClose}>
      <View style={styles.root}>
        <SegmentedControl options={tabOptions} value={tab} onChange={setTab} />

        {match(tab)
          .with('play', () => <GameSettingsTab />)
          .with('look', () => <LookSettingsTab />)
          .with('sound', () => <SoundSettingsTab />)
          .exhaustive()}
      </View>
    </Sheet>
  );
};
