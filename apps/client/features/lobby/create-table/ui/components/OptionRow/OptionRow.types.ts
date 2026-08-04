export type OptionItem<T> = {
  value: T;
  label: string;
};

export type OptionRowProps<T extends string | number> = {
  items: OptionItem<T>[];
  value: T;
  onChange: (value: T) => void;
};
