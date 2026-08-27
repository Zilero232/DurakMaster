export type OptionItem<T> = {
  value: T;
  label: string;
  hint?: string;
};

export type OptionRowProps<T extends number | string> = {
  items: OptionItem<T>[];
  value: T;
  onChange: (value: T) => void;
};
