import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { useMyProfile } from '@/entities/session';

import type { CreateTableFormValues } from '../../create-table-form';
import type { UseCreateTableFormInput } from './use-create-table-form.types';

import { pickDefaultBet } from '../../../lib';
import {
  clampPlayersToGame,
  CREATE_TABLE_DEFAULTS,
  createTableFormSchema,
  toTableSettings
} from '../../create-table-form';

export const useCreateTableForm = ({ onCreate }: UseCreateTableFormInput) => {
  const { profile } = useMyProfile();

  const credits = profile?.credits ?? 0;

  const { control, handleSubmit, setValue, formState } = useForm<CreateTableFormValues>({
    resolver: zodResolver(createTableFormSchema),
    defaultValues: { ...CREATE_TABLE_DEFAULTS, bet: pickDefaultBet(credits) },
    mode: 'onChange'
  });

  const game = useWatch({ control, name: 'game' });
  const maxPlayers = useWatch({ control, name: 'maxPlayers' });
  const durakRules = useWatch({ control, name: 'durakRules' });
  const isPrivate = useWatch({ control, name: 'isPrivate' });
  const bet = useWatch({ control, name: 'bet' });

  const { deckSize } = durakRules;

  const seats = clampPlayersToGame(game, maxPlayers, deckSize);

  useEffect(() => {
    if (seats !== maxPlayers) {
      setValue('maxPlayers', seats, { shouldValidate: true });
    }
  }, [maxPlayers, seats, setValue]);

  const selectGame = (nextGame: CreateTableFormValues['game']) => {
    setValue('game', nextGame, { shouldValidate: true });
    setValue('maxPlayers', clampPlayersToGame(nextGame, maxPlayers, deckSize), {
      shouldValidate: true
    });
  };

  const submit = handleSubmit((values) => {
    const password = values.password.trim();

    onCreate(toTableSettings(values), values.isPrivate ? password : undefined);
  });

  return {
    control,
    game,
    durakRules,
    isPrivate,
    canSubmit: formState.isValid && bet <= credits,
    selectGame,
    submit
  };
};
