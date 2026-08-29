export type SoundName =
  | 'beat'
  | 'click'
  | 'deal'
  | 'error'
  | 'lose'
  | 'pass'
  | 'play'
  | 'ready'
  | 'shuffle'
  | 'take'
  | 'turn'
  | 'win';

export const SOUND_SOURCES: Record<SoundName, number[]> = {
  beat: [
    require('../../../assets/sounds/beat-1.ogg'),
    require('../../../assets/sounds/beat-2.ogg'),
    require('../../../assets/sounds/beat-3.ogg')
  ],
  click: [require('../../../assets/sounds/click.ogg')],
  deal: [
    require('../../../assets/sounds/deal-1.ogg'),
    require('../../../assets/sounds/deal-2.ogg'),
    require('../../../assets/sounds/deal-3.ogg')
  ],
  error: [require('../../../assets/sounds/error.ogg')],
  lose: [require('../../../assets/sounds/lose.ogg')],
  pass: [require('../../../assets/sounds/pass.ogg')],
  play: [
    require('../../../assets/sounds/play-1.ogg'),
    require('../../../assets/sounds/play-2.ogg'),
    require('../../../assets/sounds/play-3.ogg')
  ],
  ready: [require('../../../assets/sounds/ready.wav')],
  shuffle: [require('../../../assets/sounds/shuffle.ogg')],
  take: [require('../../../assets/sounds/take.ogg')],
  turn: [require('../../../assets/sounds/turn.ogg')],
  win: [require('../../../assets/sounds/win.ogg')]
};
