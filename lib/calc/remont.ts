/**
 * Калькулятор стен «Бриллиант Ремонт».
 * Честная геометрия: площадь стен = периметр × высота − проёмы.
 * Чистые функции без DOM — те же формулы в браузере, тестах и смете.
 */

export type WorkId = 'shtukaturka' | 'shpaklevka' | 'pokraska' | 'oboi';

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

export type WorkRate = {
  id: WorkId;
  label: string;
  /** Цена за м² стен, ₽. */
  pricePerM2: number;
  /** Сколько м² бригада делает за рабочий день. */
  m2PerDay: number;
  /** Технологическая пауза после этапа, дней (сушка). */
  dryingDays: number;
  status: 'confirmed' | 'draft';
};

export type CalcRemontInput = {
  rooms: Room[];
  works: WorkId[];
  /** Состояние поверхности: чем хуже, тем выше коэффициент. */
  condition: 'new' | 'normal' | 'bad';
  /** Минимальная сумма заказа, ₽. */
  minOrder?: number;
};

export type CalcRemontResult = {
  /** Площадь стен под работы, м². */
  wallArea: number;
  priceFrom: number;
  priceTo: number;
  /** Срок в рабочих днях с учётом технологических пауз. */
  workDays: number;
  /** Раскладка по работам. */
  items: { id: WorkId; label: string; area: number; price: number; status: 'confirmed' | 'draft' }[];
  /** Сработал ли минимальный заказ. */
  minOrderApplied: boolean;
};

/** Коэффициент состояния поверхности. */
const CONDITION_FACTOR: Record<CalcRemontInput['condition'], number> = {
  new: 1,
  normal: 1.08,
  bad: 1.2,
};

/** Во сколько раз верхняя граница вилки выше нижней. */
const SPREAD = 1.25;

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

function roundUp(value: number, step = 500): number {
  return Math.ceil(value / step) * step;
}

export function calcRemont(input: CalcRemontInput, rates: WorkRate[]): CalcRemontResult {
  const wallArea = Math.round(totalWallArea(input.rooms) * 10) / 10;
  // Неизвестное состояние (например, из старой ссылки) — считаем как обычное
  const factor = CONDITION_FACTOR[input.condition] ?? CONDITION_FACTOR.normal;
  const selected = rates.filter((rate) => input.works.includes(rate.id));

  const items = selected.map((rate) => ({
    id: rate.id,
    label: rate.label,
    area: wallArea,
    price: Math.round(wallArea * rate.pricePerM2 * factor),
    status: rate.status,
  }));

  const raw = items.reduce((sum, item) => sum + item.price, 0);
  const minOrder = input.minOrder ?? 0;
  const minOrderApplied = raw > 0 && raw < minOrder;
  const total = Math.max(raw, minOrderApplied ? minOrder : raw);

  // Срок: сумма дней по работам плюс технологические паузы между этапами.
  const workDays = selected.reduce((days, rate) => {
    const rateDays = rate.m2PerDay > 0 ? Math.ceil(wallArea / rate.m2PerDay) : 0;
    return days + rateDays + rate.dryingDays;
  }, 0);

  return {
    wallArea,
    priceFrom: total > 0 ? roundUp(total) : 0,
    priceTo: total > 0 ? roundUp(total * SPREAD) : 0,
    workDays,
    items,
    minOrderApplied,
  };
}

/** Быстрая оценка площади стен по площади пола — когда размеры неизвестны. */
export function wallAreaFromFloor(floorArea: number, height = 2.7): number {
  if (floorArea <= 0) return 0;
  // Приближение для прямоугольной комнаты, близкой к квадрату
  const side = Math.sqrt(floorArea);
  const perimeter = 4 * side;
  return Math.max(0, perimeter * height - WINDOW_AREA - DOOR_AREA);
}
