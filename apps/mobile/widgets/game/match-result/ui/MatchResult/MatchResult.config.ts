export const OUTCOMES = {
  draw: { title: 'result.draw', hint: 'result.drawHint', isFool: false },
  lose: { title: 'result.lose', hint: 'result.loseHint', isFool: true },
  loseByLeaving: { title: 'result.lose', hint: 'result.leftHint', isFool: true },
  loseByTimeout: { title: 'result.lose', hint: 'result.timeoutHint', isFool: true },
  win: { title: 'result.win', hint: 'result.winHint', isFool: false }
} as const;
