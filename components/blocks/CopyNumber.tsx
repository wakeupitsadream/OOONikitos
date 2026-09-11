'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

/**
 * Номер лицензии с кнопкой копирования: номер должен оставаться доступным,
 * даже если реестр недоступен и кнопка проверки не сработала.
 */
export function CopyNumber({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Буфер обмена недоступен — номер всё равно виден текстом
    }
  };

  return (
    <span className="inline-flex max-w-full items-center gap-2">
      <span className="select-all break-all">{value}</span>
      <button
        type="button"
        onClick={copy}
        className="grid size-7 place-items-center rounded-[var(--radius-xs)] border border-border text-fg-subtle transition-colors hover:border-accent hover:text-accent-ink"
        aria-label={copied ? 'Номер скопирован' : 'Скопировать номер лицензии'}
      >
        {copied ? (
          <Check className="size-3.5 text-[var(--ok)]" aria-hidden="true" />
        ) : (
          <Copy className="size-3.5" aria-hidden="true" />
        )}
      </button>
    </span>
  );
}
