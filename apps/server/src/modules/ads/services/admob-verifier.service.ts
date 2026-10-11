import type { KeyObject } from 'node:crypto';

import { Injectable } from '@nestjs/common';
import { createPublicKey, verify } from 'node:crypto';
import { z } from 'zod';

import {
  ADMOB_KEYS_REFETCH_COOLDOWN_MS,
  ADMOB_KEYS_TTL_MS,
  ADMOB_VERIFIER_KEYS_URL
} from '../config';

const SIGNATURE_PARAM = '&signature=';

const verifierKeysSchema = z.object({
  keys: z.array(z.object({ keyId: z.number(), pem: z.string() }))
});

export type AdmobSignatureCheck = 'forged' | 'malformed' | 'valid';

const isSignatureValid = (content: string, signature: string, key: KeyObject): boolean => {
  try {
    return verify(
      'sha256',
      Buffer.from(content),
      { key, dsaEncoding: 'der' },
      Buffer.from(signature, 'base64url')
    );
  } catch {
    return false;
  }
};

@Injectable()
export class AdmobVerifierService {
  private keys = new Map<string, KeyObject>();
  private keysFetchedAt = Number.NEGATIVE_INFINITY;
  private keysFetch: Promise<void> | null = null;

  async check(query: string): Promise<AdmobSignatureCheck> {
    const signatureStart = query.indexOf(SIGNATURE_PARAM);
    const params = new URLSearchParams(query);
    const signature = params.get('signature');
    const keyId = params.get('key_id');

    if (signatureStart === -1 || !signature || !keyId) {
      return 'malformed';
    }

    const key = await this.findKey(keyId);

    if (!key) {
      return 'forged';
    }

    return isSignatureValid(query.slice(0, signatureStart), signature, key) ? 'valid' : 'forged';
  }

  private async findKey(keyId: string): Promise<KeyObject | undefined> {
    const keysAgeMs = Date.now() - this.keysFetchedAt;
    const areKeysStale = keysAgeMs >= ADMOB_KEYS_TTL_MS;
    const mayRefetchForUnknownKey =
      !this.keys.has(keyId) && keysAgeMs >= ADMOB_KEYS_REFETCH_COOLDOWN_MS;

    if (areKeysStale || mayRefetchForUnknownKey) {
      await this.refreshKeys();
    }

    return this.keys.get(keyId);
  }

  private async refreshKeys(): Promise<void> {
    this.keysFetch ??= this.fetchKeys().finally(() => {
      this.keysFetch = null;
    });

    await this.keysFetch;
  }

  private async fetchKeys(): Promise<void> {
    const response = await fetch(ADMOB_VERIFIER_KEYS_URL);

    if (!response.ok) {
      throw new Error(`AdMob verifier keys answered ${response.status}`);
    }

    const { keys } = verifierKeysSchema.parse(await response.json());

    this.keys = new Map(keys.map(({ keyId, pem }) => [String(keyId), createPublicKey(pem)]));
    this.keysFetchedAt = Date.now();
  }
}
