import type { SuitMark } from '../../LobbyBackground.config';

export type DriftingSuitProps = {
  mark: SuitMark;

  top: number;
  left: number;

  /** Battery saver and reduced-motion callers pin the suits in place. */
  isStatic: boolean;
};
