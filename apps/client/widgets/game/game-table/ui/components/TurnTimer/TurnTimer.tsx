'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { secondsLeft } from '@/shared/lib/format';

import s from './TurnTimer.module.scss';

type TurnTimerProps = {
  /** Абсолютный дедлайн хода (мс). Приходит с сервера. */
  deadline: number | null;
};

/** С этой отметки таймер становится тревожным. */
const WARN_AT_SECONDS = 5;

export const TurnTimer = ({ deadline }: TurnTimerProps) => {
  const [left, setLeft] = useState(() => secondsLeft(deadline));

  useEffect(() => {
    setLeft(secondsLeft(deadline));

    if (!deadline) {
      return;
    }

    const timer = setInterval(() => setLeft(secondsLeft(deadline)), 250);

    return () => clearInterval(timer);
  }, [deadline]);

  if (!deadline || left <= 0) {
    return null;
  }

  return (
    <span className={clsx(s.root, left <= WARN_AT_SECONDS && s.warn)} aria-live="off">
      {left}
    </span>
  );
};
