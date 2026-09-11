'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, FileCheck, PiggyBank, Repeat } from 'lucide-react';
import { calcB2b } from '@/lib/calc/b2b';
import { B2B_OBJECTS, B2B_RATES } from '@/content/dezgarant/prices';
import { formatPrice, pluralize } from '@/lib/plural';
import { Button } from '@/components/ui/Button';
import { Choice } from '@/components/ui/Field';
import { DraftMark } from '@/components/ui/Badge';
import { LeadForm } from './LeadForm';

type B2bCalculatorProps = {
  phone?: string | null;
  className?: string;
};

/**
 * Публичных абонентских тарифов в Оренбурге нет ни у одной службы —
 * поэтому калькулятор показывает и цену, и норму, на которой она основана.
 */
export function B2bCalculator({ phone, className = '' }: B2bCalculatorProps) {
  const [objectId, setObjectId] = useState(B2B_OBJECTS[0].id);
  const [area, setArea] = useState('120');
  const [showForm, setShowForm] = useState(false);

  const object = B2B_OBJECTS.find((item) => item.id === objectId) ?? B2B_OBJECTS[0];

  const result = useMemo(
    () => calcB2b({ object, area: Number(area) || 0 }, B2B_RATES),
    [object, area],
  );

  const details = [
    `Расчёт обслуживания: ${object.label}`,
    `Площадь: ${area} м²`,
    `Частота: ${pluralize(result.visitsPerMonth, 'визит', 'визита', 'визитов')} в месяц`,
    `Ориентир: ${formatPrice(result.perMonth)} в месяц`,
    `Норма: ${object.norm}`,
  ].join('\n');

  return (
    <div
      className={`overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface ${className}`}
    >
      <div className="grid lg:grid-cols-[1.2fr_1fr]">
        <div className="p-6 md:p-8">
          <fieldset>
            <legend className="eyebrow text-fg-subtle">Тип объекта</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {B2B_OBJECTS.map((item) => (
                <Choice
                  key={item.id}
                  name="b2b-object"
                  value={item.id}
                  checked={item.id === objectId}
                  onChange={(value) => setObjectId(value as typeof objectId)}
                >
                  {item.label}
                </Choice>
              ))}
            </div>
          </fieldset>

          <div className="mt-6">
            <label htmlFor="b2b-area" className="eyebrow block text-fg-subtle">
              Площадь объекта, м²
            </label>
            <input
              id="b2b-area"
              type="number"
              inputMode="numeric"
              min={10}
              max={20000}
              value={area}
              onChange={(event) => setArea(event.target.value)}
              className="mt-2 w-40 rounded-[var(--radius-sm)] border border-border-strong bg-surface px-4 py-3 tabular focus:border-accent focus:outline-none"
            />
          </div>

          <div className="mt-6 rounded-[var(--radius-sm)] border-l-2 border-accent bg-surface-2 px-4 py-3">
            <p className="text-sm font-semibold">На чём основана частота</p>
            <p className="mt-1 text-sm text-fg-muted">{object.norm}</p>
          </div>
        </div>

        <div className="border-t border-border bg-bg-deep p-6 md:p-8 lg:border-l lg:border-t-0">
          {showForm ? (
            <LeadForm
              site="dezgarant"
              service={`Договор на обслуживание — ${object.label}`}
              details={details}
              fallbackPhone={phone}
              title="Запросить договор"
              lead="Пришлём проект договора и график обработок под ваш объект."
              submitLabel="Запросить договор"
              className="border-0 bg-transparent p-0"
            />
          ) : (
            <>
              <p className="eyebrow text-fg-subtle">Абонентское обслуживание</p>
              <p className="display-lg mt-2 tabular">
                {formatPrice(result.perMonth)}
                <span className="text-lg font-semibold text-fg-subtle"> / мес</span>
              </p>
              {result.status === 'draft' ? <DraftMark /> : null}

              <ul className="mt-6 space-y-3 text-[0.9375rem]">
                <li className="flex items-start gap-3">
                  <Repeat className="mt-0.5 size-5 shrink-0 text-accent-ink" aria-hidden="true" />
                  <span>
                    {pluralize(result.visitsPerMonth, 'визит', 'визита', 'визитов')} в месяц,{' '}
                    {formatPrice(result.perVisit)} за выезд
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <PiggyBank className="mt-0.5 size-5 shrink-0 text-accent-ink" aria-hidden="true" />
                  <span>
                    Экономия против разовых выездов — около{' '}
                    <strong>{formatPrice(result.savedVsOneOff)}</strong> в год
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <FileCheck className="mt-0.5 size-5 shrink-0 text-accent-ink" aria-hidden="true" />
                  <span>Договор, акты и журнал учёта входят в стоимость</span>
                </li>
              </ul>

              <Button size="lg" block className="mt-6" onClick={() => setShowForm(true)}>
                Запросить договор
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>

              <p className="mt-4 text-sm text-fg-subtle">
                Ориентир по типовому объекту. Точную стоимость называем после обследования: она
                зависит от планировки, состояния объекта и фактической заселённости.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
