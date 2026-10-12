# Animations — Reanimated

Part of the [style guide](../README.md).

## 17. Animations — Reanimated

`react-native-reanimated` v4. Animations run on the UI thread, so they do not stall along with JS.

**Appearance/disappearance/reordering** — declarative presets on `Animated.View`:

```tsx
import Animated, { FadeOut, LinearTransition, SlideInRight } from 'react-native-reanimated';

<Animated.View
  key={key}
  entering={SlideInRight.springify().damping(30).stiffness(380)}
  exiting={FadeOut.duration(160)}
  layout={LinearTransition.springify().damping(30).stiffness(380)}
/>;
```

`layout` is mandatory wherever elements swap places (the player's hand): without it the neighbours jump abruptly.

**A continuous value** — `useSharedValue` + `withTiming` / `withSpring`, read in `useAnimatedStyle` / `useAnimatedProps`:

```tsx
const progress = useSharedValue(value);

useEffect(() => {
  progress.value = withTiming(value, { duration: duration.panel });
}, [value, progress]);

const animatedProps = useAnimatedProps(() => ({ text: `${Math.round(progress.value)}` }));
```

Durations come from `duration` in `@/ui-kit`, not as literals. A fade-and-rise on mount (a card entering
the hand or the table) is `useEnterMotion` from `@/ui-kit`.

The `key` of animated list elements must be stable and domain-based (`cardKey(card)`), not an index: with an index Reanimated assumes the card stayed the same and the reordering animation does not play.
