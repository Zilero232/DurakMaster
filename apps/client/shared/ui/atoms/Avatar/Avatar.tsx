'use client';

import { thumbs } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';

import s from './Avatar.module.scss';

type AvatarProps = {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
};

/**
 * Аватар игрока.
 *
 * Без загруженной картинки генерируется детерминированно из имени —
 * один и тот же игрок всегда получает один и тот же рисунок, и стол
 * не выглядит безликим набором заглушек.
 */
export const Avatar = ({ name, src, size = 40, className }: AvatarProps) => {
  const generated = src ? null : createAvatar(thumbs, { seed: name, radius: 50, size }).toDataUri();

  return (
    // biome-ignore lint/performance/noImgElement: data-URI аватара, next/image не даёт выигрыша
    <img
      src={src ?? generated ?? undefined}
      alt=""
      width={size}
      height={size}
      className={`${s.root} ${className ?? ''}`}
      style={{ width: size, height: size }}
      draggable={false}
    />
  );
};
