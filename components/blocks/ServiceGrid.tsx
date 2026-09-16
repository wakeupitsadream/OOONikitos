import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ServiceIcon } from '@/components/icons';
import { Diamond } from '@/components/ui/Diamond';
import { formatPriceFrom } from '@/lib/plural';

type ServiceCardItem = {
  slug: string;
  title: string;
  lead: string;
  icon: string;
  priceFrom?: number;
  /** Готовая подпись цены («от 700 ₽/м²») — приоритетнее priceFrom. */
  priceLabel?: string;
  /** Что писать, когда цены нет: по умолчанию «Цена по осмотру». */
  noPriceLabel?: string;
};

type ServiceGridProps = {
  items: ServiceCardItem[];
  /** Базовый путь каталога: /uslugi */
  basePath?: string;
  priceDraft?: boolean;
  className?: string;
};

export function ServiceGrid({
  items,
  basePath = '/uslugi',
  priceDraft = false,
  className = '',
}: ServiceGridProps) {
  return (
    <ul className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`${basePath}/${item.slug}`}
              className="group flex h-full flex-col rounded-[var(--radius-md)] border border-border bg-surface p-6 transition-[border-color,transform] duration-200 hover:-translate-y-1 hover:border-accent"
            >
              <Diamond variant="accent" size="md">
                <ServiceIcon name={item.icon} />
              </Diamond>
              <p className="mt-4 font-display text-lg font-extrabold leading-snug">{item.title}</p>
              <p className="mt-2 flex-1 text-[0.9375rem] text-fg-muted">{item.lead}</p>
              <span className="mt-5 flex items-center justify-between gap-3">
                {item.priceLabel ? (
                  <span className="tabular font-display text-lg font-extrabold text-accent-ink">
                    {item.priceLabel}
                  </span>
                ) : item.priceFrom ? (
                  <span className="tabular font-display text-lg font-extrabold text-accent-ink">
                    {formatPriceFrom(item.priceFrom)}
                    {priceDraft ? (
                      <span className="ml-1.5 text-xs font-normal tracking-normal text-fg-subtle">
                        уточняется
                      </span>
                    ) : null}
                  </span>
                ) : (
                  <span className="text-sm text-fg-subtle">{item.noPriceLabel ?? 'Цена по осмотру'}</span>
                )}
                <ArrowRight
                  className="size-5 shrink-0 text-accent-ink transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </li>
      ))}
    </ul>
  );
}
