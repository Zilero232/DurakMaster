import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { haptic } from '@/shared/lib/haptics';
import { playSound } from '@/shared/lib/sound';

import { useSessionStore } from '../../model/store';

export const SessionNotices = () => {
  const { t } = useTranslation();

  const lastError = useSessionStore((store) => store.lastError);
  const lastErrorCode = useSessionStore((store) => store.lastErrorCode);
  const rejectedCode = useSessionStore((store) => store.rejectedCode);
  const clearError = useSessionStore((store) => store.clearError);
  const clearRejection = useSessionStore((store) => store.clearRejection);

  useEffect(() => {
    if (!lastError && !lastErrorCode) {
      return;
    }

    const key = `error.${lastErrorCode}`;
    const translated = lastErrorCode && t(key) !== key ? t(key) : lastError;

    playSound('error');
    haptic('error');
    toast.error(translated ?? '');
    clearError();
  }, [lastError, lastErrorCode, t, clearError]);

  useEffect(() => {
    if (!rejectedCode) {
      return;
    }

    const key = `error.${rejectedCode}`;
    const translated = t(key);

    playSound('error');
    haptic('error');
    toast.error(translated === key ? t('error.UNKNOWN') : translated);
    clearRejection();
  }, [rejectedCode, t, clearRejection]);

  return null;
};
