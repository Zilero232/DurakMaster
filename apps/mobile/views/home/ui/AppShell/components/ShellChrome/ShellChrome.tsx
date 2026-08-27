import { View } from 'react-native';

import { useLayout } from '@/shared/model/layout';

import type { ShellChromeProps } from './ShellChrome.types';

import { AppHeader } from '../AppHeader';
import { SideRail } from '../SideRail';
import { TabBar } from '../TabBar';
import { styles } from './ShellChrome.styles';

export const ShellChrome = ({ children, tab, status, onChange }: ShellChromeProps) => {
  const { isDesktop } = useLayout();

  if (isDesktop) {
    return (
      <View style={styles.desktopRoot}>
        <SideRail status={status} tab={tab} onChange={onChange} />

        <View style={styles.content}>{children}</View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <AppHeader status={status} tab={tab} />

      <View style={styles.content}>{children}</View>

      <TabBar tab={tab} onChange={onChange} />
    </View>
  );
};
