import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { formatCredits } from '@/shared/lib/format';
import { Sheet } from '@/ui-kit';

import type { TableMenuProps } from './TableMenu.types';

import { MenuFooter, MenuRules, MenuToggles } from './components';
import { styles } from './TableMenu.styles';

export const TableMenu = ({ rules, bet, isPlaying, menu }: TableMenuProps) => {
  const { t } = useTranslation();

  return (
    <Sheet
      footer={
        <MenuFooter
          isConfirmingSurrender={menu.isConfirmingSurrender}
          isPlaying={isPlaying}
          onCancelSurrender={menu.cancelSurrender}
          onConfirmSurrender={menu.confirmSurrender}
          onLeave={menu.requestLeave}
        />
      }
      isOpen={menu.isOpen}
      title={t(menu.isConfirmingSurrender ? 'table.surrenderTitle' : 'table.menu')}
      onClose={menu.close}
    >
      {menu.isConfirmingSurrender ? (
        <Text style={styles.warning}>{t('table.surrenderHint', { bet: formatCredits(bet) })}</Text>
      ) : (
        <View style={styles.body}>
          <MenuRules rules={rules} />

          <MenuToggles />
        </View>
      )}
    </Sheet>
  );
};
