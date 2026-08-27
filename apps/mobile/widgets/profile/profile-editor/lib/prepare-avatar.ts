import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

import { AVATAR_UPLOAD_QUALITY, AVATAR_UPLOAD_SIZE } from '../config';

export const prepareAvatar = async (uri: string): Promise<string> => {
  const context = ImageManipulator.manipulate(uri);

  context.resize({ width: AVATAR_UPLOAD_SIZE, height: AVATAR_UPLOAD_SIZE });

  const image = await context.renderAsync();
  const resized = await image.saveAsync({
    compress: AVATAR_UPLOAD_QUALITY,
    format: SaveFormat.JPEG
  });

  return resized.uri;
};
