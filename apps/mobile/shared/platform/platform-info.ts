import type { PlatformInfo, PlatformKind } from '@durak-master/platform';

import { Platform } from 'react-native';

const resolveKind = (): PlatformKind => {
  switch (Platform.OS) {
    case 'ios':
      return 'ios';

    case 'android':
      return 'android';

    default:
      return 'web';
  }
};

const kind = resolveKind();

export const platformInfo: PlatformInfo = {
  kind,
  isMobile: kind === 'ios' || kind === 'android',
  isNative: kind !== 'web'
};
