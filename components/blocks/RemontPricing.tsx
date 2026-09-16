import { Check } from 'lucide-react';
import {
  guaranteeLabel,
  type ExtraWork,
  type SlopeTariff,
  type TariffId,
  type WallTariff,
} from '@/lib/calc/remont';
import { EXTRA_WORKS, SLOPE_STAGES, SLOPE_TARIFFS, WALL_TARIFFS } from '@/content/remont/prices';
import type { RemontService } from '@/content/remont/services';
import { formatPrice } from '@/lib/plural';
import { Badge } from '@/components/ui/Badge';

/**
 * Прайс «Бриллиант Ремонт» в разметке: тарифы на стены, тарифы на откосы,
 * таблица дополнительных работ. Данные — content/remont/prices.ts,
 * компоненты только раскладывают их по карточкам и строкам.
 */

const NBSP = ' ';

type TariffCardsProps = {
  tariffs: WallTariff[];
  /** Какой тариф подсветить; без него — популярный. */
  highlight?: TariffId;
  /** Без состава работ — для страниц, где нужна только цена. */
  compact?: boolean;
  className?: string;
};

export function TariffCards({ tariffs, highlight, compact = false, className = '' }: TariffCardsProps) {
  return (
    <ul className={`grid gap-4 lg:grid-cols-3 ${className}`}>
      {tariffs.map((tariff) => {
        const active = highlight ? tariff.id === highlight : Boolean(tariff.popular);
        const parent = tariff.inheritsFrom
          ? tariffs.find((item) => item.id === tariff.inheritsFrom)
          : null;
        return (
          <li
            key={tariff.id}
            className={`relative flex h-full flex-col rounded-[var(--radius-md)] border bg-surface p-6 ${
              active ? 'border-accent shadow-[var(--shadow)]' : 'border-border'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="eyebrow text-fg-subtle">Тариф</p>
                <p className="display-md mt-1">{tariff.label}</p>
              </div>
              {tariff.popular ? <Badge variant="accent">Выбор большинства</Badge> : null}
            </div>
            <p className="mt-2 text-sm font-semibold text-accent-ink">{tariff.scope}</p>

            <p className="tabular mt-4 font-display text-3xl font-black leading-none">
              {formatPrice(tariff.pricePerM2)}
              <span className="text-base font-semibold text-fg-subtle">/м²</span>
            </p>
            <p className="mt-1.5 text-xs text-fg-subtle">Фиксированная стоимость работ</p>

            <p className="mt-4 font-semibold">{tariff.tagline}</p>
            <p className="mt-1 text-sm text-fg-muted">{tariff.description}</p>

            {!compact ? (
              <>
                <p className="eyebrow mt-5 text-fg-subtle">
                  {parent ? `Всё из тарифа «${parent.label}», а также:` : 'В стоимость входит:'}
                </p>
                <ul className="mt-2 flex-1 space-y-1.5 text-sm">
                  {tariff.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-accent-ink" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <span className="flex-1" />
            )}

            <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-4 text-xs text-fg-subtle">
              <div>
                <dt>Мин. объём</dt>
                <dd className="tabular mt-0.5 text-sm font-semibold text-fg">{`${tariff.minArea}${NBSP}м²`}</dd>
              </div>
              <div>
                <dt>Гарантия</dt>
                <dd className="tabular mt-0.5 text-sm font-semibold text-fg">
                  {guaranteeLabel(tariff.guaranteeMonths)}
                </dd>
              </div>
              <div>
                <dt>Сроки</dt>
                <dd className="tabular mt-0.5 text-sm font-semibold text-fg">{`от ${tariff.termFromDays}${NBSP}дн.`}</dd>
              </div>
            </dl>
          </li>
        );
      })}
    </ul>
  );
}

type SlopeTariffCardsProps = { tariffs: SlopeTariff[]; className?: string };

export function SlopeTariffCards({ tariffs, className = '' }: SlopeTariffCardsProps) {
  return (
    <ul className={`grid gap-4 lg:grid-cols-3 ${className}`}>
      {tariffs.map((tariff) => (
        <li
          key={tariff.id}
          className="flex h-full flex-col rounded-[var(--radius-md)] border border-border bg-surface p-6"
        >
          <p className="eyebrow text-fg-subtle">Тариф</p>
          <p className="display-md mt-1">{tariff.label}</p>
          <p className="tabular mt-4 font-display text-3xl font-black leading-none">
            {tariff.from ? <span className="text-lg font-bold text-fg-subtle">от </span> : null}
            {formatPrice(tariff.pricePerMeter)}
            <span className="text-base font-semibold text-fg-subtle">{`/п.${NBSP}м`}</span>
          </p>
          <p className="mt-1.5 text-xs text-fg-subtle">Погонный метр откоса</p>
          <p className="mt-4 inline-block self-start rounded-[var(--radius-xs)] bg-surface-2 px-2.5 py-1 text-xs font-semibold text-fg-muted">
            {tariff.scope}
          </p>
          <p className="eyebrow mt-5 text-fg-subtle">Состав работ</p>
          <ul className="mt-2 flex-1 space-y-1.5 text-sm">
            {tariff.includes.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-accent-ink" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-border pt-4 text-sm text-fg-muted">{tariff.note}</p>
        </li>
      ))}
    </ul>
  );
}

/** Два маршрута работ по откосам — семь шагов каждый, с листовки. */
export function SlopeStages({ className = '' }: { className?: string }) {
  const routes = [SLOPE_STAGES.plaster, SLOPE_STAGES.putty];
  return (
    <div className={`grid gap-6 lg:grid-cols-2 ${className}`}>
      {routes.map((route) => (
        <div key={route.title} className="rounded-[var(--radius-md)] border border-border bg-surface p-6">
          <p className="font-display text-lg font-extrabold leading-snug">{route.title}</p>
          <p className="mt-1 text-sm text-fg-subtle">Тарифы: {route.tariffs}</p>
          <ol className="mt-4 grid gap-2 sm:grid-cols-2">
            {route.steps.map((step, index) => (
              <li key={step} className="flex items-start gap-3 text-sm">
                <span className="tabular grid size-6 shrink-0 place-items-center rounded-full bg-accent font-display text-xs font-extrabold text-accent-fg">
                  {index + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

/** Цена строки прайса текстом: «от 1 500 ₽/м²», «по согласованию». */
export function extraPriceLabel(work: ExtraWork): string {
  if (work.price === null) return work.note ?? 'по согласованию';
  const unit = work.unit ? `/${work.unit}` : '';
  return `${work.from ? 'от ' : ''}${formatPrice(work.price)}${unit}`;
}

/** Подпись цены для карточки услуги: «от 700 ₽/м²», «от 900 ₽/п. м»; для «по смете» — undefined. */
export function servicePriceLabel(service: Pick<RemontService, 'pricing' | 'extraIds'>): string | undefined {
  if (service.pricing === 'walls') {
    return `от ${formatPrice(Math.min(...WALL_TARIFFS.map((tariff) => tariff.pricePerM2)))}/м²`;
  }
  if (service.pricing === 'slopes') {
    return `от ${formatPrice(Math.min(...SLOPE_TARIFFS.map((tariff) => tariff.pricePerMeter)))}/п.${NBSP}м`;
  }
  if (service.pricing === 'extras') {
    const first = EXTRA_WORKS.find((work) => service.extraIds?.includes(work.id) && work.price !== null);
    return first ? extraPriceLabel(first) : undefined;
  }
  return undefined;
}

type ExtraWorksTableProps = {
  works: ExtraWork[];
  /** Показать только эти строки (в порядке прайса). */
  ids?: string[];
  caption?: string;
  className?: string;
};

export function ExtraWorksTable({ works, ids, caption, className = '' }: ExtraWorksTableProps) {
  const rows = ids ? works.filter((work) => ids.includes(work.id)) : works;
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={caption ?? 'Дополнительные работы'}
      className={`overflow-x-auto rounded-[var(--radius-md)] border border-border ${className}`}
    >
      <table className="w-full border-collapse text-left text-[0.9375rem]">
        <caption className="sr-only">{caption ?? 'Дополнительные работы и их стоимость'}</caption>
        <thead>
          <tr className="border-b border-border bg-surface">
            <th scope="col" className="w-8 px-3 py-3 font-semibold text-fg-subtle">
              №
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Работа
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Цена
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((work, index) => (
            <tr key={work.id} className="border-b border-border last:border-b-0">
              <td className="tabular px-3 py-3 text-fg-subtle">{index + 1}</td>
              <td className="px-3 py-3 sm:px-4">
                <span className="font-semibold">{work.label}</span>
                {work.hint ? <span className="block text-sm text-fg-subtle">{work.hint}</span> : null}
              </td>
              <td className="tabular px-3 py-3 text-right font-semibold text-accent-ink sm:whitespace-nowrap sm:px-4 sm:text-left">
                {extraPriceLabel(work)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type TariffFactsTableProps = { tariffs: WallTariff[]; className?: string };

/** Сроки, объём и гарантия по тарифам — вместо таблицы «по норме выработки». */
export function TariffFactsTable({ tariffs, className = '' }: TariffFactsTableProps) {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Сроки, минимальный объём и гарантия по тарифам"
      className={`overflow-x-auto rounded-[var(--radius-md)] border border-border ${className}`}
    >
      <table className="w-full min-w-[34rem] border-collapse text-left text-[0.9375rem]">
        <caption className="sr-only">Сроки, минимальный объём и гарантия по тарифам</caption>
        <thead>
          <tr className="border-b border-border bg-surface">
            <th scope="col" className="px-4 py-3 font-semibold">
              Тариф
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Работы
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Цена за м²
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Мин. объём
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Сроки
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Гарантия
            </th>
          </tr>
        </thead>
        <tbody>
          {tariffs.map((tariff) => (
            <tr key={tariff.id} className="border-b border-border last:border-b-0">
              <th scope="row" className="px-4 py-3 text-left font-semibold">
                {tariff.label}
              </th>
              <td className="px-4 py-3 text-fg-muted">{tariff.scope}</td>
              <td className="tabular px-4 py-3 whitespace-nowrap">{formatPrice(tariff.pricePerM2)}</td>
              <td className="tabular px-4 py-3 whitespace-nowrap">{`${tariff.minArea}${NBSP}м²`}</td>
              <td className="tabular px-4 py-3 whitespace-nowrap">{`от ${tariff.termFromDays}${NBSP}дн.`}</td>
              <td className="tabular px-4 py-3 whitespace-nowrap">{guaranteeLabel(tariff.guaranteeMonths)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
