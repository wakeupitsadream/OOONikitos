/**
 * Абонентское обслуживание для организаций.
 * Публичных тарифов в ₽/мес в Оренбурге нет ни у кого — это наша ниша,
 * поэтому формула должна быть объяснимой: база за объект плюс площадь.
 */

export type B2bObjectId =
  | 'shop'
  | 'cafe'
  | 'food-production'
  | 'warehouse'
  | 'mkd'
  | 'kindergarten'
  | 'clinic'
  | 'hotel'
  | 'office';

export type B2bObject = {
  id: B2bObjectId;
  label: string;
  /**
   * Число визитов в месяц по нашему графику. Санитарные правила задают
   * обязанность проводить мероприятия и требование к результату, а не
   * периодичность — поэтому это план компании, а не норма регулятора.
   */
  visitsPerMonth: number;
  /** Нормативное основание обязанности проводить обработки — показываем клиенту. */
  norm: string;
  /** Коэффициент сложности объекта. */
  factor: number;
};

export type B2bRates = {
  /** Абонентская база за один визит на небольшой объект, ₽. */
  baseVisit: number;
  /** Площадь, входящая в базу, м². */
  includedArea: number;
  /** Ставка за м² сверх включённой площади, ₽ за визит. */
  perM2: number;
  status: 'confirmed' | 'draft';
};

export type B2bInput = {
  object: B2bObject;
  /** Площадь объекта, м². */
  area: number;
  /** Переопределение частоты визитов, если клиент хочет чаще. */
  visitsPerMonth?: number;
};

export type B2bResult = {
  /** Стоимость одного выезда, ₽. */
  perVisit: number;
  /** Абонентская плата в месяц, ₽. */
  perMonth: number;
  /** Стоимость года обслуживания, ₽. */
  perYear: number;
  visitsPerMonth: number;
  /** Экономия относительно разовых выездов, ₽ в год. */
  savedVsOneOff: number;
  status: 'confirmed' | 'draft';
};

/** Разовый выезд дороже абонентского на эту долю. */
const ONE_OFF_PREMIUM = 1.4;

function roundUp(value: number, step = 100): number {
  return Math.ceil(value / step) * step;
}

export function calcB2b(input: B2bInput, rates: B2bRates): B2bResult {
  const area = Math.max(0, Math.round(Number.isFinite(input.area) ? input.area : 0));
  const extraArea = Math.max(0, area - rates.includedArea);
  const perVisitRaw = (rates.baseVisit + extraArea * rates.perM2) * input.object.factor;
  const perVisit = roundUp(perVisitRaw);
  const visitsPerMonth = Math.max(1, input.visitsPerMonth ?? input.object.visitsPerMonth);
  const perMonth = roundUp(perVisit * visitsPerMonth);
  const perYear = perMonth * 12;
  const oneOffYear = roundUp(perVisit * ONE_OFF_PREMIUM) * visitsPerMonth * 12;

  return {
    perVisit,
    perMonth,
    perYear,
    visitsPerMonth,
    savedVsOneOff: Math.max(0, oneOffYear - perYear),
    status: rates.status,
  };
}
