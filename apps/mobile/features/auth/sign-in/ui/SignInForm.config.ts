import type { CredentialsInput } from '@durak-master/schemas';

import { spacing } from '@/ui-kit';

export const CORNER_INSET = spacing[3];

export const SCROLL_PADDING_Y = spacing[6];

export const DEFAULT_VALUES: CredentialsInput = { email: '', password: '', name: '' };
