import { type ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
  /** plate — красная плашка как «ОРЕНБУРГСКАЯ ОБЛАСТЬ» на логотипе. */
  variant?: 'plate' | 'accent' | 'quiet' | 'draft';
  className?: string;
};

const VARIANT: Record<NonNullable<BadgeProps['variant']>, string> = {
  plate: 'bg-[var(--color-red-deep)] text-white',
  accent: 'bg-accent text-accent-fg',
  quiet: 'bg-surface-2 text-fg-muted border border-border',
  draft: 'bg-transparent text-fg-subtle border border-dashed border-border-strong',
};

export function Badge({ children, variant = 'quiet', className = '' }: BadgeProps) {
  return (
    <span
      className={`eyebrow inline-flex items-center gap-1.5 rounded-[var(--radius-xs)] px-2.5 py-1.5 text-[0.6875rem] ${VARIANT[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

/** Пометка рядом с черновой ценой: данные ещё не подтверждены владельцем. */
export function DraftMark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`ml-1.5 align-middle text-[0.6875rem] font-normal tracking-normal text-fg-subtle ${className}`}
      title="Ориентировочная цена, уточняется при расчёте"
    >
      уточняется
    </span>
  );
}
