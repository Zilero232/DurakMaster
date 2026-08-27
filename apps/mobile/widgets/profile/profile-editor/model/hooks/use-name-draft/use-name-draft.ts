import { useState } from 'react';

import { MIN_NAME_LENGTH } from '../../../config';

export const useNameDraft = (name: string) => {
  const [draft, setDraft] = useState(name);
  const [seed, setSeed] = useState(name);

  if (seed !== name) {
    setSeed(name);
    setDraft(name);
  }

  const trimmed = draft.trim();

  return {
    draft,
    trimmed,
    canSave: trimmed.length >= MIN_NAME_LENGTH && trimmed !== name,
    setDraft
  };
};
