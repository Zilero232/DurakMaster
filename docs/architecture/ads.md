# Rewarded ads — the server grants, AdMob signs

One rewarded ad skips the four-hour wait for the free credits bonus. The phone only shows the ad;
the reward is granted by our API when AdMob's servers call it with a signed request. Part of the
[documentation index](../README.md).

## Why server-side verification

A reward granted on the client's word — "the ad finished, give me the bonus" — is a request anyone
can replay. AdMob's server-side verification (SSV) instead sends Google's own signed callback to
our API after the video, carrying the user id the app attached to the ad request. Nothing the
phone sends can grant a reward.

## The flow

1. `features/profile/watch-ad` offers the ad only while the bonus is still waiting and an ad unit is
   configured.
2. `shared/platform/rewarded-ads-adapter.ts` loads `RewardedAd` from
   `react-native-google-mobile-ads` with `serverSideVerificationOptions: { userId }` and shows it.
3. After the video, AdMob calls `GET /ads/admob-callback?…&user_id=…&transaction_id=…&signature=…&key_id=…`.
4. `AdmobVerifierService` checks the signature: ECDSA/SHA-256 over the query string up to
   `&signature=`, against Google's published keys
   (`https://www.gstatic.com/admob/reward/verifier-keys.json`, cached for 24 h, refetched at most
   once a minute for an unknown `key_id`). No secret is configured on our side.
5. `AdRewardsService.skipBonusWait` grants in a `Serializable` transaction: the `transaction_id` is
   a unique column (a retried callback is a `duplicate`), a 15-minute cooldown, at most 4 per
   24 hours, then the bonus timer is cleared.
6. The fresh profile is pushed over the socket (`profile:updated`); the app also refetches its
   profile twice — after 2 s, then after 4 s more — and reports the reward unconfirmed if the bonus
   is still waiting after that (`REWARD_CHECK_DELAYS_MS`).

## Answers

- **400** — the callback is not signed (no `signature` / `key_id`).
- **403** — the signature does not match any key.
- **200** — everything else, including a duplicate, an unknown user, a reward over the cap and a
  wait that was already over. Those are final outcomes; anything but 200 makes AdMob retry.

The signature covers the query string byte for byte, so nothing in front of the API (Caddy, a
firewall) may rewrite it.

## Switches

Ads are off unless the build sets `EXPO_PUBLIC_ADS_ENABLED=true` **and** a non-empty
`EXPO_PUBLIC_ADMOB_REWARDED_UNIT_ID`; every EAS profile currently sets them off, and the bonus
button then only counts down. The callback URL is set per rewarded ad unit in the AdMob console
— the console steps and the consent requirements are in
[`docs/store/google-play.md`](../store/google-play.md#server-side-verification).

The native ads module is also why the app cannot run in Expo Go ([pitfalls](pitfalls.md)).
