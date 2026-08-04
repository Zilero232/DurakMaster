'use client';

import { useTranslations } from 'next-intl';

import { Button, Modal } from '@/shared/ui';

import s from './RulesPanel.module.scss';

import type { RulesPanelProps } from './RulesPanel.types';

/** Разделы правил. Тексты живут в переводах — их читают, а не парсят. */
const SECTIONS = ['deal', 'firstMove', 'defend', 'throwIn', 'endBout', 'draw', 'end'] as const;

export const RulesPanel = ({ isOpen, onClose }: RulesPanelProps) => {
  const t = useTranslations('rules');

  return (
    <Modal
      isOpen={isOpen}
      title={t('title')}
      footer={
        <Button variant="primary" isFullWidth onClick={onClose}>
          {t('close')}
        </Button>
      }
      onClose={onClose}
    >
      <div className={s.sections}>
        {SECTIONS.map((section) => (
          <section key={section} className={s.section}>
            <h3 className={s.heading}>{t(`${section}.title`)}</h3>
            <p className={s.text}>{t(`${section}.text`)}</p>
          </section>
        ))}
      </div>
    </Modal>
  );
};
