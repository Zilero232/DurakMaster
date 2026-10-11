export type SoundName =
  | 'beat'
  | 'chat'
  | 'click'
  | 'deal'
  | 'error'
  | 'invite'
  | 'join'
  | 'lose'
  | 'pass'
  | 'play'
  | 'ready'
  | 'shuffle'
  | 'take'
  | 'turn'
  | 'win';

export type SoundVariant = {
  /** Identifies the pool of players that share this one file. */
  key: string;
  source: number;
};

const SOURCES: Record<SoundName, number[]> = {
  beat: [
    require('../../../assets/sounds/beat-1.mp3'),
    require('../../../assets/sounds/beat-2.mp3'),
    require('../../../assets/sounds/beat-3.mp3')
  ],
  chat: [require('../../../assets/sounds/chat.mp3')],
  click: [require('../../../assets/sounds/click.mp3')],
  deal: [
    require('../../../assets/sounds/deal-1.mp3'),
    require('../../../assets/sounds/deal-2.mp3'),
    require('../../../assets/sounds/deal-3.mp3')
  ],
  error: [require('../../../assets/sounds/error.mp3')],
  invite: [require('../../../assets/sounds/invite.mp3')],
  join: [require('../../../assets/sounds/join.mp3')],
  lose: [require('../../../assets/sounds/lose.mp3')],
  pass: [require('../../../assets/sounds/pass.mp3')],
  play: [
    require('../../../assets/sounds/play-1.mp3'),
    require('../../../assets/sounds/play-2.mp3'),
    require('../../../assets/sounds/play-3.mp3')
  ],
  ready: [require('../../../assets/sounds/ready.mp3')],
  shuffle: [require('../../../assets/sounds/shuffle.mp3')],
  take: [require('../../../assets/sounds/take.mp3')],
  turn: [require('../../../assets/sounds/turn.mp3')],
  win: [require('../../../assets/sounds/win.mp3')]
};

export const SOUND_VARIANTS: Record<SoundName, SoundVariant[]> = Object.fromEntries(
  Object.entries(SOURCES).map(([name, sources]) => [
    name,
    sources.map((source, index) => ({ key: `${name}:${index}`, source }))
  ])
) as Record<SoundName, SoundVariant[]>;
