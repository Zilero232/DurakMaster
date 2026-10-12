import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { RULE_FACTS, RULE_STEPS } from '../../RulesPanel.config';
import { FactTile } from '../FactTile';
import { RuleStep } from '../RuleStep';
import { styles } from './BasicsTab.styles';

export const BasicsTab = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <View style={styles.facts}>
        {RULE_FACTS.map((fact) => (
          <FactTile
            key={fact.labelKey}
            icon={fact.icon}
            label={t(fact.labelKey)}
            value={t(fact.valueKey)}
          />
        ))}
      </View>

      {RULE_STEPS.map((step, index) => (
        <RuleStep key={step.id} number={index + 1} step={step} />
      ))}
    </View>
  );
};
