import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { match } from 'ts-pattern';

import { useSeatContext } from '../../../../../model';
import { SeatChatter } from '../../../SeatChatter';
import { SeatAvatar } from '../SeatAvatar';
import { ROLE_LABEL_RATIO, ROLE_MIN_SCALE } from './SeatIdentity.config';
import { roleRow, styles } from './SeatIdentity.styles';

export const SeatIdentity = () => {
  const { t } = useTranslation();

  const seat = useSeatContext();

  const role = match(seat)
    .with({ isDisconnected: true }, () => ({ text: t('table.role.offline'), tone: styles.offline }))
    .with({ isDefender: true }, () => ({ text: t('table.role.defends'), tone: styles.defender }))
    .with({ isAttacker: true }, () => ({ text: t('table.role.attacks'), tone: null }))
    .with({ isOut: true }, () => ({ text: t('table.role.out'), tone: null }))
    .otherwise(() => null);

  return (
    <View style={styles.identity}>
      <SeatAvatar />

      <Text
        numberOfLines={1}
        style={[styles.name, seat.isInvitable && styles.invite, { fontSize: seat.metrics.label }]}
      >
        {seat.name}
      </Text>

      {role !== null && (
        <Text
          adjustsFontSizeToFit
          minimumFontScale={ROLE_MIN_SCALE}
          numberOfLines={1}
          style={[styles.role, role.tone, { fontSize: seat.metrics.label * ROLE_LABEL_RATIO }]}
        >
          {role.text}
        </Text>
      )}

      <SeatChatter
        chatter={seat.phrase}
        clearance={role ? roleRow(seat.metrics.label) : 0}
        placement='below'
        size={seat.metrics.avatar}
      />
    </View>
  );
};
