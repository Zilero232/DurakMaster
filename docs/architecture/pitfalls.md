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
- **Gradle asked for JDK 17.** _Symptom:_ `bun android` failed with "Cannot find a Java installation
  matching languageVersion=17"; Android Studio ships JDK 21. _Fix:_ `mise.toml` installs Temurin 17
  and points `JAVA_HOME` at it ([local dev](../ops/local-dev.md)).
- **`googleMobileAdsJson` crashed the Android build.** _Cause:_ `react-native-google-mobile-ads`
  v17 defaults to its new SDK wiring, which expects config our plugin setup does not write. _Fix:_
  `"androidSdk": "classic"` in the plugin's options in `app.json` ([ads](ads.md)).
- **"Error during concurrent rendering" on every launch.** _Cause:_ `@better-auth/expo` imports
  `expo-network` lazily and it was not installed; the red box hid the real `Cannot find module`.
  _Fix:_ `expo-network` is a dependency (it also feeds TanStack Query's `onlineManager`); restart
  Metro with `--clear` after adding it.
- **The socket reconnected every second with `4409`.** _Cause:_ two `SocketClient`s for one user —
  after a hot reload, or on two phones — each reconnect replaced the other. _Fix:_ no automatic
  reconnect after `4409`; the client comes back on the next foreground
  ([realtime](realtime.md#the-client-socket)).
- **A waiting player was stuck at a dead table.** _Symptom:_ after a short network drop in the
  waiting room the table showed but nothing worked. _Cause:_ a disconnect before the game started
  dropped the room at once; on reconnect the client still showed it. _Fix:_ every seat gets the
  reconnect grace, and `restoreTable` sends `table:left` when the room is gone
  ([realtime](realtime.md#disconnects-and-the-reconnect-grace)).
- **The hand vanished when the player became the defender.** _Cause:_ a hand-rolled `withDelay`
  entrance in `useEnterMotion` re-ran on a re-render and left the cards at opacity 0. _Fix:_ the
  hand's deal is Reanimated's own `entering={FadeInUp.delay(...)}`; `useEnterMotion` stays for
  cards that slide onto the field.
- **Field cards spilled over the opponents.** _Cause:_ every card took one size from the screen
  width, and six pairs do not fit the middle column at that size. _Fix:_ `fitFieldCard` picks the
  largest card for which all pairs fit the measured field, never larger than the regular size.
- **An error toast showed an icon and no text.** _Cause:_ `alignSelf: 'center'` on the sonner
  toast shrink-wrapped it and the text collapsed to zero width. _Fix:_ the toast keeps its full
  width with side margins only.
- **Plural strings showed their raw key.** _Symptom:_ "create.summary.deck" instead of "36 карт".
  _Cause:_ Hermes on Android has no `Intl.PluralRules`, so i18next could not pick `_one` / `_few` /
  `_many`. _Fix:_ `shared/i18n/model/i18n.ts` imports the `intl-pluralrules` polyfill before
  `init`.
- **Android switches looked broken.** _Cause:_ React Native's `Switch` draws the platform widget,
  small and off-palette, and only the thumb took taps. _Fix:_ the `ui-kit` `Toggle` is drawn by us,
  and every setting row is the pressable with `accessibilityRole='switch'`.
