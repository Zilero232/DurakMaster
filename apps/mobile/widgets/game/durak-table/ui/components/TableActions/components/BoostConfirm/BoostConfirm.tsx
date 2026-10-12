import { BOOST_PRICE } from '@durak-master/schemas';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { BOOST_HINTS, BOOST_ICONS, BOOST_LABELS } from '@/entities/game-table';
import { Button, colors, iconSize, Sheet } from '@/ui-kit';

import type { BoostConfirmProps } from './BoostConfirm.types';

import { BLOCKER_LABELS } from './BoostConfirm.config';
import { styles } from './BoostConfirm.styles';

export const BoostConfirm = ({
  boost,
  blocker,
  coins,
  isOpen,
  onCancel,
  onConfirm
}: BoostConfirmProps) => {
  const { t } = useTranslation();

  const Icon = BOOST_ICONS[boost];
  const price = BOOST_PRICE[boost];

  return (
    <Sheet
      footer={
        <View style={styles.actions}>
          <Button size='lg' style={styles.action} variant='secondary' onPress={onCancel}>
            {t('common.cancel')}
          </Button>

          <Button
            isDisabled={blocker !== null}
            size='lg'
            style={styles.action}
            variant='primary'
            onPress={onConfirm}
          >
            {t('boosts.use', { price })}
          </Button>
        </View>
      }
      isOpen={isOpen}
      title={t(BOOST_LABELS[boost])}
      onClose={onCancel}
    >
      <View style={styles.body}>
        <View style={styles.icon}>
          <Icon color={colors.gold} size={iconSize.xl} />
        </View>

        <Text style={styles.hint}>{t(BOOST_HINTS[boost])}</Text>

        <Text style={styles.balance}>{t('boosts.balance', { coins })}</Text>

        {blocker !== null && <Text style={styles.blocker}>{t(BLOCKER_LABELS[blocker])}</Text>}
      </View>
    </Sheet>
  );
};
