import Link from 'next/link';
import { type ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
  /** Диагональный срез правого нижнего угла — мотив визиток. */
  clipped?: boolean;
  href?: string;
  /** Подсветка рамки акцентом при наведении. */
  interactive?: boolean;
};

export function Card({ children, className = '', clipped = false, href, interactive }: CardProps) {
  const hoverable = interactive ?? Boolean(href);
  const classes = [
    'relative block bg-surface border border-border p-6 md:p-7',
    clipped ? 'clip-corner' : 'rounded-[var(--radius-md)]',
    hoverable
      ? 'transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-[var(--shadow)]'
      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (href) {
    const external = /^(https?:|tel:|mailto:)/.test(href);
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <div className={classes}>{children}</div>;
}

type StatProps = {
  value: string;
  label: string;
  hint?: string;
  className?: string;
};

/** Факт цифрой: крупное значение дисплейным шрифтом и подпись. */
export function Stat({ value, label, hint, className = '' }: StatProps) {
  return (
    <div className={className}>
      <p className="display-md tabular text-accent-ink">{value}</p>
      <p className="mt-1 text-[0.9375rem] font-semibold leading-snug">{label}</p>
      {hint ? <p className="mt-0.5 text-sm text-fg-subtle">{hint}</p> : null}
    </div>
  );
}
