import { View } from 'react-native';

import type { ShellChromeProps } from './ShellChrome.types';

import { AppHeader } from '../AppHeader';
import { TabBar } from '../TabBar';
import { styles } from './ShellChrome.styles';

export const ShellChrome = ({ children, tab, status, onChange, onSignOut }: ShellChromeProps) => (
  <View style={styles.root}>
    <AppHeader status={status} tab={tab} onSignOut={onSignOut} />

    <View style={styles.content}>{children}</View>

    <TabBar tab={tab} onChange={onChange} />
  </View>
);
