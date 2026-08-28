import { describe, expect, it, vi } from 'vitest';

const openListeners: (() => void)[] = [];

class FakeSocket {
  static instances = 0;

  readyState = 0;
  readonly OPEN = 1;

  constructor(readonly url: string) {
    FakeSocket.instances += 1;
  }

  addEventListener(type: string, handler: () => void) {
    if (type === 'open') {
      openListeners.push(() => {
        this.readyState = this.OPEN;
        handler();
      });
    }
  }

  close() {
    this.readyState = 3;
  }

  send() {}
}

vi.mock('partysocket', () => ({ WebSocket: FakeSocket }));

const { SocketClient } = await import('../socket-client');

describe('socket client', () => {
  it('tells a late subscriber the socket is already open', () => {
    const client = new SocketClient();

    client.connect('ws://test?token=a');
    openListeners.forEach((fire) => fire());

    const states: string[] = [];

    client.subscribeState((state) => states.push(state));

    expect(states).toEqual(['open']);
  });

  it('reopens the socket when the url changes', () => {
    const client = new SocketClient();
    const before = FakeSocket.instances;

    client.connect('ws://test?token=a');
    client.connect('ws://test?token=a');

    expect(FakeSocket.instances).toBe(before + 1);

    client.connect('ws://test?token=b');

    expect(FakeSocket.instances).toBe(before + 2);
  });
});
