import { type ReactNode } from 'react';
import { Container } from './Container';

type SectionProps = {
  children: ReactNode;
  id?: string;
  /** Фон секции: базовый, приглушённый или поверхность-карточка. */
  tone?: 'base' | 'deep' | 'surface';
  className?: string;
  /** Уменьшенные вертикальные отступы для плотных секций. */
  compact?: boolean;
  /** Диагональный срез верхней кромки — мотив раскола из логотипа. */
  splitTop?: boolean;
};

const TONE: Record<NonNullable<SectionProps['tone']>, string> = {
  base: 'bg-bg',
  deep: 'bg-bg-deep',
  surface: 'bg-surface',
};

export function Section({
  children,
  id,
  tone = 'base',
  className = '',
  compact = false,
  splitTop = false,
}: SectionProps) {
  const padding = compact ? 'py-12 md:py-16' : 'py-16 md:py-24';
  const split = splitTop ? 'relative [clip-path:polygon(0_2.5rem,100%_0,100%_100%,0_100%)] -mt-10 pt-24 md:pt-32' : '';
  return (
    <section id={id} className={`${TONE[tone]} ${padding} ${split} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

type SectionHeadProps = {
  /** Мелкая капс-подпись над заголовком. */
  eyebrow?: string;
  title: string;
  lead?: string;
  /** Выравнивание: по левому краю по умолчанию — ритм без лишней симметрии. */
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHead({
  eyebrow,
  title,
  lead,
  align = 'left',
  className = '',
}: SectionHeadProps) {
  const alignment = align === 'center' ? 'text-center mx-auto max-w-2xl' : 'max-w-3xl';
  return (
    <header className={`${alignment} ${className}`}>
      {eyebrow ? <p className="eyebrow text-accent-ink mb-3">{eyebrow}</p> : null}
      <h2 className="display-lg">{title}</h2>
      {lead ? <p className="lead mt-4">{lead}</p> : null}
    </header>
  );
}
