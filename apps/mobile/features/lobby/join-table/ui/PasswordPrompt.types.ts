export type PasswordPromptProps = {
  isOpen: boolean;
  onSubmit: (password: string) => void;
  onClose: () => void;
};
