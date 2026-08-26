import { BOOST_PRICE, BOOSTS } from '@durak-master/schemas';
import { LogOut } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { colors, iconSize } from '@/ui-kit';

import type { BoostBarProps } from './BoostBar.types';

import { styles } from '../../TableActions.styles';
import { BoostButton } from '../BoostButton';

export const BoostBar = ({ coins, hasLeaveButton, onUseBoost, onLeave }: BoostBarProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.boosts}>
      {BOOSTS.map((boost) => (
        <BoostButton
          key={boost}
          boost={boost}
          isDisabled={coins < BOOST_PRICE[boost]}
          price={BOOST_PRICE[boost]}
          onPress={onUseBoost}
        />
      ))}

      {hasLeaveButton && (
        <Pressable
          accessibilityLabel={t('table.leave')}
          accessibilityRole='button'
          style={styles.leave}
          onPress={onLeave}
        >
          <LogOut color={colors.onFeltMuted} size={iconSize.md} />
        </Pressable>
      )}
    </View>
  );
};
