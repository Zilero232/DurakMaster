import type { WebSocket } from 'ws';

export type Socket = WebSocket & { userId?: string; isAlive?: boolean };
