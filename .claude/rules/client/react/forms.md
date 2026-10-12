---
paths:
  - 'apps/mobile/**/*.{ts,tsx}'
---

<!-- Compressed editing rules for the Expo client, loaded automatically on edit. -->
<!-- The full reasoning is docs/guides/client/forms.md; keep them in sync. -->

# Client — forms

react-hook-form + `zodResolver`, and every field wrapped in a `Controller` — `register` does not
work with `TextInput`. The schema comes from `@durak-master/schemas` (a form-only schema lives in
the slice's `model/`); `control` is passed typed (`Control<CredentialsInput>`). Server errors go to
`setError('root', …)` with our own translated message. Never `useState` per field.

Keyboard: `react-native-keyboard-controller` only — React Native's `KeyboardAvoidingView` and
`automaticallyAdjustKeyboardInsets` do nothing on Android edge-to-edge. A scrolling form is a
`KeyboardAwareScrollView` (`bottomOffset`, `keyboardShouldPersistTaps="handled"`); a bottom panel
lifts with the library's `KeyboardAvoidingView behavior='padding'` (the `ui-kit` `Sheet` already
does). No `Platform.OS` branch for the keyboard. It is a native module — rebuild the development
build after a bump.
