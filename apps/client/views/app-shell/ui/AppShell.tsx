'use client';

import { LogOut, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { match } from 'ts-pattern';

import { useSessionStore } from '@/entities/session';
import { SignInForm } from '@/features/auth/sign-in';
import { CreateTable } from '@/features/lobby/create-table';
import { SettingsPanel } from '@/features/settings/change-settings';
import { logout, useSession } from '@/shared/api/auth/auth-client';
import { SuitIcon } from '@/shared/ui';
import { TableList } from '@/widgets/lobby/table-list';
import { ProfileMenu } from '@/widgets/profile/profile-menu';
import { WalletBar } from '@/widgets/profile/wallet-bar';
import { RulesPanel } from '@/widgets/rules/rules-panel';

import s from './AppShell.module.scss';

import type { Suit, TableSettings } from '@durak-master/schemas';

type Tab = 'profile' | 'tables' | 'create';

/** Вкладки помечены мастями — язык самой игры вместо абстрактных значков. */
const TABS = [
  { id: 'profile', labelKey: 'profile', suit: 'clubs' },
  { id: 'tables', labelKey: 'tables', suit: 'hearts' },
  { id: 'create', labelKey: 'create', suit: 'diamonds' },
] as const satisfies readonly { id: Tab; labelKey: string; suit: Suit }[];

export const AppShell = () => {
  const t = useTranslations();

  const [tab, setTab] = useState<Tab>('profile');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

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
  const claimBonus = useSessionStore((store) => store.claimBonus);

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

  const handleLogout = async () => {
    await logout();
    // Полная перезагрузка: соединение и состояние стола должны обнулиться
    // вместе с сессией, иначе останутся данные прошлого игрока.
    window.location.reload();
  };

  if (isPending) {
    return <div className={s.loading}>{t('common.loading')}</div>;
  }

  if (!session) {
    return <SignInForm />;
  }

  return (
    <div className={s.root}>
      <header className={s.header}>
        <div className={s.headerInner}>
          <h1 className={s.title}>
            {match(tab)
              .with('profile', () => t('nav.profile'))
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

            <button
              type="button"
              className={s.iconButton}
              aria-label={t('auth.signOut')}
              onClick={handleLogout}
            >
              <LogOut size={18} aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <main className={s.content}>
        {tab === 'profile' && profile && (
          <div className={s.profile}>
            <WalletBar profile={profile} onClaimBonus={claimBonus} />

            <ProfileMenu
              onQuickGame={() => setTab('tables')}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenRules={() => setIsRulesOpen(true)}
            />
          </div>
        )}

        {tab === 'tables' && <TableList tables={tables} onJoin={joinTable} />}
        {tab === 'create' && <CreateTable onCreate={handleCreate} />}
      </main>

      <nav className={s.nav}>
        {TABS.map(({ id, labelKey, suit }) => (
          <button
            key={id}
            type="button"
            className={s.navItem}
            data-active={tab === id}
            onClick={() => setTab(id)}
          >
            <SuitIcon suit={suit} size={26} className={s.navIcon} />
            <span>{t(`nav.${labelKey}`)}</span>
          </button>
        ))}
      </nav>

      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <RulesPanel isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </div>
  );
};
