import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calcDezgarant,
  unitsFor,
  nextVisitLabel,
  visitSlots,
  roomWallArea,
  totalWallArea,
  wallAreaFromFloor,
  calcRemont,
  calcB2b,
  WINDOW_AREA,
  DOOR_AREA,
} from '../helpers/loader.mjs';

/* ------------------------------ ДезГарант ------------------------------ */

const RATES = {
  tariffs: {
    tarakany: { base: 1500, perUnit: 400, included: 1, unit: 'room', guaranteeDays: 90, visits: 1, returnAfterHours: 3, durationMin: 45 },
    klopy: { base: 1900, perUnit: 500, included: 1, unit: 'room', guaranteeDays: 90, visits: 2, returnAfterHours: 4, durationMin: 60 },
    kleshchi: { base: 1500, perUnit: 300, included: 5, unit: 'sotka', guaranteeDays: 45, visits: 1, returnAfterHours: 3, durationMin: 60 },
    gryzuny: { base: 1500, perUnit: 5, included: 60, unit: 'm2', guaranteeDays: 90, visits: 1, returnAfterHours: 1, durationMin: 40 },
    muravyi: { base: 1500, perUnit: 400, included: 1, unit: 'room', guaranteeDays: 90, visits: 1, returnAfterHours: 3, durationMin: 40 },
    osy: { base: 1500, perUnit: 0, included: 1, unit: 'room', guaranteeDays: 45, visits: 1, returnAfterHours: 2, durationMin: 30 },
    plesen: { base: 1500, perUnit: 12, included: 40, unit: 'm2', guaranteeDays: 90, visits: 1, returnAfterHours: 6, durationMin: 60 },
    dezinfekciya: { base: 1500, perUnit: 12, included: 40, unit: 'm2', guaranteeDays: 30, visits: 1, returnAfterHours: 2, durationMin: 45 },
    zapahi: { base: 1500, perUnit: 12, included: 40, unit: 'm2', guaranteeDays: 30, visits: 1, returnAfterHours: 4, durationMin: 60 },
  },
  objectFactor: {
    'flat-1': 1, 'flat-2': 1, 'flat-3': 1, 'flat-4': 1,
    house: 1.4, office: 1.2, cafe: 1.5, warehouse: 1.5, plot: 1,
  },
  hotFogSurcharge: 1000,
  outOfTownPerKm: 40,
  spread: 1.35,
};

test('unitsFor: комнатность берётся из типа квартиры', () => {
  const t = RATES.tariffs.tarakany;
  assert.equal(unitsFor({ problem: 'tarakany', object: 'flat-1' }, t), 1);
  assert.equal(unitsFor({ problem: 'tarakany', object: 'flat-3' }, t), 3);
});

test('unitsFor: площадь и сотки берутся из amount, минимум единица', () => {
  assert.equal(unitsFor({ problem: 'kleshchi', object: 'plot', amount: 8 }, RATES.tariffs.kleshchi), 8);
  assert.equal(unitsFor({ problem: 'kleshchi', object: 'plot', amount: 0 }, RATES.tariffs.kleshchi), 1);
  assert.equal(unitsFor({ problem: 'gryzuny', object: 'warehouse' }, RATES.tariffs.gryzuny), 1);
});

test('однокомнатная квартира стоит ровно базу', () => {
  const r = calcDezgarant({ problem: 'tarakany', object: 'flat-1' }, RATES);
  assert.equal(r.priceFrom, 1500);
  assert.ok(r.priceTo > r.priceFrom, 'верхняя граница выше нижней');
  assert.equal(r.breakdown.length, 1);
});

test('каждая дополнительная комната прибавляет ставку', () => {
  const one = calcDezgarant({ problem: 'tarakany', object: 'flat-1' }, RATES);
  const three = calcDezgarant({ problem: 'tarakany', object: 'flat-3' }, RATES);
  assert.equal(three.priceFrom - one.priceFrom, 800);
});

test('клопы считаются курсом из двух обработок', () => {
  const r = calcDezgarant({ problem: 'klopy', object: 'flat-2' }, RATES);
  assert.equal(r.visits, 2);
  assert.equal(r.priceFrom, 2400);
});

test('участок: включённые сотки не оплачиваются дважды', () => {
  const five = calcDezgarant({ problem: 'kleshchi', object: 'plot', amount: 5 }, RATES);
  const eight = calcDezgarant({ problem: 'kleshchi', object: 'plot', amount: 8 }, RATES);
  assert.equal(five.priceFrom, 1500);
  assert.equal(eight.priceFrom - five.priceFrom, 900);
});

test('коэффициент объекта повышает цену, квартира его не получает', () => {
  const flat = calcDezgarant({ problem: 'gryzuny', object: 'flat-2' }, RATES);
  const cafe = calcDezgarant({ problem: 'gryzuny', object: 'cafe', amount: 60 }, RATES);
  assert.ok(cafe.priceFrom > flat.priceFrom);
  assert.ok(cafe.breakdown.some((row) => row.label === 'Тип объекта'));
  assert.ok(!flat.breakdown.some((row) => row.label === 'Тип объекта'));
});

test('горячий туман и выезд за город добавляются отдельными строками', () => {
  const base = calcDezgarant({ problem: 'tarakany', object: 'flat-2' }, RATES);
  const full = calcDezgarant(
    { problem: 'tarakany', object: 'flat-2', method: 'hot', outOfTownKm: 30 },
    RATES,
  );
  assert.equal(full.priceFrom - base.priceFrom, 1000 + 30 * 40);
  assert.ok(full.breakdown.some((row) => row.label === 'Горячий туман'));
  assert.ok(full.breakdown.some((row) => row.label === 'Выезд за город'));
  assert.equal(full.method, 'hot');
});

test('цена округляется вверх до 50 ₽', () => {
  const r = calcDezgarant({ problem: 'gryzuny', object: 'warehouse', amount: 137 }, RATES);
  assert.equal(r.priceFrom % 50, 0);
  assert.equal(r.priceTo % 50, 0);
});

/** Момент по времени Оренбурга (UTC+5): часы считаются в поясе компании, не посетителя. */
function orenburg(hour, minute = 0) {
  return new Date(Date.UTC(2026, 8, 11, hour - 5, minute));
}

test('ближайший выезд зависит от часа и не использует случайность', () => {
  assert.equal(nextVisitLabel(orenburg(9)), 'сегодня');
  assert.equal(nextVisitLabel(orenburg(19)), 'завтра с 9:00');
  assert.equal(nextVisitLabel(orenburg(9)), nextVisitLabel(orenburg(9, 30)));
});

test('час берётся по Оренбургу, а не по часам посетителя', () => {
  // 13:00 по Москве = 15:00 в Оренбурге — «сегодня» уже не обещаем
  const moscowAfternoon = new Date(Date.UTC(2026, 8, 11, 10, 0));
  assert.equal(nextVisitLabel(moscowAfternoon), 'завтра с 9:00');
  assert.equal(nextVisitLabel(moscowAfternoon, 'Europe/Moscow'), 'сегодня');
});

test('слоты выезда сужаются к вечеру', () => {
  const morning = visitSlots(orenburg(9));
  const night = visitSlots(orenburg(22));
  assert.ok(morning.length > night.length);
  assert.ok(night.every((slot) => !slot.id.startsWith('today')));
});

test('метка и слоты не противоречат друг другу после 15:00', () => {
  for (const hour of [15, 15.5, 16, 20]) {
    const now = orenburg(Math.floor(hour), hour % 1 ? 30 : 0);
    assert.equal(nextVisitLabel(now), 'завтра с 9:00');
    assert.ok(visitSlots(now).every((slot) => !slot.id.startsWith('today')), `час ${hour}`);
  }
  const before = orenburg(14, 59);
  assert.equal(nextVisitLabel(before), 'сегодня');
  assert.ok(visitSlots(before).some((slot) => slot.id.startsWith('today')));
});

test('нечисловая площадь не превращается в NaN ₽', () => {
  const r = calcDezgarant({ problem: 'gryzuny', object: 'warehouse', amount: Number.NaN }, RATES);
  assert.ok(Number.isFinite(r.priceFrom) && r.priceFrom > 0);
  assert.ok(Number.isFinite(r.priceTo) && r.priceTo >= r.priceFrom);
  const missing = calcDezgarant({ problem: 'gryzuny', object: 'warehouse' }, RATES);
  assert.equal(missing.priceFrom, r.priceFrom);
});

/* -------------------------- Бриллиант Ремонт -------------------------- */

const WORKS = [
  { id: 'shtukaturka', label: 'Штукатурка стен', pricePerM2: 500, m2PerDay: 35, dryingDays: 2, status: 'draft' },
  { id: 'shpaklevka', label: 'Шпаклёвка', pricePerM2: 350, m2PerDay: 40, dryingDays: 1, status: 'draft' },
  { id: 'pokraska', label: 'Покраска', pricePerM2: 250, m2PerDay: 50, dryingDays: 1, status: 'draft' },
  { id: 'oboi', label: 'Поклейка обоев', pricePerM2: 300, m2PerDay: 45, dryingDays: 0, status: 'draft' },
];

test('площадь стен комнаты считается по периметру за вычетом проёмов', () => {
  const area = roomWallArea({ length: 5, width: 4, height: 2.7, windows: 1, doors: 1 });
  const expected = 2 * (5 + 4) * 2.7 - WINDOW_AREA - DOOR_AREA;
  assert.equal(Math.round(area * 100) / 100, Math.round(expected * 100) / 100);
});

test('площадь стен не уходит в минус при большом числе проёмов', () => {
  const area = roomWallArea({ length: 1, width: 1, height: 2, windows: 10, doors: 10 });
  assert.equal(area, 0);
});

test('площади комнат складываются', () => {
  const rooms = [
    { length: 4, width: 3, height: 2.7, windows: 1, doors: 1 },
    { length: 3, width: 3, height: 2.7, windows: 1, doors: 1 },
  ];
  assert.equal(
    Math.round(totalWallArea(rooms) * 10) / 10,
    Math.round((roomWallArea(rooms[0]) + roomWallArea(rooms[1])) * 10) / 10,
  );
});

test('оценка площади стен по площади пола даёт разумный результат', () => {
  const area = wallAreaFromFloor(25, 2.7);
  assert.ok(area > 40 && area < 60, `ожидали 40–60 м², получили ${area}`);
  assert.equal(wallAreaFromFloor(0), 0);
});

test('калькулятор ремонта складывает выбранные работы', () => {
  const rooms = [{ length: 5, width: 4, height: 2.7, windows: 1, doors: 1 }];
  const one = calcRemont({ rooms, works: ['shtukaturka'], condition: 'new' }, WORKS);
  const two = calcRemont({ rooms, works: ['shtukaturka', 'shpaklevka'], condition: 'new' }, WORKS);
  assert.ok(two.priceFrom > one.priceFrom);
  assert.equal(two.items.length, 2);
  assert.equal(one.items.length, 1);
});

test('плохое состояние поверхности повышает цену', () => {
  const rooms = [{ length: 5, width: 4, height: 2.7, windows: 1, doors: 1 }];
  const normal = calcRemont({ rooms, works: ['shtukaturka'], condition: 'new' }, WORKS);
  const bad = calcRemont({ rooms, works: ['shtukaturka'], condition: 'bad' }, WORKS);
  assert.ok(bad.priceFrom > normal.priceFrom);
});

test('минимальный заказ подтягивает мелкую смету', () => {
  const rooms = [{ length: 1.2, width: 1, height: 2.5, windows: 0, doors: 1 }];
  const r = calcRemont({ rooms, works: ['pokraska'], condition: 'new', minOrder: 15000 }, WORKS);
  assert.equal(r.minOrderApplied, true);
  assert.ok(r.priceFrom >= 15000);
});

test('пустой выбор работ даёт нулевую смету без минималки', () => {
  const rooms = [{ length: 5, width: 4, height: 2.7, windows: 1, doors: 1 }];
  const r = calcRemont({ rooms, works: [], condition: 'new', minOrder: 15000 }, WORKS);
  assert.equal(r.priceFrom, 0);
  assert.equal(r.minOrderApplied, false);
  assert.equal(r.workDays, 0);
});

test('срок растёт вместе с площадью и учитывает сушку', () => {
  const small = calcRemont(
    { rooms: [{ length: 3, width: 3, height: 2.7, windows: 1, doors: 1 }], works: ['shtukaturka'], condition: 'new' },
    WORKS,
  );
  const big = calcRemont(
    { rooms: [{ length: 8, width: 6, height: 3, windows: 2, doors: 1 }], works: ['shtukaturka'], condition: 'new' },
    WORKS,
  );
  assert.ok(big.workDays > small.workDays);
  assert.ok(small.workDays >= 2, 'технологическая пауза входит в срок');
});

/* -------------------------------- B2B --------------------------------- */

const B2B_RATES = { baseVisit: 3500, includedArea: 100, perM2: 12, status: 'draft' };
const CAFE = { id: 'cafe', label: 'Кафе', visitsPerMonth: 1, norm: 'СанПиН 2.3/2.4.3590-20', factor: 1.2 };

test('B2B: небольшой объект стоит базу с коэффициентом', () => {
  const r = calcB2b({ object: CAFE, area: 80 }, B2B_RATES);
  assert.equal(r.perVisit, 4200);
  assert.equal(r.perMonth, 4200);
  assert.equal(r.perYear, 4200 * 12);
});

test('B2B: площадь сверх включённой добавляет стоимость', () => {
  const small = calcB2b({ object: CAFE, area: 100 }, B2B_RATES);
  const big = calcB2b({ object: CAFE, area: 300 }, B2B_RATES);
  assert.ok(big.perVisit > small.perVisit);
});

test('B2B: частота визитов умножает месячную плату', () => {
  const once = calcB2b({ object: CAFE, area: 100 }, B2B_RATES);
  const twice = calcB2b({ object: CAFE, area: 100, visitsPerMonth: 2 }, B2B_RATES);
  assert.equal(twice.perMonth, once.perMonth * 2);
  assert.equal(twice.visitsPerMonth, 2);
});

test('B2B: абонемент выгоднее разовых выездов', () => {
  const r = calcB2b({ object: CAFE, area: 150 }, B2B_RATES);
  assert.ok(r.savedVsOneOff > 0);
  assert.equal(r.status, 'draft');
});
