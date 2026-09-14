import type { Rates } from '@/lib/calc/dezgarant';
import type { B2bObject, B2bRates } from '@/lib/calc/b2b';

/**
 * Ставки ДезГаранта.
 *
 * ВНИМАНИЕ: значения помечены draft — это медианы рынка Оренбурга
 * из docs/research/market-dez.json (сентябрь 2026), а не прайс владельца.
 * Владелец присылает свой прайс — правится только этот файл,
 * после чего PRICE_STATUS переводится в 'confirmed'.
 */
export const PRICE_STATUS: 'draft' | 'confirmed' = 'draft';

/**
 * Сроки гарантии (guaranteeDays у тарифов) — тоже черновик: владелец ещё не
 * назвал цифру и условия повторной обработки. Пока 'draft', рядом с днями
 * стоит пометка «уточняется».
 */
export const GUARANTEE_STATUS: 'draft' | 'confirmed' = 'draft';

/** Срок гарантии на основные услуги для витринного блока на главной. */
export const DEFAULT_GUARANTEE_DAYS = 90;

export const DEZGARANT_RATES: Rates = {
  tariffs: {
    tarakany: {
      base: 1500,
      perUnit: 400,
      included: 1,
      unit: 'room',
      guaranteeDays: 90,
      visits: 1,
      returnAfterHours: 3,
      durationMin: 45,
    },
    klopy: {
      base: 1900,
      perUnit: 500,
      included: 1,
      unit: 'room',
      guaranteeDays: 90,
      // Клопов выводят курсом: две обработки плюс контрольный визит
      visits: 2,
      returnAfterHours: 4,
      durationMin: 60,
    },
    muravyi: {
      base: 1500,
      perUnit: 400,
      included: 1,
      unit: 'room',
      guaranteeDays: 90,
      visits: 1,
      returnAfterHours: 3,
      durationMin: 40,
    },
    gryzuny: {
      base: 1500,
      perUnit: 5,
      included: 60,
      unit: 'm2',
      guaranteeDays: 90,
      visits: 1,
      returnAfterHours: 1,
      durationMin: 40,
    },
    osy: {
      base: 1500,
      perUnit: 0,
      included: 1,
      unit: 'room',
      guaranteeDays: 45,
      visits: 1,
      returnAfterHours: 2,
      durationMin: 30,
    },
    kleshchi: {
      base: 1500,
      perUnit: 300,
      included: 5,
      unit: 'sotka',
      guaranteeDays: 45,
      visits: 1,
      returnAfterHours: 3,
      durationMin: 60,
    },
    plesen: {
      base: 1500,
      perUnit: 12,
      included: 40,
      unit: 'm2',
      guaranteeDays: 90,
      visits: 1,
      returnAfterHours: 6,
      durationMin: 60,
    },
    dezinfekciya: {
      base: 1500,
      perUnit: 12,
      included: 40,
      unit: 'm2',
      guaranteeDays: 30,
      visits: 1,
      returnAfterHours: 2,
      durationMin: 45,
    },
    zapahi: {
      base: 1500,
      perUnit: 12,
      included: 40,
      unit: 'm2',
      guaranteeDays: 30,
      visits: 1,
      returnAfterHours: 4,
      durationMin: 60,
    },
  },
  objectFactor: {
    'flat-1': 1,
    'flat-2': 1,
    'flat-3': 1,
    'flat-4': 1,
    house: 1.4,
    office: 1.2,
    cafe: 1.5,
    warehouse: 1.5,
    plot: 1,
  },
  hotFogSurcharge: 1000,
  outOfTownPerKm: 40,
  spread: 1.35,
};

/** Ставки абонентского обслуживания организаций. */
export const B2B_RATES: B2bRates = {
  baseVisit: 3500,
  includedArea: 100,
  perM2: 12,
  status: 'draft',
};

/**
 * Типы объектов для B2B-калькулятора с нормативным основанием.
 * Формулировки норм — из docs/research/law.json, менять их нельзя без сверки.
 */
export const B2B_OBJECTS: B2bObject[] = [
  {
    id: 'cafe',
    label: 'Кафе, ресторан, столовая',
    visitsPerMonth: 1,
    norm: 'СанПиН 2.3/2.4.3590-20, ТР ТС 021/2011 (ХАССП)',
    factor: 1.2,
  },
  {
    id: 'shop',
    label: 'Продуктовый магазин, рынок',
    visitsPerMonth: 1,
    norm: 'СП 2.3.6.3668-20 — ежемесячная оценка заселённости грызунами',
    factor: 1.1,
  },
  {
    id: 'food-production',
    label: 'Пищевое производство',
    visitsPerMonth: 2,
    norm: 'ТР ТС 021/2011, ст. 11 — процедуры на принципах ХАССП',
    factor: 1.4,
  },
  {
    id: 'warehouse',
    label: 'Склад',
    visitsPerMonth: 1,
    norm: 'СанПиН 3.3686-21 — меры против миграции грызунов',
    factor: 1.3,
  },
  {
    id: 'mkd',
    label: 'Управляющая компания, ТСЖ',
    visitsPerMonth: 1,
    norm: 'СанПиН 2.1.3684-21, п. 126–127 — при следах меры незамедлительно',
    factor: 1.2,
  },
  {
    id: 'kindergarten',
    label: 'Детский сад, школа, лагерь',
    visitsPerMonth: 1,
    norm: 'СП 2.4.2.4283-26 — действуют с 1 сентября 2026 года',
    factor: 1.3,
  },
  {
    id: 'clinic',
    label: 'Медицинская организация',
    visitsPerMonth: 1,
    norm: 'СанПиН 3.3686-21 — профилактическая и очаговая дезинфекция',
    factor: 1.3,
  },
  {
    id: 'hotel',
    label: 'Гостиница, хостел',
    visitsPerMonth: 1,
    norm: 'СанПиН 3.3686-21',
    factor: 1.2,
  },
  {
    id: 'office',
    label: 'Офис, бизнес-центр',
    visitsPerMonth: 1,
    norm: 'СанПиН 3.3686-21',
    factor: 1,
  },
];
