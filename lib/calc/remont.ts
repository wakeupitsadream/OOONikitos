/**
 * Калькулятор «Бриллиант Ремонт».
 * Честная геометрия: площадь стен = периметр × высота − проёмы.
 * Деньги считаются по тарифам владельца: цена за м² стен фиксированная,
 * откосы — за погонный метр, демонтаж — за м² по прайсу доп. работ.
 * Чистые функции без DOM — те же формулы в браузере, тестах и смете.
 */

import type { PriceStatus } from '@/content/types';

export type TariffId = 'basic' | 'standard' | 'premium';

export type Room = {
  /** Длина и ширина комнаты в метрах. */
  length: number;
  width: number;
  height: number;
  /** Количество окон и дверей — вычитаются из площади стен. */
  windows: number;
  doors: number;
};

/** Площадь типового проёма, м². */
export const WINDOW_AREA = 1.8;
export const DOOR_AREA = 1.8;

/** Тариф на стены: цена за м² фиксированная, состав — по листовке владельца. */
export type WallTariff = {
  id: TariffId;
  label: string;
  /** Какие работы входят: «Штукатурка» или «Штукатурка + шпаклёвка». */
  scope: string;
  pricePerM2: number;
  tagline: string;
  description: string;
  /** Состав сверх тарифа inheritsFrom (или полный, если наследования нет). */
  includes: string[];
  inheritsFrom?: TariffId;
  /** Минимальный объём заказа, м² стен. */
  minArea: number;
  guaranteeMonths: number;
  /** «Сроки от N дней» с листовки — точный срок фиксируется в договоре. */
  termFromDays: number;
  popular?: boolean;
  status: PriceStatus;
};

/** Тариф на откосы окон и дверей: цена за погонный метр. */
export type SlopeTariff = {
  id: TariffId;
  label: string;
  scope: string;
  pricePerMeter: number;
  /** Цена «от» — итог зависит от состояния и ширины откоса. */
  from?: boolean;
  includes: string[];
  note: string;
  status: PriceStatus;
};

/** Дополнительная работа из прайса. price: null — «по согласованию». */
export type ExtraWork = {
  id: string;
  label: string;
  hint?: string;
  price: number | null;
  unit?: 'м²' | 'шт.' | 'сутки';
  from?: boolean;
  note?: string;
};

export type CalcRemontRates = {
  walls: WallTariff[];
  slopes: SlopeTariff[];
  extras: ExtraWork[];
};

export type CalcRemontInput = {
  rooms: Room[];
  tariff: TariffId;
  extras?: {
    /** Снять старую штукатурку перед работой (по площади стен). */
    demolishPlaster?: boolean;
    /** Снять старые обои (по площади стен). */
    removeWallpaper?: boolean;
    /** Откосы: погонные метры и тариф. */
    slopesMeters?: number;
    slopesTariff?: TariffId;
  };
};

export type CalcRemontItem = {
  id: string;
  label: string;
  /** Пояснение: «62,4 м² × 900 ₽». */
  detail: string;
  price: number;
};

export type CalcRemontResult = {
  /** Площадь стен под работы, м². */
  wallArea: number;
  tariff: WallTariff;
  /** Стоимость стен по тарифу, ₽. */
  wallsPrice: number;
  items: CalcRemontItem[];
  total: number;
  /** Площадь меньше минимального объёма выбранного тарифа. */
  belowMinArea: boolean;
  /** Самый доступный тариф, в который объём укладывается; null — ни один. */
  suggestedTariff: WallTariff | null;
  guaranteeMonths: number;
  termFromDays: number;
};

/** Площадь стен одной комнаты за вычетом проёмов, м². */
export function roomWallArea(room: Room): number {
  const perimeter = 2 * (Math.max(0, room.length) + Math.max(0, room.width));
  const gross = perimeter * Math.max(0, room.height);
  const openings = Math.max(0, room.windows) * WINDOW_AREA + Math.max(0, room.doors) * DOOR_AREA;
  return Math.max(0, gross - openings);
}

export function totalWallArea(rooms: Room[]): number {
  return rooms.reduce((sum, room) => sum + roomWallArea(room), 0);
}

/** Быстрая оценка площади стен по площади пола — когда размеры неизвестны. */
export function wallAreaFromFloor(floorArea: number, height = 2.7): number {
  if (floorArea <= 0) return 0;
  // Приближение для прямоугольной комнаты, близкой к квадрату
  const side = Math.sqrt(floorArea);
  const perimeter = 4 * side;
  return Math.max(0, perimeter * height - WINDOW_AREA - DOOR_AREA);
}

/** «62,4» — без Intl, чтобы разметка сервера и браузера совпадали до символа. */
export function formatArea(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return String(rounded).replace('.', ',');
}

function finite(value: number | undefined, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

/** «1 год», «1,5 года», «2 года» — гарантия тарифа человеческим языком. */
export function guaranteeLabel(months: number): string {
  if (!Number.isFinite(months) || months <= 0) return '—';
  if (months === 18) return '1,5 года';
  if (months % 12 === 0) {
    const years = months / 12;
    if (years === 1) return '1 год';
    return years < 5 ? `${years} года` : `${years} лет`;
  }
  return `${months} мес.`;
}

/** Тариф по id; неизвестный id (например, из старой ссылки) — популярный или первый. */
export function findTariff(tariffs: WallTariff[], id: TariffId | string): WallTariff {
  return (
    tariffs.find((tariff) => tariff.id === id) ??
    tariffs.find((tariff) => tariff.popular) ??
    tariffs[0]
  );
}

/** Полный состав тарифа с учётом наследования: Премиум = Базовый + Стандарт + своё. */
export function tariffIncludes(tariffs: WallTariff[], id: TariffId): string[] {
  const chain: string[] = [];
  let current: WallTariff | undefined = tariffs.find((tariff) => tariff.id === id);
  const seen = new Set<TariffId>();
  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    chain.unshift(...current.includes);
    current = current.inheritsFrom
      ? tariffs.find((tariff) => tariff.id === current?.inheritsFrom)
      : undefined;
  }
  return chain;
}

export function calcRemont(input: CalcRemontInput, rates: CalcRemontRates): CalcRemontResult {
  const wallArea = Math.round(totalWallArea(input.rooms) * 10) / 10;
  const tariff = findTariff(rates.walls, input.tariff);

  const items: CalcRemontItem[] = [];
  const wallsPrice = Math.round(wallArea * tariff.pricePerM2);
  if (wallArea > 0) {
    items.push({
      id: `walls-${tariff.id}`,
      label: `${tariff.scope} — тариф «${tariff.label}»`,
      detail: `${formatArea(wallArea)} м² × ${tariff.pricePerM2} ₽`,
      price: wallsPrice,
    });
  }

  const extras = input.extras ?? {};
  const perM2 = (id: string) => {
    const work = rates.extras.find((item) => item.id === id);
    return work && work.price !== null && work.unit === 'м²' ? work.price : 0;
  };

  if (extras.demolishPlaster && wallArea > 0) {
    const rate = perM2('demolish-plaster');
    if (rate > 0) {
      items.push({
        id: 'demolish-plaster',
        label: 'Демонтаж старой штукатурки',
        detail: `${formatArea(wallArea)} м² × ${rate} ₽`,
        price: Math.round(wallArea * rate),
      });
    }
  }

  if (extras.removeWallpaper && wallArea > 0) {
    const rate = perM2('remove-wallpaper');
    if (rate > 0) {
      items.push({
        id: 'remove-wallpaper',
        label: 'Демонтаж обоев',
        detail: `${formatArea(wallArea)} м² × ${rate} ₽`,
        price: Math.round(wallArea * rate),
      });
    }
  }

  const meters = Math.max(0, finite(extras.slopesMeters));
  if (meters > 0) {
    const slope =
      rates.slopes.find((item) => item.id === (extras.slopesTariff ?? 'standard')) ??
      rates.slopes[0];
    if (slope) {
      items.push({
        id: `slopes-${slope.id}`,
        label: `Откосы — тариф «${slope.label}»`,
        detail: `${formatArea(meters)} п. м × ${slope.pricePerMeter} ₽${slope.from ? ' (от)' : ''}`,
        price: Math.round(meters * slope.pricePerMeter),
      });
    }
  }

  const total = items.reduce((sum, item) => sum + item.price, 0);
  const belowMinArea = wallArea > 0 && wallArea < tariff.minArea;
  const suggestedTariff = belowMinArea
    ? [...rates.walls]
        .sort((a, b) => a.pricePerM2 - b.pricePerM2)
        .find((candidate) => wallArea >= candidate.minArea) ?? null
    : null;

  return {
    wallArea,
    tariff,
    wallsPrice,
    items,
    total,
    belowMinArea,
    suggestedTariff,
    guaranteeMonths: tariff.guaranteeMonths,
    termFromDays: tariff.termFromDays,
  };
}
