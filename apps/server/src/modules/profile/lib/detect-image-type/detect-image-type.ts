import { fileTypeFromBuffer } from 'file-type';

import { AVATAR_MIME_TYPES } from '../../config';

type AvatarMimeType = (typeof AVATAR_MIME_TYPES)[number];

const ALLOWED: readonly string[] = AVATAR_MIME_TYPES;

export const detectImageType = async (bytes: Buffer): Promise<AvatarMimeType | null> => {
  const detected = await fileTypeFromBuffer(bytes);

  if (!detected || !ALLOWED.includes(detected.mime)) {
    return null;
  }

  return detected.mime as AvatarMimeType;
};
