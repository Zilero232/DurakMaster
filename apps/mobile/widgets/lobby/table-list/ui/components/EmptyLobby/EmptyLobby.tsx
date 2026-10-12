import { Plus } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { Button, colors, iconSize, SuitIcon } from '@/ui-kit';

import type { EmptyLobbyProps } from './EmptyLobby.types';

import { LobbyPlaceholder } from '../LobbyPlaceholder';

export const EmptyLobby = ({ onCreate }: EmptyLobbyProps) => {
  const { t } = useTranslation();

  return (
    <LobbyPlaceholder
      action={
        <Button
          icon={(color) => <Plus color={color} size={iconSize.md} />}
          size='lg'
          variant='primary'
          onPress={onCreate}
        >
          {t('lobby.createFirst')}
        </Button>
      }
      hint={t('lobby.emptyHint')}
      icon={<SuitIcon color={colors.subtleForeground} size={iconSize.hero} suit='spades' />}
      title={t('lobby.empty')}
    />
  );
};
