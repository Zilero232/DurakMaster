import auth from './auth.json';
import common from './common.json';
import errors from './errors.json';
import lobby from './lobby.json';
import profile from './profile.json';
import rules from './rules.json';
import settings from './settings.json';
import social from './social.json';
import table from './table.json';

export const en = {
  ...common,
  ...auth,
  ...profile,
  ...lobby,
  ...rules,
  ...table,
  ...settings,
  ...social,
  ...errors
} as const;
