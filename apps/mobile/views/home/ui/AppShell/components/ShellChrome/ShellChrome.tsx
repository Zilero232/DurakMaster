import { View } from 'react-native';

import type { ShellChromeProps } from './ShellChrome.types';

import { AppHeader } from '../AppHeader';
import { TabBar } from '../TabBar';
import { styles } from './ShellChrome.styles';

export const ShellChrome = ({ children, tab, profile, status, onChange }: ShellChromeProps) => (
  <View style={styles.root}>
    <AppHeader profile={profile} status={status} onOpenProfile={() => onChange('profile')} />

    <View style={styles.content}>{children}</View>

    <TabBar tab={tab} onChange={onChange} />
  </View>
);
