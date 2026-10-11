import { beforeEach, describe, expect, it, vi } from 'vitest';

type Listener = (event?: unknown) => void;

type ReconnectingOptions = {
  WebSocket: new (url: string, protocols?: string[]) => unknown;
};

class FakeSocket {
  static instances: FakeSocket[] = [];

  readyState = 0;
  readonly OPEN = 1;
  readonly sent: string[] = [];
  readonly listeners = new Map<string, Listener[]>();

  constructor(
    readonly url: () => Promise<string>,
    readonly protocols: string[],
    readonly options: ReconnectingOptions
  ) {
    FakeSocket.instances.push(this);
  }

  addEventListener(type: string, listener: Listener) {
    this.listeners.set(type, [...(this.listeners.get(type) ?? []), listener]);
  }

  fire(type: string, event?: unknown) {
    if (type === 'open') {
      this.readyState = this.OPEN;
    }

    this.listeners.get(type)?.forEach((listener) => listener(event));
  }

  close() {
    this.readyState = 3;
  }

  send(data: string) {
    this.sent.push(data);
  }
}

class NativeSocket {
  constructor(
    readonly url: string,
    readonly protocols?: string[],
    readonly options?: unknown
  ) {}
}

const getAuthToken = vi.fn<() => Promise<string | null>>();

vi.stubGlobal('WebSocket', NativeSocket);
vi.mock('partysocket', () => ({ WebSocket: FakeSocket }));
vi.mock('@/shared/config', () => ({ WS_URL: 'ws://test/ws' }));
vi.mock('../../auth/auth-client', () => ({ getAuthToken: () => getAuthToken() }));

const { SocketClient } = await import('../socket-client');

const lastSocket = () => FakeSocket.instances[FakeSocket.instances.length - 1];

const openNativeSocket = async (socket: FakeSocket) => {
  const url = await socket.url();

  return new socket.options.WebSocket(url, socket.protocols) as NativeSocket;
};

describe('socket client', () => {
  beforeEach(() => {
    FakeSocket.instances = [];
    getAuthToken.mockReset();
  });

  it('tells a late subscriber the socket is already open', () => {
    const client = new SocketClient();

    client.connect();
    lastSocket().fire('open');

    const states: string[] = [];

    client.subscribeState((state) => states.push(state));

    expect(states).toEqual(['open']);
  });

  it('keeps one socket across repeated connects', () => {
    const client = new SocketClient();

    client.connect();
    client.connect();

    expect(FakeSocket.instances).toHaveLength(1);
  });

  it('sends a fresh bearer token in a header on every connection attempt', async () => {
    const client = new SocketClient();

    client.connect();

    getAuthToken.mockResolvedValueOnce('first');
    const first = await openNativeSocket(lastSocket());

    getAuthToken.mockResolvedValueOnce('second');
    const second = await openNativeSocket(lastSocket());

    expect(first.url).toBe('ws://test/ws');
    expect(first.options).toEqual({ headers: { Authorization: 'Bearer first' } });
    expect(second.options).toEqual({ headers: { Authorization: 'Bearer second' } });
  });

  it('ignores events from a socket it has already let go', () => {
    const client = new SocketClient();
    const states: string[] = [];

    client.subscribeState((state) => states.push(state));
    client.connect();

    const stale = lastSocket();

    client.disconnect();
    client.connect();
    states.length = 0;

    stale.fire('close');
    stale.fire('open');

    expect(states).toEqual([]);
  });

  it('drops messages sent while the socket is not open', () => {
    const client = new SocketClient();

    client.connect();

    expect(client.send({ type: 'table:leave' })).toBe(false);

    lastSocket().fire('open');

    expect(lastSocket().sent).toEqual([]);
    expect(client.send({ type: 'table:leave' })).toBe(true);
    expect(lastSocket().sent).toEqual([JSON.stringify({ type: 'table:leave' })]);
  });
});
