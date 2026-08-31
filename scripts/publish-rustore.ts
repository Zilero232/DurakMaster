import { createSign } from 'node:crypto';
import { basename } from 'node:path';
import { z } from 'zod';

const API_URL = 'https://public-api.rustore.ru';

const envSchema = z.object({
  RUSTORE_KEY_ID: z.string().min(1),
  RUSTORE_PRIVATE_KEY: z.string().min(1),
  RUSTORE_PACKAGE_NAME: z.string().min(1),
  RUSTORE_BUNDLE_PATH: z.string().min(1),
  RUSTORE_CONTACT_EMAIL: z.email(),
  RUSTORE_WHATS_NEW: z.string().max(5_000).default(''),
  RUSTORE_PUBLISH_TYPE: z.enum(['MANUAL', 'INSTANTLY']).default('MANUAL'),
  RUSTORE_MIN_ANDROID_VERSION: z.coerce.number().int().min(1).max(16).default(24)
});

const {
  RUSTORE_KEY_ID: keyId,
  RUSTORE_PRIVATE_KEY: privateKey,
  RUSTORE_PACKAGE_NAME: packageName,
  RUSTORE_BUNDLE_PATH: bundlePath,
  RUSTORE_CONTACT_EMAIL: email,
  RUSTORE_WHATS_NEW: whatsNew,
  RUSTORE_PUBLISH_TYPE: publishType,
  RUSTORE_MIN_ANDROID_VERSION: minAndroidVersion
} = envSchema.parse(process.env);

const authorize = async (): Promise<string> => {
  const timestamp = new Date().toISOString();

  const signature = createSign('RSA-SHA512')
    .update(`${keyId}${timestamp}`)
    .sign(privateKey, 'base64');

  const response = await fetch(`${API_URL}/public/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyId, timestamp, signature })
  });

  const body = (await response.json()) as { body?: { jwe?: string }; message?: string };

  if (!response.ok || !body.body?.jwe) {
    throw new Error(`RuStore refused the key: ${body.message ?? response.status}`);
  }

  return body.body.jwe;
};

const call = async <T>(token: string, path: string, init: RequestInit): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { ...init.headers, 'Public-Token': token }
  });

  const body = (await response.json()) as { body?: T; message?: string };

  if (!response.ok) {
    throw new Error(`${path} answered ${response.status}: ${body.message ?? 'no message'}`);
  }

  return body.body as T;
};

const publish = async (): Promise<void> => {
  const bundle = Bun.file(bundlePath);

  if (!(await bundle.exists())) {
    throw new Error(`${bundlePath} does not exist`);
  }

  const token = await authorize();

  const versionId = await call<number>(token, `/public/v1/application/${packageName}/version`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      publishType,
      whatsNew,
      minAndroidVersion,
      developerContacts: { email }
    })
  });

  const form = new FormData();

  form.append('file', bundle, basename(bundlePath));

  try {
    await call(token, `/public/v1/application/${packageName}/version/${versionId}/aab`, {
      method: 'POST',
      body: form
    });

    await call(token, `/public/v1/application/${packageName}/version/${versionId}/commit`, {
      method: 'POST'
    });
  } catch (error) {
    await call(token, `/public/v1/application/${packageName}/version/${versionId}`, {
      method: 'DELETE'
    }).catch(() => undefined);

    throw error;
  }

  console.info(`RuStore accepted version ${versionId} of ${packageName}`);
};

await publish();
