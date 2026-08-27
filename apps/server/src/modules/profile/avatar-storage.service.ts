import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { PUBLIC_URL } from '../../lib/env';
import { AVATAR_DIRECTORY, AVATAR_EXTENSION, AVATAR_ROUTE } from './avatar.config';

@Injectable()
export class AvatarStorageService {
  private readonly logger = new Logger(AvatarStorageService.name);

  async save(bytes: Buffer, mimeType: string): Promise<string> {
    await mkdir(AVATAR_DIRECTORY, { recursive: true });

    const name = `${randomUUID()}.${AVATAR_EXTENSION[mimeType]}`;

    await writeFile(join(AVATAR_DIRECTORY, name), bytes);

    return `${PUBLIC_URL}${AVATAR_ROUTE}/${name}`;
  }

  async remove(url: string | null): Promise<void> {
    const prefix = `${PUBLIC_URL}${AVATAR_ROUTE}/`;

    if (!url?.startsWith(prefix)) {
      return;
    }

    const name = url.slice(prefix.length);

    if (name.includes('/') || name.includes('..')) {
      return;
    }

    try {
      await unlink(join(AVATAR_DIRECTORY, name));
    } catch (error) {
      this.logger.warn(`Could not remove the previous avatar ${name}`, error);
    }
  }
}
