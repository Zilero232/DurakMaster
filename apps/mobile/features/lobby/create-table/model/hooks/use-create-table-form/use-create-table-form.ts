import { zodResolver } from '@hookform/resolvers/zod';
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
  const isPrivate = useWatch({ control, name: 'isPrivate' });

  const selectGame = (nextGame: CreateTableFormValues['game']) => {
    setValue('game', nextGame, { shouldValidate: true });
    setValue('maxPlayers', clampPlayersToGame(nextGame, maxPlayers), { shouldValidate: true });
  };

  const submit = handleSubmit((values) => {
    const password = values.password.trim();

    onCreate(toTableSettings(values), values.isPrivate ? password : undefined);
  });

  return {
    control,
    game,
    isPrivate,
    canSubmit: formState.isValid,
    selectGame,
    submit
  };
};
