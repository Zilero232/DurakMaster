'use client';

import { BET_STEPS, DEFAULT_TABLE_SETTINGS, TURN_SECONDS_BY_SPEED } from '@durak-master/schemas';
import {
  ArrowLeftRight,
  ArrowRightToLine,
  Crown,
  Equal,
  Handshake,
  RefreshCw,
  Users,
  VenetianMask,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { formatCredits } from '@/shared/lib/format';
import { Button } from '@/shared/ui';
import { ModeCard, OptionRow, SettingsSection } from './components';

import s from './CreateTable.module.scss';

import type { DeckSize, Fairness, GameMode, GameSpeed, ThrowInScope } from '@durak-master/schemas';
import type { CreateTableProps } from './CreateTable.types';

const PLAYER_COUNTS = [2, 3, 4, 5, 6];
const DECK_SIZES: DeckSize[] = [24, 36, 52];
/** Стартовая ступень слайдера — 1000 кредитов. */
const DEFAULT_BET_INDEX = 2;

export const CreateTable = ({ onCreate }: CreateTableProps) => {
  const t = useTranslations('create');
  const tMode = useTranslations('create.mode');

  const [betIndex, setBetIndex] = useState(DEFAULT_BET_INDEX);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [deckSize, setDeckSize] = useState<DeckSize>(36);
  const [speed, setSpeed] = useState<GameSpeed>('normal');
  const [mode, setMode] = useState<GameMode>('throwIn');
  const [throwInScope, setThrowInScope] = useState<ThrowInScope>('neighbors');
  const [fairness, setFairness] = useState<Fairness>('fair');
  const [isClassic, setIsClassic] = useState(true);
  const [allowDraw, setAllowDraw] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');

  const bet = BET_STEPS[betIndex] ?? BET_STEPS[0];
  // Приватный стол без пароля пустил бы кого угодно — кнопка ждёт ввода.
  const canCreate = !isPrivate || password.trim().length > 0;

  const handleCreate = () => {
    onCreate(
      {
        ...DEFAULT_TABLE_SETTINGS,
        mode,
        deckSize,
        maxPlayers,
        throwInScope,
        fairness,
        speed,
        isClassic,
        allowDraw,
        isPrivate,
        bet,
        turnTimeoutSeconds: TURN_SECONDS_BY_SPEED[speed],
      },
      isPrivate ? password.trim() : undefined,
    );
  };

  return (
    <div className={s.root}>
      <section className={s.betSection}>
        <div className={s.betHeader}>
          <span className={s.betLabel}>{t('yourBet')}</span>
          <span className={s.betValue}>{formatCredits(bet)}</span>
        </div>

        <input
          type="range"
          className={s.slider}
          min={0}
          max={BET_STEPS.length - 1}
          step={1}
          value={betIndex}
          aria-label={t('betLabel')}
          onChange={(event) => setBetIndex(Number(event.target.value))}
        />

        <div className={s.scale}>
          {BET_STEPS.filter((_, index) => index % 2 === 0).map((step) => (
            <span key={step}>{formatCredits(step)}</span>
          ))}
        </div>
      </section>

      <SettingsSection title={t('players')}>
        <OptionRow
          items={PLAYER_COUNTS.map((count) => ({ value: count, label: String(count) }))}
          value={maxPlayers}
          onChange={setMaxPlayers}
        />
      </SettingsSection>

      <div className={s.row}>
        <SettingsSection title={t('deck')}>
          <OptionRow
            items={DECK_SIZES.map((size) => ({ value: size, label: String(size) }))}
            value={deckSize}
            onChange={setDeckSize}
          />
        </SettingsSection>

        <SettingsSection title={t('speed')}>
          <OptionRow
            items={[
              { value: 'normal' as const, label: t('speedNormal') },
              { value: 'fast' as const, label: t('speedFast') },
            ]}
            value={speed}
            onChange={setSpeed}
          />
        </SettingsSection>
      </div>

      <SettingsSection title={t('modes')}>
        <div className={s.modes}>
          <ModeCard
            icon={ArrowRightToLine}
            label={tMode('throwIn')}
            isActive={mode === 'throwIn'}
            onClick={() => setMode('throwIn')}
          />
          <ModeCard
            icon={RefreshCw}
            label={tMode('transfer')}
            isActive={mode === 'transfer'}
            onClick={() => setMode('transfer')}
          />
          <ModeCard
            icon={ArrowLeftRight}
            label={tMode('neighbors')}
            hint={tMode('neighborsHint')}
            isActive={throwInScope === 'neighbors'}
            onClick={() => setThrowInScope('neighbors')}
          />
          <ModeCard
            icon={Users}
            label={tMode('all')}
            hint={tMode('allHint')}
            isActive={throwInScope === 'all'}
            onClick={() => setThrowInScope('all')}
          />
          <ModeCard
            icon={Handshake}
            label={tMode('fair')}
            isActive={fairness === 'fair'}
            onClick={() => setFairness('fair')}
          />
          <ModeCard
            icon={VenetianMask}
            label={tMode('cheaters')}
            hint={tMode('cheatersHint')}
            isActive={fairness === 'cheaters'}
            onClick={() => setFairness('cheaters')}
          />
          <ModeCard
            icon={Crown}
            label={tMode('classic')}
            hint={tMode('classicHint')}
            isActive={isClassic}
            onClick={() => setIsClassic(!isClassic)}
          />
          <ModeCard
            icon={Equal}
            label={tMode('draw')}
            isActive={allowDraw}
            onClick={() => setAllowDraw(!allowDraw)}
          />
        </div>
      </SettingsSection>

      <label className={s.privateRow}>
        <input
          type="checkbox"
          checked={isPrivate}
          onChange={(event) => setIsPrivate(event.target.checked)}
        />
        <span>{t('private')}</span>
      </label>

      {isPrivate && (
        <input
          className={s.password}
          type="text"
          value={password}
          maxLength={32}
          autoComplete="off"
          placeholder={t('passwordPlaceholder')}
          aria-label={t('password')}
          onChange={(event) => setPassword(event.target.value)}
        />
      )}

      <Button
        variant="primary"
        size="lg"
        isFullWidth
        isDisabled={!canCreate}
        onClick={handleCreate}
      >
        {t('submit')}
      </Button>
    </div>
  );
};
