import { Hammer } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { Button, colors, StatusScreen } from '@/ui-kit';

import type { UnsupportedGameProps } from './UnsupportedGame.types';

export const UnsupportedGame = ({ game, onLeave }: UnsupportedGameProps) => {
  const { t } = useTranslation();

  return (
    <StatusScreen
      actions={
        <Button isFullWidth variant='primary' onPress={onLeave}>
          {t('table.leave')}
        </Button>
      }
      description={t('games.comingSoonHint')}
      icon={<Hammer color={colors.gold} size={40} />}
      title={t('games.comingSoon', { game: t(`games.${game}.name`) })}
    />
  );
};
