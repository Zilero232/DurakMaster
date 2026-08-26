import { match } from 'ts-pattern';

import type { GameSettingsProps } from './GameSettings.types';

import { BurkozelSettings } from '../BurkozelSettings';
import { DurakSettings } from '../DurakSettings';
import { KozelSettings } from '../KozelSettings';

export const GameSettings = ({ control, game }: GameSettingsProps) =>
  match(game)
    .with('durak', () => <DurakSettings control={control} />)
    .with('burkozel', () => <BurkozelSettings control={control} />)
    .with('kozel', () => <KozelSettings control={control} />)
    .otherwise(() => null);
