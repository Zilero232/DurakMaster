import { View } from 'react-native';

import { useLayout } from '@/shared/model/layout';
import { Skeleton } from '@/ui-kit';

import { styles } from './ProfileTabSkeleton.styles';

export const ProfileTabSkeleton = () => {
  const { isDesktop } = useLayout();

  const wallet = <Skeleton height={72} style={styles.card} />;
  const summary = <Skeleton height={180} style={styles.card} />;
  const menu = <Skeleton height={260} style={styles.card} />;

  return (
    <View style={[styles.content, isDesktop && styles.columns]}>
      {isDesktop ? (
        <>
          <View style={styles.column}>
            {wallet}
            {summary}
          </View>

          <View style={styles.column}>{menu}</View>
        </>
      ) : (
        <>
          {wallet}
          {summary}
          {menu}
        </>
      )}
    </View>
  );
};
