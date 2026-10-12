import { SOCKET_CLOSE_CODE } from '@durak-master/schemas';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

class FakeSocket {
  static readonly OPEN = 1;
  static instances: FakeSocket[] = [];

  readyState = 0;
  readonly sent: string[] = [];

  onopen: (() => void) | null = null;
  onclose: ((event: { code: number }) => void) | null = null;
  onmessage: ((event: { data: unknown }) => void) | null = null;

  constructor(
    readonly url: string,
    readonly protocols?: string | string[],
    readonly options?: unknown
  ) {
    FakeSocket.instances.push(this);
  }

  open() {
    this.readyState = FakeSocket.OPEN;
    this.onopen?.();
  }

  drop(code = 1006) {
    this.readyState = 3;
    this.onclose?.({ code });
  }

  close() {
    this.readyState = 3;
  }

  send(data: string) {
    this.sent.push(data);
  }
}

const getAuthToken = vi.fn<() => Promise<string | null>>();

const appStateListeners = new Set<(state: string) => void>();

const setAppState = (state: string) => appStateListeners.forEach((listener) => listener(state));

vi.stubGlobal('WebSocket', FakeSocket);
vi.mock('react-native', () => ({
  AppState: {
    addEventListener: (_type: string, listener: (state: string) => void) => {
      appStateListeners.add(listener);

      return { remove: () => appStateListeners.delete(listener) };
    }
  }
}));
vi.mock('@/shared/config', () => ({ WS_URL: 'ws://test/ws' }));
vi.mock('../../auth/auth-client', () => ({ getAuthToken: () => getAuthToken() }));

const { SocketClient } = await import('../socket-client');

const lastSocket = () => FakeSocket.instances[FakeSocket.instances.length - 1];

const connected = async (client: InstanceType<typeof SocketClient>) => {
  client.connect();
  await vi.waitFor(() => expect(FakeSocket.instances.length).toBeGreaterThan(0));

  return lastSocket();
};

describe('socket client', () => {
  beforeEach(() => {
    FakeSocket.instances = [];
    getAuthToken.mockReset();
    getAuthToken.mockResolvedValue('token');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('sends the bearer token in a header', async () => {
    const socket = await connected(new SocketClient());

    expect(socket.url).toBe('ws://test/ws');
    expect(socket.options).toEqual({ headers: { Authorization: 'Bearer token' } });
  });

  it('tells a late subscriber the socket is already open', async () => {
    const client = new SocketClient();

    (await connected(client)).open();

    const states: string[] = [];

    client.subscribeState((state) => states.push(state));

    expect(states).toEqual(['open']);
  });

  it('keeps one socket across repeated connects', async () => {
    const client = new SocketClient();

    await connected(client);
    client.connect();

    expect(FakeSocket.instances).toHaveLength(1);
  });

  it('opens one socket when it reconnects while the token is still loading', async () => {
    const client = new SocketClient();

    client.connect();
    client.disconnect();
    client.connect();

    await vi.waitFor(() => expect(FakeSocket.instances.length).toBeGreaterThan(0));
    await Promise.resolve();

    expect(FakeSocket.instances).toHaveLength(1);
  });

  it('delivers parsed server messages and skips malformed ones', async () => {
    const client = new SocketClient();
    const received: unknown[] = [];

    client.subscribe((message) => received.push(message));

    const socket = await connected(client);

    socket.onmessage?.({ data: 'not json' });
    socket.onmessage?.({ data: JSON.stringify({ type: 'unknown' }) });
    socket.onmessage?.({ data: JSON.stringify({ type: 'table:left' }) });

    expect(received).toEqual([{ type: 'table:left' }]);
  });

  it('reconnects with a fresh token after the connection drops', async () => {
    vi.useFakeTimers();

    const client = new SocketClient();
    const first = await connected(client);

    first.open();
    getAuthToken.mockResolvedValueOnce('fresh');
    first.drop();

    await vi.advanceTimersByTimeAsync(500);

    expect(FakeSocket.instances).toHaveLength(2);
    expect(lastSocket().options).toEqual({ headers: { Authorization: 'Bearer fresh' } });
  });

  it('reconnects at once when the app comes back to the foreground', async () => {
    vi.useFakeTimers();

    const client = new SocketClient();
    const first = await connected(client);

    first.open();
    first.drop();
    setAppState('active');

    await vi.advanceTimersByTimeAsync(0);

    expect(FakeSocket.instances).toHaveLength(2);
  });

  it('waits for the foreground after another device took the session over', async () => {
    vi.useFakeTimers();

    const client = new SocketClient();
    const first = await connected(client);

    first.open();
    first.drop(SOCKET_CLOSE_CODE.replaced);

    await vi.advanceTimersByTimeAsync(10_000);

    expect(FakeSocket.instances).toHaveLength(1);

    setAppState('active');
    await vi.advanceTimersByTimeAsync(0);

    expect(FakeSocket.instances).toHaveLength(2);
  });

  it('does not retry a rejected session on its own', async () => {
    vi.useFakeTimers();

    const client = new SocketClient();
    const first = await connected(client);

    first.open();
    first.drop(SOCKET_CLOSE_CODE.unauthorized);

    await vi.advanceTimersByTimeAsync(10_000);

    expect(FakeSocket.instances).toHaveLength(1);
  });

  it('stops listening to the app state after a disconnect', async () => {
    const client = new SocketClient();
    const listenersBefore = appStateListeners.size;

    await connected(client);
    client.disconnect();

    expect(appStateListeners.size).toBe(listenersBefore);
  });

  it('does not reconnect after an explicit disconnect', async () => {
    vi.useFakeTimers();

    const client = new SocketClient();
    const socket = await connected(client);

    client.disconnect();
    socket.drop();

    await vi.advanceTimersByTimeAsync(10_000);

    expect(FakeSocket.instances).toHaveLength(1);
  });

  it('ignores events from a socket it has already let go', async () => {
    const client = new SocketClient();
    const states: string[] = [];

    client.subscribeState((state) => states.push(state));

    const stale = await connected(client);

    client.disconnect();
    states.length = 0;

    stale.open();
    stale.drop();

    expect(states).toEqual([]);
  });

  it('drops messages sent while the socket is not open', async () => {
    const client = new SocketClient();
    const socket = await connected(client);

    expect(client.send({ type: 'table:leave' })).toBe(false);

    socket.open();

    expect(client.send({ type: 'table:leave' })).toBe(true);
    expect(socket.sent).toEqual([JSON.stringify({ type: 'table:leave' })]);
  });
});
