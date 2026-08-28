import { match } from 'ts-pattern';

import { CreateTable } from '@/features/lobby/create-table';
import { TableList } from '@/widgets/lobby/table-list';

import type { ShellContentProps } from './ShellContent.types';

import { ProfileTab } from '../ProfileTab';
import { ProfileTabSkeleton } from '../ProfileTabSkeleton';

export const ShellContent = ({
  tab,
  profile,
  tables,
  status,
  onJoin,
  onCreateTable,
  onGoToCreate,
  onClaimBonus,
  onOpenPanel
}: ShellContentProps) =>
  match(tab)
    .with('profile', () =>
      profile ? (
        <ProfileTab profile={profile} onClaimBonus={onClaimBonus} onOpenPanel={onOpenPanel} />
      ) : (
        <ProfileTabSkeleton />
      )
    )
    .with('tables', () => (
      <TableList status={status} tables={tables} onCreate={onGoToCreate} onJoin={onJoin} />
    ))
    .with('create', () => <CreateTable onCreate={onCreateTable} />)
    .exhaustive();
