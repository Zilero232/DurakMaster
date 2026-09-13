import { Text, View } from 'react-native';

import type { LobbyPlaceholderProps } from './LobbyPlaceholder.types';

import { styles } from './LobbyPlaceholder.styles';

export const LobbyPlaceholder = ({ icon, title, hint, action }: LobbyPlaceholderProps) => (
  <View style={styles.root}>
    {icon}

    <Text style={styles.title}>{title}</Text>
    <Text style={styles.hint}>{hint}</Text>

    {action}
  </View>
);
