import type { DescribeRulesInput, RulesSummaryPart } from './describe-rules.types';

export const describeRules = ({ rules, isPrivate }: DescribeRulesInput): RulesSummaryPart[] => {
  const isTransfer = rules.mode === 'transfer';

  const choices = [
    { isOn: rules.throwInScope === 'neighbors', key: 'create.summary.neighbors' },
    { isOn: rules.fairness === 'cheaters', key: 'games.durak.fairness.cheaters' },
    { isOn: rules.withJokers, key: 'games.durak.withJokers' },
    { isOn: isTransfer && rules.allowTransferByShowingTrump, key: 'games.durak.showTrump' },
    { isOn: rules.firstMove === 'random', key: 'create.summary.randomFirstMove' },
    { isOn: !rules.allowDraw, key: 'create.summary.noDraw' },
    { isOn: isPrivate, key: 'lobby.privateTable' }
  ] as const;

  return [
    { key: 'create.summary.deck', count: rules.deckSize },
    { key: `games.durak.mode.${rules.mode}` },
    ...choices.filter((choice) => choice.isOn).map(({ key }) => ({ key }))
  ];
};
