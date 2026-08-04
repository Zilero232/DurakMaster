export type PasswordPromptProps = {
  isOpen: boolean;
  /** Имя стола или ставка — чтобы игрок видел, куда вводит пароль. */
  tableLabel?: string;
  onSubmit: (password: string) => void;
  onClose: () => void;
};
