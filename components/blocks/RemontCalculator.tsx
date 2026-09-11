'use client';

import { useId, useMemo, useRef, useState } from 'react';
import { ArrowRight, Plus, Ruler, Trash2 } from 'lucide-react';
import {
  calcRemont,
  DOOR_AREA,
  roomWallArea,
  WINDOW_AREA,
  type Room,
  type WorkId,
} from '@/lib/calc/remont';
import { MIN_ORDER, PRICE_STATUS, ROOM_PRESETS, WORK_RATES } from '@/content/remont/prices';
import { formatPrice, pluralize } from '@/lib/plural';
import { Button } from '@/components/ui/Button';
import { Checkbox, Choice } from '@/components/ui/Field';
import { DraftMark } from '@/components/ui/Badge';
import { LeadForm } from './LeadForm';

type RemontCalculatorProps = {
  /** Телефон для запасного сценария в форме. */
  phone?: string | null;
  /** Работы, отмеченные при открытии — например, на странице услуги. */
  initialWorks?: WorkId[];
  className?: string;
};

/** Поля храним строками: иначе при стирании цифры поле «прыгает» в 0. */
type RoomDraft = {
  id: string;
  label: string;
  length: string;
  width: string;
  height: string;
  windows: string;
  doors: string;
};

const CONDITIONS: { id: 'new' | 'normal' | 'bad'; label: string; hint: string }[] = [
  { id: 'new', label: 'Новостройка', hint: 'Голые стены, ровная геометрия' },
  { id: 'normal', label: 'Обычное', hint: 'Жилая квартира, старая отделка снимается' },
  { id: 'bad', label: 'Сложное', hint: 'Завалы, перепады, осыпающееся основание' },
];

const CONTROL =
  'w-full min-w-0 rounded-[var(--radius-sm)] border border-border-strong bg-surface px-3 py-2.5 tabular transition-colors duration-150 focus:border-accent focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none';

/** «43,2» — без Intl, чтобы разметка сервера и браузера совпадали до символа. */
function formatArea(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return String(rounded).replace('.', ',');
}

function toNumber(value: string): number {
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function toRoom(draft: RoomDraft): Room {
  return {
    length: toNumber(draft.length),
    width: toNumber(draft.width),
    height: toNumber(draft.height),
    windows: Math.round(toNumber(draft.windows)),
    doors: Math.round(toNumber(draft.doors)),
  };
}

function draftFromPreset(preset: (typeof ROOM_PRESETS)[number], uid: string): RoomDraft {
  return {
    id: uid,
    label: preset.label,
    length: String(preset.length),
    width: String(preset.width),
    height: String(preset.height),
    windows: String(preset.windows),
    doors: String(preset.doors),
  };
}

/**
 * Калькулятор стен. Геометрия и деньги считаются в lib/calc/remont.ts —
 * теми же функциями, что покрыты тестами. Здесь только ввод и вывод.
 */
export function RemontCalculator({
  phone,
  initialWorks = ['shtukaturka'],
  className = '',
}: RemontCalculatorProps) {
  const uid = useId();
  const counter = useRef(0);
  const nextId = () => {
    counter.current += 1;
    return `${uid}-${counter.current}`;
  };

  const [rooms, setRooms] = useState<RoomDraft[]>(() => [
    draftFromPreset(ROOM_PRESETS[1], `${uid}-0`),
  ]);
  const [works, setWorks] = useState<WorkId[]>(initialWorks);
  const [condition, setCondition] = useState<'new' | 'normal' | 'bad'>('normal');
  const [showForm, setShowForm] = useState(false);

  const addPreset = (preset: (typeof ROOM_PRESETS)[number]) => {
    setRooms((prev) => [...prev, draftFromPreset(preset, nextId())]);
  };

  const addCustom = () => {
    setRooms((prev) => [
      ...prev,
      {
        id: nextId(),
        label: 'Своя комната',
        length: '',
        width: '',
        height: '2.7',
        windows: '1',
        doors: '1',
      },
    ]);
  };

  const updateRoom = (id: string, field: keyof Omit<RoomDraft, 'id' | 'label'>, value: string) => {
    setRooms((prev) => prev.map((room) => (room.id === id ? { ...room, [field]: value } : room)));
  };

  const removeRoom = (id: string) => {
    setRooms((prev) => prev.filter((room) => room.id !== id));
  };

  const toggleWork = (id: WorkId) => {
    setWorks((prev) => (prev.includes(id) ? prev.filter((work) => work !== id) : [...prev, id]));
  };

  const result = useMemo(
    () =>
      calcRemont(
        { rooms: rooms.map(toRoom), works, condition, minOrder: MIN_ORDER },
        WORK_RATES,
      ),
    [rooms, works, condition],
  );

  const draft = PRICE_STATUS === 'draft' || result.items.some((item) => item.status === 'draft');
  const ready = result.wallArea > 0 && result.items.length > 0;
  const conditionLabel = CONDITIONS.find((item) => item.id === condition)?.label ?? '';

  const workNames = result.items.map((item) => item.label).join(', ');
  const details = [
    'Расчёт стен на сайте:',
    ...rooms.map(
      (room) =>
        `${room.label}: ${room.length || '—'} × ${room.width || '—'} × ${room.height || '—'} м, ` +
        `окон ${room.windows || 0}, дверей ${room.doors || 0}`,
    ),
    `Площадь стен: ${formatArea(result.wallArea)} м²`,
    `Работы: ${workNames || 'не выбраны'}`,
    `Состояние стен: ${conditionLabel}`,
    `Ориентир: ${formatPrice(result.priceFrom)} — ${formatPrice(result.priceTo)}`,
    `Срок: ${pluralize(result.workDays, 'рабочий день', 'рабочих дня', 'рабочих дней')}`,
    draft ? 'Расценки черновые, точная смета — после замера.' : '',
  ]
    .filter(Boolean)
    .join('\n')
    .slice(0, 2000);

  return (
    <div
      className={`overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface ${className}`}
    >
      <div className="grid lg:grid-cols-[1.25fr_1fr]">
        <div className="p-5 md:p-8">
          {/* Шаг 1 — комнаты */}
          <fieldset>
            <legend className="eyebrow text-fg-subtle">1. Комнаты</legend>
            <p className="mt-2 text-sm text-fg-muted">
              Площадь стен считаем по периметру и высоте, за вычетом проёмов: окно{' '}
              {formatArea(WINDOW_AREA)} м², дверь {formatArea(DOOR_AREA)} м².
            </p>

            <div className="mt-4 space-y-3">
              {rooms.map((room, index) => (
                <div
                  key={room.id}
                  className="rounded-[var(--radius-sm)] border border-border bg-bg-deep p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-display text-[0.9375rem] font-extrabold leading-snug">
                      {room.label}
                    </p>
                    {rooms.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeRoom(room.id)}
                        className="-mr-1 -mt-1 grid size-9 shrink-0 place-items-center rounded-[var(--radius-xs)] text-fg-subtle transition-colors hover:text-accent-ink"
                        aria-label={`Убрать: ${room.label} (${index + 1})`}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    ) : null}
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {(
                      [
                        { field: 'length' as const, label: 'Длина, м' },
                        { field: 'width' as const, label: 'Ширина, м' },
                        { field: 'height' as const, label: 'Высота, м' },
                      ]
                    ).map(({ field, label }) => (
                      <div key={field} className="min-w-0">
                        <label
                          htmlFor={`${room.id}-${field}`}
                          className="mb-1 block text-xs text-fg-subtle"
                        >
                          {label}
                        </label>
                        <input
                          id={`${room.id}-${field}`}
                          type="number"
                          inputMode="decimal"
                          min={0}
                          max={30}
                          step={0.1}
                          value={room[field]}
                          onChange={(event) => updateRoom(room.id, field, event.target.value)}
                          className={CONTROL}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {(
                      [
                        { field: 'windows' as const, label: 'Окон' },
                        { field: 'doors' as const, label: 'Дверей' },
                      ]
                    ).map(({ field, label }) => (
                      <div key={field} className="min-w-0">
                        <label
                          htmlFor={`${room.id}-${field}`}
                          className="mb-1 block text-xs text-fg-subtle"
                        >
                          {label}
                        </label>
                        <input
                          id={`${room.id}-${field}`}
                          type="number"
                          inputMode="numeric"
                          min={0}
                          max={20}
                          step={1}
                          value={room[field]}
                          onChange={(event) => updateRoom(room.id, field, event.target.value)}
                          className={CONTROL}
                        />
                      </div>
                    ))}
                  </div>

                  <p className="mt-3 text-sm text-fg-subtle">
                    Стены: <span className="tabular text-fg">{formatArea(roomArea(room))} м²</span>
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {ROOM_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => addPreset(preset)}
                  className="inline-flex items-center gap-1.5 rounded-[var(--radius-xs)] border border-border-strong bg-surface px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:border-accent hover:text-fg"
                >
                  <Plus className="size-3.5 shrink-0" aria-hidden="true" />
                  {preset.label}
                </button>
              ))}
              <button
                type="button"
                onClick={addCustom}
                className="inline-flex items-center gap-1.5 rounded-[var(--radius-xs)] border border-dashed border-border-strong px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:border-accent hover:text-fg"
              >
                <Ruler className="size-3.5 shrink-0" aria-hidden="true" />
                Свои размеры
              </button>
            </div>
          </fieldset>

          {/* Шаг 2 — работы */}
          <fieldset className="mt-8">
            <legend className="eyebrow text-fg-subtle">2. Что делаем со стенами</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {WORK_RATES.map((rate) => (
                <div
                  key={rate.id}
                  className="rounded-[var(--radius-sm)] border border-border bg-bg-deep px-4 py-3"
                >
                  <Checkbox
                    id={`${uid}-work-${rate.id}`}
                    checked={works.includes(rate.id)}
                    onChange={() => toggleWork(rate.id)}
                    label={
                      <span className="block">
                        <span className="block font-semibold text-fg">{rate.label}</span>
                        <span className="tabular block text-sm text-fg-subtle">
                          {formatPrice(rate.pricePerM2)} / м²
                          {rate.status === 'draft' ? <DraftMark /> : null}
                        </span>
                      </span>
                    }
                  />
                </div>
              ))}
            </div>
          </fieldset>

          {/* Шаг 3 — состояние */}
          <fieldset className="mt-8">
            <legend className="eyebrow text-fg-subtle">3. Состояние стен</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {CONDITIONS.map((item) => (
                <Choice
                  key={item.id}
                  name={`${uid}-condition`}
                  value={item.id}
                  checked={item.id === condition}
                  onChange={(value) => setCondition(value as typeof condition)}
                >
                  <span className="block">
                    <span className="block">{item.label}</span>
                    <span className="block text-sm text-fg-subtle">{item.hint}</span>
                  </span>
                </Choice>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Результат */}
        <div className="border-t border-border bg-bg-deep p-5 md:p-8 lg:border-l lg:border-t-0">
          {showForm ? (
            <LeadForm
              site="remont"
              service={`Замер стен: ${workNames}`.slice(0, 120)}
              details={details}
              fallbackPhone={phone}
              title="Записаться на замер"
              lead="Приедем, измерим и посчитаем точно. Замер бесплатный и ни к чему не обязывает."
              submitLabel="Записаться на замер"
              className="border-0 bg-transparent p-0"
            />
          ) : (
            <>
              <p className="eyebrow text-fg-subtle">Площадь стен</p>
              <p className="display-lg tabular mt-1">
                {formatArea(result.wallArea)}
                <span className="ml-1 text-lg font-semibold text-fg-subtle">м²</span>
              </p>

              {ready ? (
                <>
                  <p className="eyebrow mt-6 text-fg-subtle">Ориентир по стоимости</p>
                  <p className="display-md tabular mt-1 text-accent-ink">
                    {formatPrice(result.priceFrom)} — {formatPrice(result.priceTo)}
                  </p>
                  {draft ? <DraftMark className="ml-0" /> : null}

                  <p className="mt-5 text-[0.9375rem]">
                    Срок работ:{' '}
                    <strong className="tabular">
                      {pluralize(result.workDays, 'рабочий день', 'рабочих дня', 'рабочих дней')}
                    </strong>
                    <span className="block text-sm text-fg-subtle">
                      с технологическими паузами на сушку — их нельзя сокращать
                    </span>
                  </p>

                  <p className="eyebrow mt-6 text-fg-subtle">Раскладка по работам</p>
                  <ul className="mt-2 divide-y divide-border border-y border-border">
                    {result.items.map((item) => (
                      <li key={item.id} className="flex items-baseline justify-between gap-3 py-2.5">
                        <span className="text-[0.9375rem]">{item.label}</span>
                        <span className="tabular shrink-0 text-[0.9375rem] font-semibold">
                          {formatPrice(item.price)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {result.minOrderApplied ? (
                    <p className="mt-4 text-sm text-fg-muted">
                      Учтён минимальный заказ {formatPrice(MIN_ORDER)}: на маленьком объёме бригада
                      всё равно выезжает, закупает материал и тратит день.
                    </p>
                  ) : null}

                  <Button size="lg" block className="mt-6" onClick={() => setShowForm(true)}>
                    Записаться на замер
                    <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                  </Button>
                </>
              ) : (
                <p className="mt-6 text-[0.9375rem] text-fg-muted">
                  Добавьте комнату с размерами и отметьте работы — покажем площадь стен, вилку
                  стоимости и срок.
                </p>
              )}

              <p className="mt-5 border-t border-border pt-4 text-sm text-fg-subtle">
                Это ориентир по геометрии и составу работ. Точная смета — после замера, она
                фиксируется в договоре и не растёт, пока не меняется объём.
                {draft
                  ? ' Расценки пока черновые: прайс владельца заменит их одним файлом.'
                  : ''}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** Площадь стен одной комнаты — той же формулой, что и весь расчёт. */
function roomArea(draft: RoomDraft): number {
  return roomWallArea(toRoom(draft));
}
