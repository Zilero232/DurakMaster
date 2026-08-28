import { useSettingsStore } from '../../store';
import { useAnimationSpeed } from '../use-animation-speed';

export const useTableLook = () => {
  const cardScale = useSettingsStore((store) => store.cardScale);
  const handSort = useSettingsStore((store) => store.handSort);
  const showHints = useSettingsStore((store) => store.showHints);

  const { isInstant } = useAnimationSpeed();

  return { cardScale, handSort, showHints, isInstant };
};
