'use client';

import { Radio } from '@base-ui-components/react/radio';
import { RadioGroup } from '@base-ui-components/react/radio-group';

import s from './OptionRow.module.scss';

import type { OptionRowProps } from './OptionRow.types';

/**
 * Ряд взаимоисключающих вариантов — количество игроков, размер колоды, темп.
 * Дженерик по типу значения: одинаково работает для чисел и строковых
 * литералов, не теряя типизацию в обработчике.
 *
 * Навигация стрелками, семантику группы и роль radio даёт Base UI —
 * вручную это повторялось бы скрытыми input и ARIA-атрибутами.
 */
export const OptionRow = <T extends string | number>({
  items,
  value,
  onChange,
}: OptionRowProps<T>) => {
  return (
    <RadioGroup className={s.root} value={value} onValueChange={(next) => onChange(next as T)}>
      {items.map((item) => (
        <Radio.Root key={item.value} className={s.option} value={item.value}>
          {item.label}
        </Radio.Root>
      ))}
    </RadioGroup>
  );
};
