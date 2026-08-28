import { useTranslation } from 'react-i18next';

import { Button, LoserHat, StatusScreen } from '@/ui-kit';

import type { MatchResultProps } from './MatchResult.types';

export const MatchResult = ({ isLoser, isDraw, creditsDelta, onDismiss }: MatchResultProps) => {
  const { t } = useTranslation();

  const title = isDraw ? t('result.draw') : isLoser ? t('result.lose') : t('result.win');

  const description = isDraw
    ? t('result.drawHint')
    : isLoser
      ? t('result.timeoutHint')
      : t('result.winHint');

  return (
    <StatusScreen
      actions={
        <Button size='lg' variant='primary' onPress={onDismiss}>
          {t('result.toMenu')}
        </Button>
      }
      description={description}
      details={creditsDelta === 0 ? undefined : t('result.credits', { value: creditsDelta })}
      icon={isLoser && !isDraw ? <LoserHat size={64} /> : undefined}
      title={title}
    />
  );
};
