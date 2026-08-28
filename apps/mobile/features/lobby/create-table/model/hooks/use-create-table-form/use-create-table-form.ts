import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import type { CreateTableFormValues } from '../../create-table-form';

import {
  clampPlayersToGame,
  CREATE_TABLE_DEFAULTS,
  createTableFormSchema,
  toTableSettings
} from '../../create-table-form';

type UseCreateTableFormOptions = {
  onCreate: (settings: ReturnType<typeof toTableSettings>, password?: string) => void;
};

export const useCreateTableForm = ({ onCreate }: UseCreateTableFormOptions) => {
  const { control, handleSubmit, setValue, formState } = useForm<CreateTableFormValues>({
    resolver: zodResolver(createTableFormSchema),
    defaultValues: CREATE_TABLE_DEFAULTS,
    mode: 'onChange'
  });

  const game = useWatch({ control, name: 'game' });
  const maxPlayers = useWatch({ control, name: 'maxPlayers' });
  const deckSize = useWatch({ control, name: 'durakRules.deckSize' });
  const isPrivate = useWatch({ control, name: 'isPrivate' });

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
    deckSize,
    isPrivate,
    canSubmit: formState.isValid,
    selectGame,
    submit
  };
};
