import { useTranslation } from 'react-i18next';
import { Share, View } from 'react-native';

import type { ProfileMenuProps } from './ProfileMenu.types';

import { MenuTile } from './components';
import { PROFILE_MENU_ITEMS } from './ProfileMenu.config';
import { styles } from './ProfileMenu.styles';

export const ProfileMenu = ({ onOpenPanel }: ProfileMenuProps) => {
  const { t } = useTranslation();

  const handleShare = () => {
    void Share.share({ message: t('menu.shareMessage') });
  };

  return (
    <View style={styles.grid}>
      {PROFILE_MENU_ITEMS.map(({ id, icon, badge, isLocked, tint }) => (
        <MenuTile
          key={id}
          badge={badge}
          icon={icon}
          isLocked={isLocked}
          label={t(`menu.${id}`)}
          tint={tint}
          onPress={id === 'share' ? handleShare : () => onOpenPanel(id)}
        />
      ))}
    </View>
  );
};
