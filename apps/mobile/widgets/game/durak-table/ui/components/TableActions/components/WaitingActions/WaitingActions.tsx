import { Bot } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { ARE_BOTS_ENABLED } from '@/shared/config';
import { Button, iconSize } from '@/ui-kit';

import { useTableContext } from '../../../../../model';

export const WaitingActions = () => {
  const { t } = useTranslation();

  const { turn, moves } = useTableContext();

  if (!ARE_BOTS_ENABLED || !turn.hasFreeSeat) {
    return null;
  }

  return (
    <Button
      icon={(color) => <Bot color={color} size={iconSize.md} />}
      variant='ghost'
      onPress={moves.onAddBot}
    >
      {t('table.addBot')}
    </Button>
  );
};
