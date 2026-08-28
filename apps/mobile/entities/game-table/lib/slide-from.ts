import { SlideInDown, SlideInUp } from 'react-native-reanimated';

import { SLIDE_MS } from '../config';

export const slideFrom = (isMine: boolean) => (isMine ? SlideInDown : SlideInUp).duration(SLIDE_MS);
