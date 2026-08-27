export const AVATAR_MAX_BYTES = 512 * 1024;

export const AVATAR_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export const AVATAR_EXTENSION: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

export const AVATAR_DIRECTORY = 'uploads/avatars';

export const AVATAR_ROUTE = '/uploads/avatars';
