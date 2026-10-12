# Forms

Part of the [style guide](../README.md).

## 15. Forms — react-hook-form + zodResolver

`register` does not work in React Native: `TextInput` has no DOM `change` event, which is what RHF hooks into under the hood. **Every field is wrapped in a `Controller`.**

```tsx
import type { CredentialsInput } from '@durak-master/schemas';

import { credentialsSchema } from '@durak-master/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

const DEFAULT_VALUES: CredentialsInput = { email: '', password: '', name: '' };

const {
  control,
  formState: { errors, isSubmitting },
  handleSubmit,
  setError
} = useForm<CredentialsInput>({
  resolver: zodResolver(credentialsSchema),
  defaultValues: DEFAULT_VALUES
});
```

```tsx
<Controller
  control={control}
  name='email'
  render={({ field }) => (
    <FormField
      autoCapitalize='none'
      isInvalid={Boolean(errors.email)}
      keyboardType='email-address'
      label={t('auth.email')}
      value={field.value}
      onBlur={field.onBlur}
      onChangeText={field.onChange}
    />
  )}
/>
```

- The schema goes into `@durak-master/schemas`, not inline in the form. A form-specific schema goes into the slice's `model/`.
- `control` is passed into the fields subcomponent typed (`Control<CredentialsInput>`), not as `any`.
- Server-side errors — `setError('root', { message })`; better-auth messages arrive in English, we show our own translation.
- The keyboard is handled by `react-native-keyboard-controller` (`KeyboardProvider` in `views/root-layout`'s `AppProviders`). React Native's own `KeyboardAvoidingView` and `automaticallyAdjustKeyboardInsets` do nothing on Android edge-to-edge, where the window no longer resizes — so no `Platform.OS` branches for the keyboard.
- A form that scrolls uses `KeyboardAwareScrollView` from the library with a `bottomOffset` and `keyboardShouldPersistTaps="handled"` (otherwise the first tap only dismisses the keyboard): it scrolls the focused field above the keyboard on both platforms (`features/auth/sign-in`, `features/lobby/create-table`).
- A panel pinned to the bottom lifts with the library's `KeyboardAvoidingView` (`behavior='padding'`) — the `ui-kit` `Sheet` does it for every sheet.
- It is a native module: after adding or bumping it, rebuild the development build (`bun android`).
- Examples: `features/auth/sign-in` (`CredentialsFields`, `FormField`), `features/lobby/create-table`.
