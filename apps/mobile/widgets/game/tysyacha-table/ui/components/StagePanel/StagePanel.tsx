import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { match } from 'ts-pattern';

import { Button } from '@/ui-kit';

import type { StagePanelProps } from './StagePanel.types';

import { styles } from '../../TysyachaTable.styles';

export const StagePanel = ({
  stage,
  contract,
  isMyTurn,
  isDeclarer,
  nextBid,
  onBid,
  onPass
}: StagePanelProps) => {
  const { t } = useTranslation();

  return match(stage)
    .with('bidding', () => (
      <View style={styles.stage}>
        <Text style={styles.stageTitle}>{t('games.tysyacha.bidding')}</Text>

        <Text style={styles.stageHint}>
          {contract
            ? t('games.tysyacha.currentBid', { value: contract })
            : t('games.tysyacha.noBids')}
        </Text>

        {isMyTurn && (
          <View style={styles.bids}>
            <Button variant='primary' onPress={() => onBid(nextBid)}>
              {t('games.tysyacha.raiseTo', { value: nextBid })}
            </Button>

            <Button variant='ghost' onPress={onPass}>
              {t('games.tysyacha.pass')}
            </Button>
          </View>
        )}
      </View>
    ))
    .with('discarding', () => (
      <View style={styles.stage}>
        <Text style={styles.stageTitle}>{t('games.tysyacha.discarding')}</Text>

        <Text style={styles.stageHint}>
          {isDeclarer ? t('games.tysyacha.giveCards') : t('games.tysyacha.waitingDeclarer')}
        </Text>
      </View>
    ))
    .with('scoring', () => (
      <View style={styles.stage}>
        <Text style={styles.stageTitle}>{t('games.tysyacha.dealOver')}</Text>
      </View>
    ))
    .otherwise(() => null);
};
