export type PasswordPromptProps = {
  isOpen: boolean;
  tableLabel?: string;
  onSubmit: (password: string) => void;
  onClose: () => void;
};
