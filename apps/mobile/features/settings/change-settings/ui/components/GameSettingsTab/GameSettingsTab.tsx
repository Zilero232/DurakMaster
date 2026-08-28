import { ArrowDownWideNarrow, Gauge } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import type { AnimationSpeed } from '@/entities/settings';
import type { HandSort } from '@/shared/model/preferences';

import { useSettingsStore } from '@/entities/settings';
import { SegmentedControl } from '@/ui-kit';

import { SettingsSection } from '../SettingsSection';
import { SettingsToggle } from '../SettingsToggle';
import { styles } from './GameSettingsTab.styles';

export const GameSettingsTab = () => {
  const { t } = useTranslation();

  const showHints = useSettingsStore((store) => store.showHints);
  const setShowHints = useSettingsStore((store) => store.setShowHints);
  const handSort = useSettingsStore((store) => store.handSort);
  const setHandSort = useSettingsStore((store) => store.setHandSort);
  const animationSpeed = useSettingsStore((store) => store.animationSpeed);
  const setAnimationSpeed = useSettingsStore((store) => store.setAnimationSpeed);
  const isBatterySaver = useSettingsStore((store) => store.isBatterySaver);
  const setBatterySaver = useSettingsStore((store) => store.setBatterySaver);

  const sortOptions: { value: HandSort; label: string }[] = [
    { value: 'trumpFirst', label: t('settings.sort.trumpFirst') },
    { value: 'suit', label: t('settings.sort.suit') },
    { value: 'rank', label: t('settings.sort.rank') },
    { value: 'manual', label: t('settings.sort.manual') }
  ];

  const speedOptions: { value: AnimationSpeed; label: string }[] = [
    { value: 'calm', label: t('settings.speed.calm') },
    { value: 'normal', label: t('settings.speed.normal') },
    { value: 'instant', label: t('settings.speed.instant') }
  ];

  return (
    <View style={styles.root}>
      <SettingsSection icon={ArrowDownWideNarrow} title={t('settings.sortTitle')}>
        <SegmentedControl options={sortOptions} value={handSort} onChange={setHandSort} />
      </SettingsSection>

      <SettingsSection icon={Gauge} title={t('settings.speedTitle')}>
        <SegmentedControl
          options={speedOptions}
          value={animationSpeed}
          onChange={setAnimationSpeed}
        />
      </SettingsSection>

      <SettingsToggle
        description={t('settings.hintsDescription')}
        title={t('settings.hints')}
        value={showHints}
        onChange={setShowHints}
      />

      <SettingsToggle
        description={t('settings.batterySaverDescription')}
        title={t('settings.batterySaver')}
        value={isBatterySaver}
        onChange={setBatterySaver}
      />
    </View>
  );
};
