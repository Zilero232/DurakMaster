'use client';

import { Dialog } from '@base-ui-components/react/dialog';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import s from './Modal.module.scss';

import type { ModalProps } from './Modal.types';

/**
 * Модальная панель поверх стола.
 *
 * Построена на Base UI: ловушка фокуса, закрытие по Esc и клику по подложке,
 * блокировка прокрутки и ARIA-разметка идут из коробки. Своя реализация на
 * `<dialog>` повторяла бы всё это вручную и всё равно вышла бы беднее.
 */
export const Modal = ({ isOpen, title, children, footer, onClose }: ModalProps) => {
  const t = useTranslations('common');

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className={s.backdrop} />

        <Dialog.Popup className={s.popup}>
          <header className={s.header}>
            <Dialog.Title className={s.title}>{title}</Dialog.Title>

            <Dialog.Close className={s.close} aria-label={t('close')}>
              <X size={18} aria-hidden />
            </Dialog.Close>
          </header>

          <div className={s.content}>{children}</div>

          {footer && <footer className={s.footer}>{footer}</footer>}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
