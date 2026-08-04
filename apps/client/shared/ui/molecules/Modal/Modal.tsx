'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

import s from './Modal.module.scss';

import type { ModalProps } from './Modal.types';

/**
 * Модальная панель поверх стола.
 *
 * Построена на нативном `<dialog>`: он сам даёт ловушку фокуса, закрытие
 * по Esc и слой поверх всего содержимого. Своя реализация на div'ах
 * потребовала бы повторить это вручную и всё равно вышла бы хуже.
 */
export const Modal = ({ isOpen, onClose, title, children, footer }: ModalProps) => {
  const t = useTranslations('common');
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: закрытие с клавиатуры даёт нативный <dialog> через onCancel
    <dialog
      ref={dialogRef}
      className={s.dialog}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      // Клик по подложке: цель события — сам dialog, а не его содержимое.
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          onClose();
        }
      }}
    >
      <div className={s.panel}>
        <header className={s.header}>
          <h2 className={s.title}>{title}</h2>

          <button type="button" className={s.close} aria-label={t('close')} onClick={onClose}>
            <X size={18} aria-hidden />
          </button>
        </header>

        <div className={s.content}>{children}</div>

        {footer && <footer className={s.footer}>{footer}</footer>}
      </div>
    </dialog>
  );
};
