export type ModeCardProps = {
  label: string;
  /** Короткое пояснение под названием — что режим меняет в правилах. */
  hint?: string;
  isActive: boolean;
  onClick: () => void;
};
