import { BOOST_PRICE, BOOSTS } from '@durak-master/schemas';
import { View } from 'react-native';

import type { BoostBarProps } from './BoostBar.types';

import { BoostButton } from '../BoostButton';
import { styles } from './BoostBar.styles';

export const BoostBar = ({ coins, unavailable, onUseBoost }: BoostBarProps) => (
  <View style={styles.root}>
    {BOOSTS.map((boost) => (
      <BoostButton
        key={boost}
        boost={boost}
        isDisabled={coins < BOOST_PRICE[boost] || (unavailable?.has(boost) ?? false)}
        price={BOOST_PRICE[boost]}
        onPress={onUseBoost}
      />
    ))}
  </View>
);
