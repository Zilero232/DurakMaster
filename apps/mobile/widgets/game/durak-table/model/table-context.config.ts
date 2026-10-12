import type { TableContextValue } from './table-context.types';

const noop = () => {};

export const EMPTY_TABLE_CONTEXT: TableContextValue = {
  profile: null,
  look: { hasHints: false, sortMode: 'trumpFirst', isInstant: false },
  turn: {
    isMyTurn: false,
    isWaiting: false,
    isReady: false,
    hasFreeSeat: false,
    primaryAction: null,
    status: null,
    canUndo: false,
    boosts: [],
    turnSeconds: 0,
    playableKeys: new Set(),
    selectedKey: null
  },
  drag: {
    dropZones: [],
    onZonesChange: noop,
    onDropOn: noop,
    onDropMiss: noop,
    onHover: noop,
    onDragStart: noop,
    onDragEnd: noop
  },
  moves: {
    onSelectCard: noop,
    onPrimaryAction: noop,
    onAddBot: noop,
    onSendPhrase: noop,
    onSendEmoji: noop,
    onUseBoost: noop
  }
};
