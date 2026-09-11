/**
 * Расчёт стоимости обработки ДезГаранта.
 * Чистые функции без DOM: используются и в браузере, и в тестах,
 * и завтра — в боевом бэкенде. Все ставки берутся из content/dezgarant/prices.
 */

export type ProblemId =
  | 'tarakany'
  | 'klopy'
  | 'muravyi'
  | 'gryzuny'
  | 'osy'
  | 'kleshchi'
  | 'plesen'
  | 'dezinfekciya'
  | 'zapahi';

export type ObjectId =
  | 'flat-1'
  | 'flat-2'
  | 'flat-3'
  | 'flat-4'
  | 'house'
  | 'office'
  | 'cafe'
  | 'warehouse'
  | 'plot';

export type Method = 'cold' | 'hot';

/** Тариф одной услуги: база за объект плюс ставка за единицу сверх включённого объёма. */
export type Tariff = {
  /** Цена «от» за типовой объект (1-комн. квартира или минимальный заказ). */
  base: number;
  /** Доплата за каждую дополнительную единицу (комнату, м², сотку). */
  perUnit: number;
  /** Сколько единиц уже входит в базу. */
  included: number;
  /** Единица расчёта: комнаты, квадратные метры или сотки. */
  unit: 'room' | 'm2' | 'sotka';
  /** Гарантия в днях. */
  guaranteeDays: number;
  /** Сколько обработок входит в курс (клопы — две плюс контроль). */
  visits: number;
  /** Часов до возвращения в помещение. */
  returnAfterHours: number;
  /** Длительность работы на объекте в минутах. */
  durationMin: number;
};

export type CalcInput = {
  problem: ProblemId;
  object: ObjectId;
  /** Площадь в м² или число соток — для объектов, считающихся по площади. */
  amount?: number;
  method?: Method;
  /** Надбавка за выезд за пределы города, километры в одну сторону. */
  outOfTownKm?: number;
};

export type CalcResult = {
  /** Нижняя и верхняя граница оценки: честная вилка, а не точная цифра. */
  priceFrom: number;
  priceTo: number;
  /** Число обработок в курсе. */
  visits: number;
  guaranteeDays: number;
  returnAfterHours: number;
  durationMin: number;
  method: Method;
  /** Из чего сложилась цена — показываем клиенту. */
  breakdown: { label: string; value: number }[];
};

export type Rates = {
  tariffs: Record<ProblemId, Tariff>;
  /** Коэффициент объекта: дом и коммерция дороже квартиры. */
  objectFactor: Record<ObjectId, number>;
  /** Надбавка за горячий туман. */
  hotFogSurcharge: number;
  /** Стоимость километра при выезде за город. */
  outOfTownPerKm: number;
  /** Во сколько раз верхняя граница вилки выше нижней. */
  spread: number;
};

/** Сколько комнат считать для типовых квартир. */
const ROOMS: Partial<Record<ObjectId, number>> = {
  'flat-1': 1,
  'flat-2': 2,
  'flat-3': 3,
  'flat-4': 4,
};

/** Округление вверх до 50 ₽ — чтобы в расчёте не появлялись «1237 ₽». */
function roundUp(value: number, step = 50): number {
  return Math.ceil(value / step) * step;
}

/** Сколько расчётных единиц в объекте: комнаты, метры или сотки. */
export function unitsFor(input: CalcInput, tariff: Tariff): number {
  if (tariff.unit === 'room') return ROOMS[input.object] ?? 1;
  return Math.max(1, Math.round(input.amount ?? 0));
}

export function calcDezgarant(input: CalcInput, rates: Rates): CalcResult {
  const tariff = rates.tariffs[input.problem];
  const method: Method = input.method ?? 'cold';
  const units = unitsFor(input, tariff);
  const extraUnits = Math.max(0, units - tariff.included);

  const breakdown: { label: string; value: number }[] = [];

  const base = tariff.base;
  breakdown.push({ label: 'Базовая обработка', value: base });

  const extra = extraUnits * tariff.perUnit;
  if (extra > 0) {
    const unitLabel =
      tariff.unit === 'room' ? 'Дополнительные комнаты' : tariff.unit === 'sotka' ? 'Площадь участка' : 'Площадь объекта';
    breakdown.push({ label: unitLabel, value: extra });
  }

  const subtotalBeforeFactor = base + extra;
  const factor = rates.objectFactor[input.object] ?? 1;
  const factorAmount = Math.round(subtotalBeforeFactor * (factor - 1));
  if (factorAmount > 0) {
    breakdown.push({ label: 'Тип объекта', value: factorAmount });
  }

  const hot = method === 'hot' ? rates.hotFogSurcharge : 0;
  if (hot > 0) breakdown.push({ label: 'Горячий туман', value: hot });

  const travel = Math.max(0, Math.round(input.outOfTownKm ?? 0)) * rates.outOfTownPerKm;
  if (travel > 0) breakdown.push({ label: 'Выезд за город', value: travel });

  const total = subtotalBeforeFactor + factorAmount + hot + travel;
  const priceFrom = roundUp(total);
  const priceTo = roundUp(total * rates.spread);

  return {
    priceFrom,
    priceTo,
    visits: tariff.visits,
    guaranteeDays: tariff.guaranteeDays,
    returnAfterHours: tariff.returnAfterHours,
    durationMin: tariff.durationMin,
    method,
    breakdown,
  };
}

/**
 * Ближайший выезд по часу суток: детерминированно, без Math.random,
 * чтобы расчёт был воспроизводим и правдоподобен в любое время.
 */
export function nextVisitLabel(now: Date): string {
  const hour = now.getHours();
  if (hour < 15) return 'сегодня';
  if (hour < 21) return 'завтра с 9:00';
  return 'завтра с 9:00';
}

/** Варианты слотов выезда: пожелание в заявке, а не бронирование. */
export function visitSlots(now: Date): { id: string; label: string }[] {
  const hour = now.getHours();
  const slots: { id: string; label: string }[] = [];
  if (hour < 12) slots.push({ id: 'today-afternoon', label: 'Сегодня, 14:00–17:00' });
  if (hour < 16) slots.push({ id: 'today-evening', label: 'Сегодня, 17:00–20:00' });
  slots.push({ id: 'tomorrow-morning', label: 'Завтра, 9:00–12:00' });
  slots.push({ id: 'tomorrow-afternoon', label: 'Завтра, 14:00–17:00' });
  slots.push({ id: 'any', label: 'Любое удобное время' });
  return slots;
}
