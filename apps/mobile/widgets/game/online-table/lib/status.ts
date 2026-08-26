type StatusInput = {
  isMyTurn: boolean;
  isDefending: boolean;
  selectedCard: unknown;
};

export const getStatusKey = ({ isMyTurn, isDefending, selectedCard }: StatusInput) => {
  if (!isMyTurn) {
    return 'table.opponentTurn' as const;
  }

  if (!isDefending) {
    return 'table.yourTurn' as const;
  }

  return selectedCard ? ('table.chooseTarget' as const) : ('table.defend' as const);
};
