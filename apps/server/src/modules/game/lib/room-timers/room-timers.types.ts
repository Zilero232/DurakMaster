export type RoomTimersHandlers = {
  onTurnTimeout: () => void;
  onBotTurn: () => void;
  onReadyTimeout: () => void;
};
