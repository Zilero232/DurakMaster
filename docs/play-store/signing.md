# Signing and credentials

Three separate secrets are involved. Losing the first one cannot be undone, so read this before
creating anything.

## 1. Upload key

The key that signs the bundle you upload. EAS generates and stores it for you:

```bash
cd apps/mobile && eas credentials
```

Let EAS manage it unless you have a reason not to. If you generate it yourself, back up the
keystore and its passwords somewhere you will still have in two years — the file, not a
screenshot of it.

An upload key **can** be reset through Play Console support if it is lost. The app signing key
below cannot.

## 2. Play App Signing

Google holds the key that actually signs what users install. Enrol at the first release; it is
mandatory for new apps.

The consequence worth knowing: the certificate fingerprint users' devices see belongs to Google,
not to your upload key. Anything that pins a fingerprint — deep links, some SDKs — must use the
**app signing certificate** from Play Console, not the upload one.

## 3. Play service account

Needed only for `eas submit` and CI. Create it in Google Cloud, grant it access in Play Console
under *Users and permissions*, and download the JSON key.

Store it as the `PLAY_SERVICE_ACCOUNT` repository secret. The release workflow writes it to
`infra/play-store/service-account.json` for the duration of the job and deletes it afterwards.

**Never commit the JSON.** `infra/play-store/` is git-ignored; keep it that way.

## Expo token

CI needs `EXPO_TOKEN` to build without an interactive login. Create it at
[expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens) and add it as a
repository secret.

## Secrets summary

| Secret | Used by | Where it lives |
|---|---|---|
| `EXPO_TOKEN` | `release` workflow | GitHub repository secrets |
| `PLAY_SERVICE_ACCOUNT` | `eas submit` | GitHub repository secrets |
| Upload keystore | EAS build | Managed by EAS, or your own backup |
| App signing key | Google | Play Console, never leaves it |
