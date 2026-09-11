import { type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

type AccordionItemProps = {
  question: string;
  children: ReactNode;
  /** Первый вопрос можно открыть по умолчанию. */
  defaultOpen?: boolean;
};

/**
 * Раскрывающийся блок на нативном details — работает без JS
 * и корректно доступен с клавиатуры.
 */
export function AccordionItem({ question, children, defaultOpen = false }: AccordionItemProps) {
  return (
    <details
      className="group border-b border-border py-4 [&[open]_svg]:rotate-180"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="flex-1">{question}</span>
        <ChevronDown
          className="mt-0.5 size-5 shrink-0 text-accent-ink transition-transform duration-200"
          aria-hidden="true"
        />
      </summary>
      <div className="pt-3 text-fg-muted">{children}</div>
    </details>
  );
}

export function Accordion({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`border-t border-border ${className}`}>{children}</div>;
}
