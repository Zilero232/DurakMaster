# Things that have already bitten us

Each entry cost a debugging session once: the symptom you see, the cause, and what fixed it.
Where another page argues the case in full, the entry links to it. Part of the
[documentation index](../README.md).

- **The socket crashed on Hermes.** _Symptom:_ a crash inside the socket layer on a device build.
  _Cause:_
  `partysocket` builds its events with `new MessageEvent(...)`, a DOM constructor Hermes does not
  have. _Fix:_ `shared/api/socket/socket-client.ts` is our own small client on React Native's
  `WebSocket`, with its own back-off and the bearer header on the upgrade
  ([realtime](realtime.md#the-client-socket)).
- **Sign-up answered a 500 with an empty body after a better-auth bump.** _Cause:_ 1.7.3 dropped
  `account.issuer`; our `auth.prisma` still required it, so every insert into `account` failed.
  Sign-up has no test, so `bun verify` stayed green. _Fix:_ the column and its unique index went
  from the model and the init migration; better-auth is pinned to an exact version and every bump
  is checked by hand ([auth](auth.md#the-schema-belongs-to-better-auth)).
- **Native modules were installed twice.** _Symptom:_ `expo-doctor` flagged duplicate native
  modules, and an EAS build could trip over them. _Cause:_ Bun's isolated linker splits one version
  of a package into several peer variants, and React Native needs exactly one copy of each native
  module. _Fix:_ `bunfig.toml` sets `[install] linker = "hoisted"`; the server's Dockerfile copies
  `bunfig.toml` so the image installs the same way.
- **No QR code from `bun dev:mobile`.** _Symptom:_ Expo started but printed no QR code and ignored
  the `a`/`r` keys. _Cause:_ `bun --filter` runs the script without a TTY. _Fix:_ the mobile scripts
  run through `bun run --cwd apps/mobile`, which keeps the terminal; `bun dev` (both apps through
  `--filter --parallel`) still has no QR code, so run `dev:server` and `dev:mobile` in separate
  terminals ([local dev](../ops/local-dev.md)).
- **Browser preflights got a 404 after CORS was removed.** _Symptom:_ `OPTIONS` requests to the API
  failed. _Cause:_ the app had been opened in a browser (`w` in the Expo CLI); with the web build
  gone, nothing answers CORS any more. _Fix:_ `app.json` lists `"platforms": ["android", "ios"]`,
  so there is no web target to open by accident.
- **Expo Go could not run the app.** _Cause:_ the app ships native modules Expo Go does not
  include — `react-native-google-mobile-ads` first of all ([ads](ads.md)). _Fix:_ develop on a
  development build installed once with `bun android` ([local dev](../ops/local-dev.md)).
- **The keyboard covered the fields on Android.** _Symptom:_ the password field in "more rules" and
  inputs in sheets stayed under the keyboard. _Cause:_ with edge-to-edge the Android window no
  longer resizes, so React Native's `KeyboardAvoidingView` and the iOS-only
  `automaticallyAdjustKeyboardInsets` did nothing. _Fix:_ `react-native-keyboard-controller` —
  `KeyboardProvider` in `AppProviders`, `KeyboardAwareScrollView` for forms, its
  `KeyboardAvoidingView` in the `Sheet` ([forms](../guides/client/forms.md)). A native module:
  rebuild the development build.
- **"An error occurred during concurrent rendering" on start-up.** _Cause:_ i18next v26 defaults to
  an asynchronous init, and `react-i18next` suspended the first render waiting for it, although the
  resources are bundled. _Fix:_ `initAsync: false` in `shared/i18n/model/i18n.ts`.
- **A `Response.blob` warning in the Metro log.** _Fix:_ `expo-blob` is a dependency of
  `apps/mobile` — installing it is enough, nothing imports it.
- **`bun test` failed a few dozen tests that pass in CI.** _Cause:_ bare `bun test` is Bun's own
  runner, not Vitest — `vi.stubGlobal` and friends do not exist there. _Fix:_ `bun run test`
  ([tests](../guides/shared/testing.md)).
- **Stakes were refunded twice.** _Cause:_ a manual `releaseStake` next to `rooms.leave`, which
  already emits `stake-released` — once for leaving after a match, once in the ready-timeout
  eviction. _Fix:_ refunds go only through `stake-released`; `hasStakeHeld` is the authority
  ([stakes](stakes.md#refunds-have-one-path)).
