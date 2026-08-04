'use client';

import { QUICK_PHRASES } from '@durak-master/schemas';
import { useClickOutside } from '@siberiacancode/reactuse';
import { MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import s from './QuickPhrases.module.scss';

import type { QuickPhraseId } from '@durak-master/schemas';

type QuickPhrasesProps = {
  onSend: (phraseId: QuickPhraseId) => void;
};

/** Пауза между фразами: без неё набор превращается в инструмент спама. */
const COOLDOWN_MS = 3000;

export const QuickPhrases = ({ onSend }: QuickPhrasesProps) => {
  const t = useTranslations('phrases');

  const [isOpen, setIsOpen] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);

  const rootRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const handleSend = (phraseId: QuickPhraseId) => {
    if (Date.now() < cooldownUntil) {
      return;
    }

    onSend(phraseId);
    setCooldownUntil(Date.now() + COOLDOWN_MS);
    setIsOpen(false);
  };

  return (
    <div className={s.root} ref={rootRef}>
      <button
        type="button"
        className={s.trigger}
        aria-label={t('title')}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageSquare size={18} aria-hidden />
      </button>

      {isOpen && (
        <div className={s.list} role="menu">
          {QUICK_PHRASES.map((phraseId) => (
            <button
              key={phraseId}
              type="button"
              role="menuitem"
              className={s.phrase}
              onClick={() => handleSend(phraseId)}
            >
              {t(phraseId)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
