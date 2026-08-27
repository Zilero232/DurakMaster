import type { SettingsForGame } from '@durak-master/schemas';

import { KOZEL_SEATS } from '../config';

type FirstLeadInput = {
  settings: SettingsForGame<'kozel'>;
  dealerSeat: number;
  lowestTrumpSeat: number;
};

/** Who opens the first deal — by default whoever was dealt the eight of clubs. */
export const firstLeadSeat = ({
  settings,
  dealerSeat,
  lowestTrumpSeat
}: FirstLeadInput): number => {
  switch (settings.rules.firstLead) {
    case 'leftOfDealer': {
      return (dealerSeat + 1) % KOZEL_SEATS;
    }

    case 'dealer': {
      return dealerSeat;
    }

    default: {
      return lowestTrumpSeat;
    }
  }
};
