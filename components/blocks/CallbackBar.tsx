'use client';

import { Phone, MessageCircle, FileText } from 'lucide-react';
import { telHref } from '@/lib/phone';
import type { Messenger } from '@/content/types';

type CallbackBarProps = {
  phone: string | null;
  messenger?: Messenger | null;
  /** Якорь формы заявки на странице. */
  formHref?: string;
};

/**
 * Мобильная липкая полоса связи: звонок, мессенджер, заявка.
 * На десктопе скрыта — там контакты видны в шапке.
 */
export function CallbackBar({ phone, messenger, formHref = '#zayavka' }: CallbackBarProps) {
  if (!phone && !messenger) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-[color-mix(in_srgb,var(--bg)_94%,transparent)] backdrop-blur-md pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="grid grid-cols-3 divide-x divide-border">
        {phone ? (
          <a
            href={telHref(phone)}
            data-ym="phone_click"
            className="flex flex-col items-center gap-1 py-2.5 text-[0.6875rem] font-semibold"
          >
            <Phone className="size-5 text-accent-ink" aria-hidden="true" />
            Позвонить
          </a>
        ) : (
          <span />
        )}
        {messenger ? (
          <a
            href={messenger.url}
            target="_blank"
            rel="noopener noreferrer"
            data-ym="messenger_click"
            className="flex flex-col items-center gap-1 py-2.5 text-[0.6875rem] font-semibold"
          >
            <MessageCircle className="size-5 text-accent-ink" aria-hidden="true" />
            Написать
          </a>
        ) : (
          <span />
        )}
        <a href={formHref} className="flex flex-col items-center gap-1 py-2.5 text-[0.6875rem] font-semibold">
          <FileText className="size-5 text-accent-ink" aria-hidden="true" />
          Заявка
        </a>
      </div>
    </div>
  );
}
