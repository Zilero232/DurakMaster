import { formatCredits } from '@/shared/lib/format';

import type { DescribeTableRulesInput, TableRule } from './describe-table-rules.types';

export const describeTableRules = ({ settings, t }: DescribeTableRulesInput): TableRule[] => {
  const { bet, speed, turnTimeoutSeconds, rules } = settings;
  const { deckSize, mode, throwInScope, fairness, withJokers, allowDraw, firstMove } = rules;

  const yesNo = (value: boolean) => t(value ? 'table.rules.yes' : 'table.rules.no');

  const isFast = speed === 'fast';
  const speedLabel = t(isFast ? 'create.speedFast' : 'create.speedNormal');
  const turnSeconds = t('create.speedHint', { seconds: turnTimeoutSeconds });

  const betText = formatCredits(bet);
  const deckText = String(deckSize);

  const all: (TableRule | null)[] = [
    {
      icon: 'bet',
      label: t('table.rules.bet'),
      value: betText,
      isInStrip: true,
      stripText: betText
    },
    {
      icon: 'deck',
      label: t('games.durak.deck'),
      value: deckText,
      isInStrip: true,
      stripText: deckText
    },
    {
      icon: mode,
      label: t('games.durak.mode.title'),
      value: t(`games.durak.mode.${mode}`),
      isInStrip: true,
      stripText: null
    },
    {
      icon: `${throwInScope}Scope`,
      label: t('games.durak.throwInScope.title'),
      value: t(`games.durak.throwInScope.${throwInScope}`),
      isInStrip: true,
      stripText: null
    },
    {
      icon: fairness,
      label: t('games.durak.fairness.title'),
      value: t(`games.durak.fairness.${fairness}`),
      isInStrip: fairness === 'cheaters',
      stripText: null
    },
    {
      icon: 'jokers',
      label: t('games.durak.withJokers'),
      value: yesNo(withJokers),
      isInStrip: withJokers,
      stripText: null
    },
    {
      icon: `${speed}Speed`,
      label: t('create.speed'),
      value: `${speedLabel} · ${turnSeconds}`,
      isInStrip: isFast,
      stripText: null
    },
    {
      icon: 'draw',
      label: t('games.durak.allowDraw'),
      value: yesNo(allowDraw),
      isInStrip: false,
      stripText: null
    },
    mode === 'transfer'
      ? {
          icon: 'showTrump',
          label: t('games.durak.showTrump'),
          value: yesNo(rules.allowTransferByShowingTrump),
          isInStrip: false,
          stripText: null
        }
      : null,
    {
      icon: firstMove,
      label: t('games.durak.firstMove.title'),
      value: t(`games.durak.firstMove.${firstMove}`),
      isInStrip: false,
      stripText: null
    }
  ];

  return all.filter((rule) => rule !== null);
};
