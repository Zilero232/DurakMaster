import { SlideInDown, SlideInUp } from 'react-native-reanimated';

const SPRING = { damping: 22, stiffness: 220 };

export const slideFrom = (isMine: boolean) =>
  isMine
    ? SlideInDown.springify().damping(SPRING.damping).stiffness(SPRING.stiffness)
    : SlideInUp.springify().damping(SPRING.damping).stiffness(SPRING.stiffness);
