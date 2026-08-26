import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export type HapticKind = 'beat' | 'error' | 'lose' | 'play' | 'take' | 'tap' | 'win';

const isSupported = Platform.OS === 'ios' || Platform.OS === 'android';

let isEnabled = true;

export const setHapticsEnabled = (enabled: boolean) => {
  isEnabled = enabled;
};

const run = (effect: () => Promise<void>) => {
  if (!isSupported || !isEnabled) {
    return;
  }

  void effect().catch(() => {});
};

const IMPACTS: Record<HapticKind, () => Promise<void>> = {
  play: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),

  beat: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),

  take: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),

  tap: () => Haptics.selectionAsync(),

  win: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),

  lose: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),

  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
};

export const haptic = (kind: HapticKind) => {
  run(IMPACTS[kind]);
};
