import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SegmentedControl, Sheet } from '@/ui-kit';

import type { RulesPanelProps, RulesTab } from './RulesPanel.types';

import { BasicsTab, ModesTab } from './components';
import { styles } from './RulesPanel.styles';

export const RulesPanel = ({ isOpen, onClose }: RulesPanelProps) => {
  const { t } = useTranslation();

  const [tab, setTab] = useState<RulesTab>('basics');

  const tabs: { value: RulesTab; label: string }[] = [
    { value: 'basics', label: t('rules.tabs.basics') },
    { value: 'modes', label: t('rules.tabs.modes') }
  ];

  return (
    <Sheet isOpen={isOpen} title={t('rules.title')} onClose={onClose}>
      <SegmentedControl options={tabs} style={styles.tabs} value={tab} onChange={setTab} />

      {tab === 'basics' ? <BasicsTab /> : <ModesTab />}
    </Sheet>
  );
};
