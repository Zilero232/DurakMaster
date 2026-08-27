export const BOT_MIN_DELAY_MS = 90;

export const BOT_DELAY_SPREAD_MS = 60;

export const BOT_SILENT_DELAY_MS = 0;

const VISIBLE_ACTIONS = new Set(['attack', 'defend', 'play', 'take', 'transfer', 'discard', 'bid']);

export const isVisibleBotAction = (action: string | null): boolean =>
  action !== null && VISIBLE_ACTIONS.has(action);
