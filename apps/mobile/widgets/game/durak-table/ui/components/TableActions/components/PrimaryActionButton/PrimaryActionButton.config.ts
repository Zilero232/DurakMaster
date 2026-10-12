import type { ParseKeys } from 'i18next';
import type { LucideIcon } from 'lucide-react-native';

import { Check, Hand, ShieldCheck, X } from 'lucide-react-native';

import type { ButtonVariant } from '@/ui-kit';

import type { PrimaryAction } from '../../../../../lib';

type PrimaryActionLook = {
  icon: LucideIcon;
  label: ParseKeys;
  variant: ButtonVariant;
};

export const PRIMARY_ACTIONS: Record<PrimaryAction, PrimaryActionLook> = {
  ready: { icon: Check, label: 'table.ready', variant: 'primary' },
  notReady: { icon: X, label: 'table.notReady', variant: 'ghost' },
  take: { icon: Hand, label: 'table.take', variant: 'danger' },
  done: { icon: ShieldCheck, label: 'table.done', variant: 'primary' },
  pass: { icon: ShieldCheck, label: 'table.pass', variant: 'primary' }
};
