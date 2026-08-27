import { BOOST_PRICE, BOOSTS } from '@durak-master/schemas';
import { View } from 'react-native';

import type { BoostBarProps } from './BoostBar.types';

import { styles } from '../../TableActions.styles';
import { BoostButton } from '../BoostButton';

export const BoostBar = ({ coins, onUseBoost }: BoostBarProps) => (
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
  </View>
);
