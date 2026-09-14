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

type Item = {
  key: string;
  href: string;
  label: string;
  icon: typeof Phone;
  external?: boolean;
  ym?: string;
};

const COLUMNS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
};

/**
 * Мобильная липкая полоса связи: звонок, мессенджер, заявка.
 * На десктопе скрыта — там контакты видны в шапке. Ячеек ровно столько,
 * сколько есть каналов: пустых колонок с разделителями не остаётся.
 */
export function CallbackBar({ phone, messenger, formHref = '#zayavka' }: CallbackBarProps) {
  const items: Item[] = [];
  if (phone) {
    items.push({ key: 'phone', href: telHref(phone), label: 'Позвонить', icon: Phone, ym: 'phone_click' });
  }
  if (messenger) {
    items.push({
      key: 'messenger',
      href: messenger.url,
      label: 'Написать',
      icon: MessageCircle,
      external: true,
      ym: 'messenger_click',
    });
  }
  items.push({ key: 'form', href: formHref, label: 'Заявка', icon: FileText });

  if (items.length < 2) return null;

  return (
    <div
      data-callback-bar
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-[color-mix(in_srgb,var(--bg)_94%,transparent)] backdrop-blur-md pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <div className={`grid ${COLUMNS[items.length] ?? 'grid-cols-3'} divide-x divide-border`}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.key}
              href={item.href}
              data-ym={item.ym}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              className="flex min-h-14 flex-col items-center justify-center gap-1 py-2.5 text-[0.6875rem] font-semibold"
            >
              <Icon className="size-5 text-accent-ink" aria-hidden="true" />
              {item.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}
