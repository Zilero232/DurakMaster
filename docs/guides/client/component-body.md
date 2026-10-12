# Component body order

Part of the [style guide](../README.md).

## 8.2 Order inside a component body

The body of a component is read top to bottom in one order, so a reader always knows where to
look:

1. **Hooks** — `useTranslation`, context hooks, store selectors, `useState`, `useRef`,
   `useSharedValue`, `useAnimatedStyle`, `useEffect`. React requires them before any early
   return anyway, so this is not a preference so much as the shape the rules force. Their order
   among themselves is [React conventions](react.md) §10.2.
2. **Derived values** — plain `const`s computed from props and hook results: flags,
   measurements, a `match` over state.
3. **Functions** — handlers, gesture definitions, anything the JSX calls.
4. **The returned JSX.**

```tsx
export const SheetSurface = ({ isDialog, isOpen, maxHeight, onClose }: SheetSurfaceProps) => {
  const insets = useSafeAreaInsets();
  const offset = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      offset.value = 0;
    }
  }, [isOpen, offset]);

  const threshold = maxHeight * CLOSE_RATIO;

  const drag = Gesture.Pan().onEnd((event) => {
    // ...
  });

  return <Animated.View>{/* ... */}</Animated.View>;
};
```

An early return (`if (!session) { return <SignInForm />; }`) sits after the hooks and before the
derived values it does not need — that is the one place the order bends, because the hooks above
it must run unconditionally.
