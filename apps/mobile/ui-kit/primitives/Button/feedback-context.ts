import { createContext } from '@siberiacancode/reactuse';

type PressFeedback = {
  onPress: () => void;
};

const NOOP: PressFeedback = { onPress: () => {} };

const { Provider, useSelect } = createContext<PressFeedback>(NOOP);

export const FeedbackProvider = Provider;

export const usePressFeedback = (): (() => void) =>
  useSelect((value) => value.onPress) ?? NOOP.onPress;
