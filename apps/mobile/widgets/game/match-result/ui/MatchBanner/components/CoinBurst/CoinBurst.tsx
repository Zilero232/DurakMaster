import { View } from 'react-native';
import { times } from 'remeda';

import { COIN_COUNT } from '../../MatchBanner.config';
import { CoinParticle } from '../CoinParticle';
import { BURST_DISTANCE, BURST_STAGGER_MS } from './CoinBurst.config';
import { styles } from './CoinBurst.styles';

export const CoinBurst = () => (
  <View pointerEvents='none' style={styles.root}>
    {times(COIN_COUNT, (index) => (
      <CoinParticle
        key={index}
        angle={(index / COIN_COUNT) * Math.PI * 2}
        delayMs={index * BURST_STAGGER_MS}
        distance={BURST_DISTANCE + (index % 3) * 24}
      />
    ))}
  </View>
);
