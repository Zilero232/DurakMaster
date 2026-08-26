import { Path, Svg } from 'react-native-svg';

import type { SuitIconProps } from './SuitIcon.types';

import { isRedSuit } from '../../lib';

const PATHS: Record<SuitIconProps['suit'], string> = {
  spades:
    'M12 2C12 2 4 8.2 4 13.2C4 16.1 6.1 18.2 8.7 18.2C10 18.2 10.9 17.7 11.5 17C11.3 18.9 10.6 20.4 9.4 21.4L9.4 22L14.6 22L14.6 21.4C13.4 20.4 12.7 18.9 12.5 17C13.1 17.7 14 18.2 15.3 18.2C17.9 18.2 20 16.1 20 13.2C20 8.2 12 2 12 2Z',
  hearts:
    'M12 21.3C12 21.3 2.8 15.2 2.8 9.2C2.8 6.2 5 4 7.7 4C9.7 4 11.2 5.1 12 6.7C12.8 5.1 14.3 4 16.3 4C19 4 21.2 6.2 21.2 9.2C21.2 15.2 12 21.3 12 21.3Z',
  diamonds: 'M12 2L20.5 12L12 22L3.5 12Z',
  clubs:
    'M12 2C9.9 2 8.2 3.7 8.2 5.8C8.2 6.5 8.4 7.2 8.8 7.8C8.4 7.6 7.9 7.6 7.4 7.6C5.3 7.6 3.6 9.3 3.6 11.4C3.6 13.5 5.3 15.2 7.4 15.2C9 15.2 10.4 14.2 11 12.8C11 12.8 11.1 12.8 11.2 12.8C11 15.6 10.4 20.2 9.4 21.4L9.4 22L14.6 22L14.6 21.4C13.6 20.2 13 15.6 12.8 12.8C12.9 12.8 13 12.8 13 12.8C13.6 14.2 15 15.2 16.6 15.2C18.7 15.2 20.4 13.5 20.4 11.4C20.4 9.3 18.7 7.6 16.6 7.6C16.1 7.6 15.6 7.6 15.2 7.8C15.6 7.2 15.8 6.5 15.8 5.8C15.8 3.7 14.1 2 12 2Z'
};

export const SuitIcon = ({ suit, size = 24, color, style }: SuitIconProps) => (
  <Svg height={size} style={style} viewBox='0 0 24 24' width={size}>
    <Path d={PATHS[suit]} fill={color ?? (isRedSuit(suit) ? '#C8102E' : '#1A2733')} />
  </Svg>
);
