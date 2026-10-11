export type RewardedAdResult =
  | { status: 'dismissed' }
  | { status: 'earned' }
  | { status: 'failed'; reason: string }
  | { status: 'unavailable' };
