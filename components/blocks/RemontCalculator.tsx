'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowRight, Plus, Ruler, Trash2 } from 'lucide-react';
import {
  calcRemont,
  DOOR_AREA,
  formatArea,
  guaranteeLabel,
  roomWallArea,
  WINDOW_AREA,
  type Room,
  type TariffId,
} from '@/lib/calc/remont';
import { EXTRA_WORKS, REMONT_RATES, ROOM_PRESETS, SLOPE_TARIFFS, WALL_TARIFFS } from '@/content/remont/prices';
import { formatPrice } from '@/lib/plural';
import { Button } from '@/components/ui/Button';
import { Checkbox, Choice } from '@/components/ui/Field';
import { DraftMark } from '@/components/ui/Badge';
import { LeadForm } from './LeadForm';

type RemontCalculatorProps = {
  /** Телефон для запасного сценария в форме. */
  phone?: string | null;
  /** Тариф, отмеченный при открытии — например, на странице услуги. */
  initialTariff?: TariffId;
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

const CONTROL =
  'w-full min-w-0 rounded-[var(--radius-sm)] border border-border-strong bg-surface px-3 py-2.5 tabular transition-colors duration-150 focus:border-accent focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none';

const NBSP = ' ';

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

const DEMOLISH_PLASTER = EXTRA_WORKS.find((work) => work.id === 'demolish-plaster');
const REMOVE_WALLPAPER = EXTRA_WORKS.find((work) => work.id === 'remove-wallpaper');

/**
 * Калькулятор «Бриллиант Ремонт». Геометрия и деньги считаются в
 * lib/calc/remont.ts — теми же функциями, что покрыты тестами, по тарифам
 * владельца из content/remont/prices.ts. Здесь только ввод и вывод.
 */
export function RemontCalculator({
  phone,
  initialTariff = 'standard',
  className = '',
}: RemontCalculatorProps) {
  const uid = useId();
  const counter = useRef(0);
  const nextId = () => {
    counter.current += 1;
    return `${uid}-${counter.current}`;
  };

  const rootRef = useRef<HTMLDivElement>(null);
  // Признак гидрации для e2e: до неё клики по тарифам не меняют расчёт
  useEffect(() => {
    rootRef.current?.setAttribute('data-ready', 'true');
  }, []);

  const [rooms, setRooms] = useState<RoomDraft[]>(() => [
    draftFromPreset(ROOM_PRESETS[1], `${uid}-0`),
  ]);
  const [tariff, setTariff] = useState<TariffId>(initialTariff);
  const [demolishPlaster, setDemolishPlaster] = useState(false);
  const [removeWallpaper, setRemoveWallpaper] = useState(false);
  const [slopesMeters, setSlopesMeters] = useState('');
  const [slopesTariff, setSlopesTariff] = useState<TariffId>('standard');
  const [showForm, setShowForm] = useState(false);
  // После нажатия «Записаться» панель с результатом заменяется формой:
  // переводим фокус на неё, иначе он теряется вместе с нажатой кнопкой.
  const formPanelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (showForm) formPanelRef.current?.focus();
  }, [showForm]);

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

  const meters = Math.min(toNumber(slopesMeters), 500);

  const result = useMemo(
    () =>
      calcRemont(
        {
          rooms: rooms.map(toRoom),
          tariff,
          extras: { demolishPlaster, removeWallpaper, slopesMeters: meters, slopesTariff },
        },
        REMONT_RATES,
      ),
    [rooms, tariff, demolishPlaster, removeWallpaper, meters, slopesTariff],
  );

  const ready = result.wallArea > 0 || meters > 0;
  const draft = result.tariff.status === 'draft';

  const details = [
    'Расчёт на сайте:',
    ...rooms.map(
      (room) =>
        `${room.label}: ${room.length || '—'} × ${room.width || '—'} × ${room.height || '—'} м, ` +
        `окон ${room.windows || 0}, дверей ${room.doors || 0}`,
    ),
    `Площадь стен: ${formatArea(result.wallArea)} м²`,
    `Тариф: «${result.tariff.label}» (${result.tariff.scope}), ${result.tariff.pricePerM2} ₽/м²`,
    ...result.items.slice(1).map((item) => `${item.label}: ${item.detail}`),
    `Ориентир: ${formatPrice(result.total)}`,
    result.belowMinArea
      ? `Объём меньше минимального для тарифа (${result.tariff.minArea} м²)`
      : '',
  ]
    .filter(Boolean)
    .join('\n')
    .slice(0, 2000);

  return (
    <div
      ref={rootRef}
      className={`overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface ${className}`}
    >
      <div className="grid lg:grid-cols-[1.25fr_1fr]">
        <div className="p-5 md:p-8">
          {/* Шаг 1 — комнаты */}
          <fieldset>
            <legend className="eyebrow text-fg-subtle">1. Комнаты</legend>
            <p className="mt-2 text-sm text-fg-muted">
              Площадь стен считаем по периметру и высоте, за вычетом проёмов: окно{' '}
              {`${formatArea(WINDOW_AREA)}${NBSP}м²`}, дверь {`${formatArea(DOOR_AREA)}${NBSP}м²`}.
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
                    Стены:{' '}
                    <span className="tabular text-fg">{`${formatArea(roomArea(room))}${NBSP}м²`}</span>
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
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-[var(--radius-xs)] border border-border-strong bg-surface px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:border-accent hover:text-fg"
                >
                  <Plus className="size-3.5 shrink-0" aria-hidden="true" />
                  {preset.label}
                </button>
              ))}
              <button
                type="button"
                onClick={addCustom}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-[var(--radius-xs)] border border-dashed border-border-strong px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:border-accent hover:text-fg"
              >
                <Ruler className="size-3.5 shrink-0" aria-hidden="true" />
                Свои размеры
              </button>
            </div>
          </fieldset>

          {/* Шаг 2 — тариф */}
          <fieldset className="mt-8">
            <legend className="eyebrow text-fg-subtle">2. Тариф на стены</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {WALL_TARIFFS.map((item) => (
                <Choice
                  key={item.id}
                  name={`${uid}-tariff`}
                  value={item.id}
                  checked={item.id === tariff}
                  onChange={(value) => setTariff(value as TariffId)}
                >
                  <span className="block">
                    <span className="block">{item.label}</span>
                    <span className="tabular block text-sm text-fg-subtle">
                      {formatPrice(item.pricePerM2)}/м² · {item.scope.toLowerCase()}
                    </span>
                  </span>
                </Choice>
              ))}
            </div>
            <p className="mt-2 text-sm text-fg-subtle">
              Минимальный объём: «Базовый» — {`100${NBSP}м²`}, «Стандарт» — {`50${NBSP}м²`},
              «Премиум» — {`30${NBSP}м²`}.
            </p>
          </fieldset>

          {/* Шаг 3 — дополнительно */}
          <fieldset className="mt-8">
            <legend className="eyebrow text-fg-subtle">3. Дополнительно</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {DEMOLISH_PLASTER && DEMOLISH_PLASTER.price !== null ? (
                <div className="rounded-[var(--radius-sm)] border border-border bg-bg-deep px-4 py-3">
                  <Checkbox
                    id={`${uid}-demolish`}
                    checked={demolishPlaster}
                    onChange={() => setDemolishPlaster((prev) => !prev)}
                    label={
                      <span className="block">
                        <span className="block font-semibold text-fg">{DEMOLISH_PLASTER.label}</span>
                        <span className="tabular block text-sm text-fg-subtle">
                          {formatPrice(DEMOLISH_PLASTER.price)}/м² стен
                        </span>
                      </span>
                    }
                  />
                </div>
              ) : null}
              {REMOVE_WALLPAPER && REMOVE_WALLPAPER.price !== null ? (
                <div className="rounded-[var(--radius-sm)] border border-border bg-bg-deep px-4 py-3">
                  <Checkbox
                    id={`${uid}-wallpaper`}
                    checked={removeWallpaper}
                    onChange={() => setRemoveWallpaper((prev) => !prev)}
                    label={
                      <span className="block">
                        <span className="block font-semibold text-fg">{REMOVE_WALLPAPER.label}</span>
                        <span className="tabular block text-sm text-fg-subtle">
                          {formatPrice(REMOVE_WALLPAPER.price)}/м² стен
                        </span>
                      </span>
                    }
                  />
                </div>
              ) : null}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-[10rem_1fr] sm:items-end">
              <div>
                <label htmlFor={`${uid}-slopes`} className="mb-1 block text-xs text-fg-subtle">
                  Откосы, погонных метров
                </label>
                <input
                  id={`${uid}-slopes`}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={500}
                  step={0.5}
                  placeholder="0"
                  value={slopesMeters}
                  onChange={(event) => setSlopesMeters(event.target.value)}
                  className={CONTROL}
                />
              </div>
              {meters > 0 ? (
                <div className="grid gap-2 sm:grid-cols-3">
                  {SLOPE_TARIFFS.map((item) => (
                    <Choice
                      key={item.id}
                      name={`${uid}-slope-tariff`}
                      value={item.id}
                      checked={item.id === slopesTariff}
                      onChange={(value) => setSlopesTariff(value as TariffId)}
                    >
                      <span className="block">
                        <span className="block">{item.label}</span>
                        <span className="tabular block text-sm text-fg-subtle">
                          {item.from ? 'от ' : ''}
                          {formatPrice(item.pricePerMeter)}
                          {`/п.${NBSP}м`}
                        </span>
                      </span>
                    </Choice>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-fg-subtle">
                  Периметр проёма без низа: у окна и двери — две вертикали и верх.
                </p>
              )}
            </div>
          </fieldset>
        </div>

        {/* Результат */}
        <div
          ref={formPanelRef}
          tabIndex={-1}
          aria-live="polite"
          className="border-t border-border bg-bg-deep p-5 md:p-8 outline-none lg:border-l lg:border-t-0"
        >
          {showForm ? (
            <LeadForm
              site="remont"
              service={`Замер: тариф «${result.tariff.label}»`.slice(0, 120)}
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
                  <p className="display-md tabular mt-1 text-accent-ink" data-total>
                    {formatPrice(result.total)}
                  </p>
                  {draft ? <DraftMark className="ml-0" /> : null}

                  <ul className="mt-4 divide-y divide-border border-y border-border">
                    {result.items.map((item) => (
                      <li key={item.id} className="py-2.5">
                        <span className="flex items-baseline justify-between gap-3">
                          <span className="text-[0.9375rem]">{item.label}</span>
                          <span className="tabular shrink-0 text-[0.9375rem] font-semibold">
                            {formatPrice(item.price)}
                          </span>
                        </span>
                        <span className="tabular block text-xs text-fg-subtle">{item.detail}</span>
                      </li>
                    ))}
                  </ul>

                  {result.wallArea > 0 ? (
                    <p className="mt-4 text-[0.9375rem]">
                      Сроки — <strong className="tabular">{`от ${result.termFromDays}${NBSP}рабочих дней`}</strong>,
                      гарантия —{' '}
                      <strong className="tabular">{guaranteeLabel(result.guaranteeMonths)}</strong>
                      <span className="block text-sm text-fg-subtle">
                        точный срок записывается в договор после замера
                      </span>
                    </p>
                  ) : null}

                  {result.belowMinArea ? (
                    <p className="mt-4 rounded-[var(--radius-sm)] border border-border bg-surface px-4 py-3 text-sm text-fg-muted">
                      Минимальный объём тарифа «{result.tariff.label}» —{' '}
                      {`${result.tariff.minArea}${NBSP}м²`} стен.{' '}
                      {result.suggestedTariff
                        ? `Для ${formatArea(result.wallArea)}${NBSP}м² подойдёт тариф «${result.suggestedTariff.label}» — он доступен от ${result.suggestedTariff.minArea}${NBSP}м².`
                        : 'Для такого объёма посчитаем индивидуально на замере.'}
                    </p>
                  ) : null}

                  <Button size="lg" block className="mt-6" onClick={() => setShowForm(true)}>
                    Записаться на замер
                    <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                  </Button>
                </>
              ) : (
                <p className="mt-6 text-[0.9375rem] text-fg-muted">
                  Добавьте комнату с размерами и выберите тариф — покажем площадь стен, стоимость
                  по прайсу, срок и гарантию.
                </p>
              )}

              <p className="mt-5 border-t border-border pt-4 text-sm text-fg-subtle">
                Стоимость по тарифу фиксированная — за квадратный метр. Площадь на замере
                уточняем рулеткой, итог записываем в договор, и он не растёт, пока не меняется
                объём.
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
