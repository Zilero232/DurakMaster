export type BonusButtonProps = {
  isReady: boolean;

  /** Time left until the bonus unlocks, already formatted. */
  countdown: string;
  onClaim: () => void;
};
