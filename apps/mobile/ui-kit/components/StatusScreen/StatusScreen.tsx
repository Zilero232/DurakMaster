import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { StatusScreenProps } from './StatusScreen.types';

import { styles } from './StatusScreen.styles';

export const StatusScreen = ({ icon, title, description, details, actions }: StatusScreenProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.panel}>
        {icon && <View style={styles.icon}>{icon}</View>}

        <Text style={styles.title}>{title}</Text>

        {description && <Text style={styles.description}>{description}</Text>}

        {details && (
          <Text numberOfLines={4} style={styles.details}>
            {details}
          </Text>
        )}

        {actions && <View style={styles.actions}>{actions}</View>}
      </View>
    </View>
  );
};
