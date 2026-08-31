import { createContext, use } from 'react';

import type { SeatContextValue } from './seat-context.types';

import { EMPTY_SEAT_CONTEXT } from './seat-context.config';

const SeatContext = createContext<SeatContextValue>(EMPTY_SEAT_CONTEXT);

export const SeatProvider = SeatContext.Provider;

export const useSeatContext = (): SeatContextValue => use(SeatContext);
