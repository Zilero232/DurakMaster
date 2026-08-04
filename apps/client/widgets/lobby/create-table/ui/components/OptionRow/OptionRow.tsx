'use client';

import { useId } from 'react';

import s from './OptionRow.module.scss';

import type { OptionRowProps } from './OptionRow.types';

/**
 * Ряд взаимоисключающих вариантов — количество игроков, размер колоды, темп.
 * Дженерик по типу значения: одинаково работает для чисел и строковых
 * литералов, не теряя типизацию в обработчике.
 *
 * Под плитками лежат настоящие radio: они дают навигацию стрелками и
 * семантику группы, которую иначе пришлось бы повторять руками через ARIA.
 */
export const OptionRow = <T extends string | number>({
  items,
  value,
  onChange,
}: OptionRowProps<T>) => {
  const name = useId();

  return (
    <div className={s.root}>
      {items.map((item) => (
        <label key={item.value} className={s.option} data-active={value === item.value}>
          <input
            type="radio"
            name={name}
            className={s.input}
            checked={value === item.value}
            onChange={() => onChange(item.value)}
          />
          {item.label}
        </label>
      ))}
    </div>
  );
};
