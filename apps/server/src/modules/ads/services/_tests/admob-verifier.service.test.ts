import type { KeyObject } from 'node:crypto';

import { generateKeyPairSync, sign } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ADMOB_KEYS_REFETCH_COOLDOWN_MS, ADMOB_KEYS_TTL_MS } from '../../config';
import { AdmobVerifierService } from '../admob-verifier.service';

const KEY_ID = 3335741209;

const ROTATED_KEY_ID = 1234567890;

const createKeyPair = () => generateKeyPairSync('ec', { namedCurve: 'prime256v1' });

const pemOf = (publicKey: KeyObject): string =>
  publicKey.export({ type: 'spki', format: 'pem' }).toString();

const REWARD_QUERY =
  'ad_network=5450213213286189855&ad_unit=1234567890&custom_data=&reward_amount=1&reward_item=skip&timestamp=1507770365237823&transaction_id=18fa792de1bca816048293fc71035638&user_id=player-1';

const signQuery = (content: string, privateKey: KeyObject, keyId = KEY_ID): string => {
  const signature = sign('sha256', Buffer.from(content), {
    key: privateKey,
    dsaEncoding: 'der'
  }).toString('base64url');

  return `${content}&signature=${signature}&key_id=${keyId}`;
};

const serveKeys = (...keys: { keyId: number; publicKey: KeyObject }[]) =>
  Response.json({
    keys: keys.map(({ keyId, publicKey }) => ({ keyId, pem: pemOf(publicKey) }))
  });

describe('AdMob callback signature', () => {
  const current = createKeyPair();

  let fetchKeys: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();

    fetchKeys = vi.fn(async () => serveKeys({ keyId: KEY_ID, publicKey: current.publicKey }));

    vi.stubGlobal('fetch', fetchKeys);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('accepts a callback signed with a published key', async () => {
    const query = signQuery(REWARD_QUERY, current.privateKey);

    await expect(new AdmobVerifierService().check(query)).resolves.toBe('valid');
  });

  it('rejects a callback whose parameters were changed after signing', async () => {
    const query = signQuery(REWARD_QUERY, current.privateKey).replace(
      'user_id=player-1',
      'user_id=player-2'
    );

    await expect(new AdmobVerifierService().check(query)).resolves.toBe('forged');
  });

  it('rejects a callback signed with a key AdMob never published', async () => {
    const query = signQuery(REWARD_QUERY, createKeyPair().privateKey);

    await expect(new AdmobVerifierService().check(query)).resolves.toBe('forged');
  });

  it('rejects a callback with a garbage signature', async () => {
    const query = `${REWARD_QUERY}&signature=not-a-signature&key_id=${KEY_ID}`;

    await expect(new AdmobVerifierService().check(query)).resolves.toBe('forged');
  });

  it('treats a callback without a signature or key id as malformed', async () => {
    const verifier = new AdmobVerifierService();
    const signed = signQuery(REWARD_QUERY, current.privateKey);

    await expect(verifier.check(REWARD_QUERY)).resolves.toBe('malformed');
    await expect(verifier.check(signed.replace(/&key_id=\d+$/, ''))).resolves.toBe('malformed');
    expect(fetchKeys).not.toHaveBeenCalled();
  });

  it('reuses the fetched keys until they go stale', async () => {
    const verifier = new AdmobVerifierService();
    const query = signQuery(REWARD_QUERY, current.privateKey);

    await verifier.check(query);
    await verifier.check(query);

    expect(fetchKeys).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(ADMOB_KEYS_TTL_MS);
    await verifier.check(query);

    expect(fetchKeys).toHaveBeenCalledTimes(2);
  });

  it('refetches the keys when AdMob signs with a key it rotated in', async () => {
    const rotated = createKeyPair();
    const verifier = new AdmobVerifierService();

    await verifier.check(signQuery(REWARD_QUERY, current.privateKey));

    fetchKeys.mockImplementation(async () =>
      serveKeys(
        { keyId: KEY_ID, publicKey: current.publicKey },
        { keyId: ROTATED_KEY_ID, publicKey: rotated.publicKey }
      )
    );
    vi.advanceTimersByTime(ADMOB_KEYS_REFETCH_COOLDOWN_MS);

    const query = signQuery(REWARD_QUERY, rotated.privateKey, ROTATED_KEY_ID);

    await expect(verifier.check(query)).resolves.toBe('valid');
    expect(fetchKeys).toHaveBeenCalledTimes(2);
  });

  it('does not refetch for every unknown key id', async () => {
    const verifier = new AdmobVerifierService();

    await verifier.check(signQuery(REWARD_QUERY, current.privateKey));

    const unknown = signQuery(REWARD_QUERY, current.privateKey, ROTATED_KEY_ID);

    await expect(verifier.check(unknown)).resolves.toBe('forged');
    await expect(verifier.check(unknown)).resolves.toBe('forged');
    expect(fetchKeys).toHaveBeenCalledTimes(1);
  });

  it('fails loudly when the key list cannot be fetched', async () => {
    fetchKeys.mockImplementation(async () => new Response(null, { status: 503 }));

    const query = signQuery(REWARD_QUERY, current.privateKey);

    await expect(new AdmobVerifierService().check(query)).rejects.toThrow('503');
  });
});
