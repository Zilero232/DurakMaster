export type CountBadgeTone = 'danger' | 'gold';

export type CountBadgeProps = {
  /** Nothing is rendered when the count is 0 — the caller does not need its own guard. */
  count: number;

  tone?: CountBadgeTone;
  max?: number;
};
