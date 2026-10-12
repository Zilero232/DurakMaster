export const signed = (value: number): string => (value > 0 ? `+${value}` : String(value));
