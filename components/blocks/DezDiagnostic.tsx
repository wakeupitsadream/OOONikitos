'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Clock, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import {
  calcDezgarant,
  nextVisitLabel,
  visitSlots,
  type CalcInput,
  type Method,
  type ObjectId,
  type ProblemId,
} from '@/lib/calc/dezgarant';
import { DEZGARANT_RATES, PRICE_STATUS } from '@/content/dezgarant/prices';
import { formatPrice, plural, pluralize } from '@/lib/plural';
import { Button } from '@/components/ui/Button';
import { Choice } from '@/components/ui/Field';
import { DraftMark } from '@/components/ui/Badge';
import { LeadForm } from './LeadForm';

type Problem = { id: ProblemId; label: string };
type ObjectOption = { id: ObjectId; label: string; needsAmount?: 'm2' | 'sotka' };

const PROBLEMS: Problem[] = [
  { id: 'tarakany', label: 'Тараканы' },
  { id: 'klopy', label: 'Клопы' },
  { id: 'muravyi', label: 'Муравьи' },
  { id: 'gryzuny', label: 'Мыши и крысы' },
  { id: 'osy', label: 'Осы и шершни' },
  { id: 'kleshchi', label: 'Клещи на участке' },
  { id: 'plesen', label: 'Плесень и грибок' },
  { id: 'dezinfekciya', label: 'Дезинфекция' },
  { id: 'zapahi', label: 'Запах' },
];

const OBJECTS: ObjectOption[] = [
  { id: 'flat-1', label: '1-комнатная квартира' },
  { id: 'flat-2', label: '2-комнатная квартира' },
  { id: 'flat-3', label: '3-комнатная квартира' },
  { id: 'flat-4', label: '4-комнатная и больше' },
  { id: 'house', label: 'Частный дом', needsAmount: 'm2' },
  { id: 'office', label: 'Офис', needsAmount: 'm2' },
  { id: 'cafe', label: 'Кафе, магазин', needsAmount: 'm2' },
  { id: 'warehouse', label: 'Склад, производство', needsAmount: 'm2' },
  { id: 'plot', label: 'Участок', needsAmount: 'sotka' },
];

/** Услуги, которые считаются только по участку. */
const PLOT_ONLY: ProblemId[] = ['kleshchi'];

type DezDiagnosticProps = {
  /** Предвыбранная проблема — со страницы услуги. */
  initialProblem?: ProblemId;
  phone?: string | null;
  className?: string;
};

export function DezDiagnostic({ initialProblem, phone, className = '' }: DezDiagnosticProps) {
  const [problem, setProblem] = useState<ProblemId>(initialProblem ?? 'tarakany');
  const [object, setObject] = useState<ObjectId>(
    initialProblem && PLOT_ONLY.includes(initialProblem) ? 'plot' : 'flat-2',
  );
  const [amount, setAmount] = useState('60');
  const [method, setMethod] = useState<Method>('cold');
  const [slot, setSlot] = useState('any');
  const [showForm, setShowForm] = useState(false);

  const objectOptions = useMemo(
    () => (PLOT_ONLY.includes(problem) ? OBJECTS.filter((item) => item.id === 'plot') : OBJECTS),
    [problem],
  );

  const activeObject = objectOptions.find((item) => item.id === object) ?? objectOptions[0];
  const needsAmount = activeObject?.needsAmount;

  const result = useMemo(() => {
    const input: CalcInput = {
      problem,
      object: activeObject?.id ?? 'flat-2',
      amount: needsAmount ? Number(amount) || 0 : undefined,
      method,
    };
    return calcDezgarant(input, DEZGARANT_RATES);
  }, [problem, activeObject?.id, needsAmount, amount, method]);

  // Время берём один раз при рендере на клиенте: расчёт детерминирован,
  // случайности в данных нет — картинка воспроизводима.
  const slots = useMemo(() => visitSlots(new Date()), []);
  const soonest = useMemo(() => nextVisitLabel(new Date()), []);

  const problemLabel = PROBLEMS.find((item) => item.id === problem)?.label ?? '';
  const objectLabel = activeObject?.label ?? '';

  const details = [
    `Расчёт с сайта: ${problemLabel}, ${objectLabel}`,
    needsAmount
      ? `${needsAmount === 'sotka' ? 'Площадь участка' : 'Площадь'}: ${amount} ${needsAmount === 'sotka' ? 'соток' : 'м²'}`
      : '',
    `Метод: ${method === 'hot' ? 'горячий туман' : 'холодный туман'}`,
    `Ориентир: ${formatPrice(result.priceFrom)} — ${formatPrice(result.priceTo)}`,
    result.visits > 1 ? `Курс: ${pluralize(result.visits, 'обработка', 'обработки', 'обработок')} + контрольный визит` : '',
    `Желаемое время: ${slots.find((item) => item.id === slot)?.label ?? 'любое'}`,
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <div
      className={`overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface ${className}`}
    >
      <div className="grid lg:grid-cols-[1.25fr_1fr]">
        {/* Шаги */}
        <div className="p-6 md:p-8">
          <fieldset>
            <legend className="eyebrow text-fg-subtle">Шаг 1 — что беспокоит</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {PROBLEMS.map((item) => {
                const active = item.id === problem;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setProblem(item.id);
                      if (PLOT_ONLY.includes(item.id)) setObject('plot');
                      else if (object === 'plot') setObject('flat-2');
                    }}
                    className={`rounded-[var(--radius-sm)] border px-4 py-2.5 text-[0.9375rem] font-semibold transition-colors duration-150 ${
                      active
                        ? 'border-accent bg-accent text-accent-fg'
                        : 'border-border-strong text-fg-muted hover:border-accent hover:text-fg'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="mt-7">
            <legend className="eyebrow text-fg-subtle">Шаг 2 — объект</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {objectOptions.map((item) => (
                <Choice
                  key={item.id}
                  name="dez-object"
                  value={item.id}
                  checked={item.id === activeObject?.id}
                  onChange={(value) => setObject(value as ObjectId)}
                >
                  {item.label}
                </Choice>
              ))}
            </div>
          </fieldset>

          {needsAmount ? (
            <div className="mt-6">
              <label htmlFor="dez-amount" className="eyebrow block text-fg-subtle">
                {needsAmount === 'sotka' ? 'Шаг 3 — площадь участка, соток' : 'Шаг 3 — площадь, м²'}
              </label>
              <input
                id="dez-amount"
                type="number"
                inputMode="numeric"
                min={1}
                max={needsAmount === 'sotka' ? 200 : 5000}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="mt-2 w-40 rounded-[var(--radius-sm)] border border-border-strong bg-surface px-4 py-3 tabular focus:border-accent focus:outline-none"
              />
            </div>
          ) : null}

          <fieldset className="mt-6">
            <legend className="eyebrow text-fg-subtle">Метод обработки</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <Choice
                name="dez-method"
                value="cold"
                checked={method === 'cold'}
                onChange={() => setMethod('cold')}
              >
                Холодный туман
              </Choice>
              <Choice
                name="dez-method"
                value="hot"
                checked={method === 'hot'}
                onChange={() => setMethod('hot')}
              >
                Горячий туман
              </Choice>
            </div>
            <p className="mt-2 text-sm text-fg-subtle">
              Барьерная защита входит в стоимость обоих методов. Горячий туман глубже проникает
              в щели — берут при сильном заражении.
            </p>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="eyebrow text-fg-subtle">Когда удобно</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {slots.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={slot === item.id}
                  onClick={() => setSlot(item.id)}
                  className={`rounded-[var(--radius-sm)] border px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                    slot === item.id
                      ? 'border-accent bg-accent/10 text-fg'
                      : 'border-border-strong text-fg-muted hover:border-accent'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Результат */}
        <div className="border-t border-border bg-bg-deep p-6 md:p-8 lg:border-l lg:border-t-0">
          {showForm ? (
            <LeadForm
              site="dezgarant"
              service={`${problemLabel} — ${objectLabel}`}
              details={details}
              fallbackPhone={phone}
              title="Записаться на этот расчёт"
              lead="Приедем, уточним объём на месте и зафиксируем цену в договоре."
              submitLabel="Записаться"
              className="border-0 bg-transparent p-0"
            />
          ) : (
            <>
              <p className="eyebrow text-fg-subtle">Ориентир по вашему случаю</p>
              <p className="display-lg mt-2 tabular">
                {formatPrice(result.priceFrom)}
                <span className="text-fg-subtle"> — </span>
                {formatPrice(result.priceTo)}
              </p>
              {PRICE_STATUS === 'draft' ? <DraftMark /> : null}

              <ul className="mt-6 space-y-3 text-[0.9375rem]">
                {result.visits > 1 ? (
                  <li className="flex items-start gap-3">
                    <RotateCcw className="mt-0.5 size-5 shrink-0 text-accent-ink" aria-hidden="true" />
                    <span>
                      <strong>
                        {pluralize(result.visits, 'обработка', 'обработки', 'обработок')}
                      </strong>{' '}
                      и контрольный визит — всё уже в цене. Одна обработка клопов не берёт яйца.
                    </span>
                  </li>
                ) : null}
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 size-5 shrink-0 text-accent-ink" aria-hidden="true" />
                  <span>
                    Работа на объекте — около {result.durationMin} минут. Вернуться в помещение
                    можно через {result.returnAfterHours}{' '}
                    {plural(result.returnAfterHours, 'час', 'часа', 'часов')}.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-accent-ink" aria-hidden="true" />
                  <span>
                    Гарантия{' '}
                    <strong>
                      {pluralize(result.guaranteeDays, 'день', 'дня', 'дней')}
                    </strong>{' '}
                    — если вредители вернутся, приедем повторно бесплатно.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Truck className="mt-0.5 size-5 shrink-0 text-accent-ink" aria-hidden="true" />
                  <span>
                    Ближайший выезд — <strong>{soonest}</strong>.
                  </span>
                </li>
              </ul>

              <details className="mt-6 border-t border-border pt-4">
                <summary className="cursor-pointer text-sm font-semibold text-fg-muted">
                  Из чего складывается цена
                </summary>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {result.breakdown.map((row) => (
                    <li key={row.label} className="flex justify-between gap-4">
                      <span className="text-fg-muted">{row.label}</span>
                      <span className="tabular font-semibold">{formatPrice(row.value)}</span>
                    </li>
                  ))}
                </ul>
              </details>

              <Button size="lg" block className="mt-6" onClick={() => setShowForm(true)}>
                Записаться на этот расчёт
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>

              <p className="mt-4 text-sm text-fg-subtle">
                Это ориентир по типовому объекту. Точную цену называем на осмотре и фиксируем
                в договоре — доплат «за степень заражения» не будет.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
