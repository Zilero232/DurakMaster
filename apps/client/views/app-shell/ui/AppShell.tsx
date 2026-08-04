'use client';

import { Plus, Search, Settings, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { match } from 'ts-pattern';

import { useSessionStore } from '@/entities/session';
import { useSession } from '@/shared/api/auth/auth-client';
import { AuthForm } from '@/widgets/auth/auth-form';
import { CreateTable } from '@/widgets/lobby/create-table';
import { TableList } from '@/widgets/lobby/table-list';
import { ProfileCard } from '@/widgets/profile/profile-card';
import { SettingsPanel } from '@/widgets/settings/settings-panel';

import s from './AppShell.module.scss';

import type { TableSettings } from '@durak-master/schemas';

type Tab = 'profile' | 'tables' | 'create';

const TABS: { id: Tab; labelKey: 'profile' | 'tables' | 'create'; Icon: typeof User }[] = [
  { id: 'profile', labelKey: 'profile', Icon: User },
  { id: 'tables', labelKey: 'tables', Icon: Search },
  { id: 'create', labelKey: 'create', Icon: Plus },
];

export const AppShell = () => {
  const t = useTranslations();

  const [tab, setTab] = useState<Tab>('tables');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { data: session, isPending } = useSession();

  const status = useSessionStore((store) => store.status);
  const profile = useSessionStore((store) => store.profile);
  const tables = useSessionStore((store) => store.tables);
  const connect = useSessionStore((store) => store.connect);
  const subscribeLobby = useSessionStore((store) => store.subscribeLobby);
  const createTable = useSessionStore((store) => store.createTable);
  const joinTable = useSessionStore((store) => store.joinTable);
  const lastError = useSessionStore((store) => store.lastError);
  const clearError = useSessionStore((store) => store.clearError);

  // Подключаемся только с активной сессией: без неё шлюз всё равно
  // разорвёт соединение — личность игрока берётся из проверенного токена.
  useEffect(() => {
    if (session) {
      connect();
    }
  }, [session, connect]);

  useEffect(() => {
    if (status === 'connected') {
      subscribeLobby();
    }
  }, [status, subscribeLobby]);

  /**
   * Ошибки лобби показываем тостом.
   *
   * Самая частая — нехватка кредитов на ставку: без сообщения кнопка
   * «Сесть» просто не срабатывает, и причина остаётся неочевидной.
   */
  useEffect(() => {
    if (!lastError) {
      return;
    }

    toast.error(lastError);
    clearError();
  }, [lastError, clearError]);

  const handleCreate = (settings: TableSettings) => {
    createTable(settings);
  };

  if (isPending) {
    return <div className={s.loading}>{t('common.loading')}</div>;
  }

  if (!session) {
    return <AuthForm />;
  }

  return (
    <div className={s.root}>
      <header className={s.header}>
        <h1 className={s.title}>
          {match(tab)
            .with('profile', () => profile?.name ?? t('nav.profile'))
            .with('tables', () => t('lobby.title'))
            .with('create', () => t('create.title'))
            .exhaustive()}
        </h1>

        <div className={s.headerActions}>
          {status !== 'connected' && (
            <span className={s.status} data-status={status}>
              {status === 'connecting' ? t('connection.connecting') : t('connection.offline')}
            </span>
          )}

          <button
            type="button"
            className={s.iconButton}
            aria-label={t('settings.title')}
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings size={18} aria-hidden />
          </button>
        </div>
      </header>

      <main className={s.content}>
        {tab === 'profile' && profile && <ProfileCard profile={profile} />}
        {tab === 'tables' && <TableList tables={tables} onJoin={joinTable} />}
        {tab === 'create' && <CreateTable onCreate={handleCreate} />}
      </main>

      <nav className={s.nav}>
        {TABS.map(({ id, labelKey, Icon }) => (
          <button
            key={id}
            type="button"
            className={s.navItem}
            data-active={tab === id}
            onClick={() => setTab(id)}
          >
            <Icon size={20} aria-hidden />
            <span>{t(`nav.${labelKey}`)}</span>
          </button>
        ))}
      </nav>

      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};
