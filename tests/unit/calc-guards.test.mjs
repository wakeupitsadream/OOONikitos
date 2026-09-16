import test from 'node:test';
import assert from 'node:assert/strict';

import { calcB2b } from '@/lib/calc/b2b';
import { calcRemont } from '@/lib/calc/remont';
import { B2B_OBJECTS, B2B_RATES } from '@/content/dezgarant/prices';
import { REMONT_RATES, WALL_TARIFFS } from '@/content/remont/prices';

/**
 * Граничные значения на входе библиотек расчёта: формы прикрывают их сами,
 * но контракт функций должен держать удар и без формы.
 */

test('B2B: NaN и отрицательная площадь считаются как ноль', () => {
  const object = B2B_OBJECTS[0];
  const zero = calcB2b({ object, area: 0 }, B2B_RATES);
  const nan = calcB2b({ object, area: Number.NaN }, B2B_RATES);
  const negative = calcB2b({ object, area: -50 }, B2B_RATES);
  assert.ok(Number.isFinite(zero.perMonth) && zero.perMonth > 0);
  assert.equal(nan.perMonth, zero.perMonth);
  assert.equal(negative.perMonth, zero.perMonth);
});

test('B2B: огромная площадь даёт конечное число', () => {
  const r = calcB2b({ object: B2B_OBJECTS[0], area: 1e9 }, B2B_RATES);
  assert.ok(Number.isFinite(r.perMonth));
  assert.ok(Number.isFinite(r.perVisit));
});

test('ремонт: неизвестный тариф считается как популярный из прайса', () => {
  const rooms = [{ length: 4, width: 3, height: 2.7, windows: 1, doors: 1 }];
  const popular = WALL_TARIFFS.find((tariff) => tariff.popular) ?? WALL_TARIFFS[0];
  const known = calcRemont({ rooms, tariff: popular.id }, REMONT_RATES);
  const unknown = calcRemont({ rooms, tariff: 'weird' }, REMONT_RATES);
  assert.ok(Number.isFinite(unknown.total) && unknown.total > 0);
  assert.equal(unknown.total, known.total);
  assert.equal(unknown.tariff.id, popular.id);
});

test('ремонт: NaN в метрах откосов не ломает итог', () => {
  const rooms = [{ length: 4, width: 3, height: 2.7, windows: 1, doors: 1 }];
  const r = calcRemont(
    { rooms, tariff: 'standard', extras: { slopesMeters: Number.NaN, slopesTariff: 'standard' } },
    REMONT_RATES,
  );
  assert.ok(Number.isFinite(r.total));
  assert.ok(r.items.every((item) => !item.id.startsWith('slopes')));
});

test('ремонт: проёмов больше, чем стен — площадь и смета не отрицательные', () => {
  const rooms = [{ length: 1, width: 1, height: 2, windows: 10, doors: 10 }];
  const r = calcRemont({ rooms, tariff: 'standard' }, REMONT_RATES);
  assert.equal(r.wallArea, 0);
  assert.equal(r.total, 0);
  assert.equal(r.items.length, 0);
});

test('ремонт: реальный прайс согласован сам с собой', () => {
  // Тарифы отсортированы по цене, и более дорогой тариф не требует большего объёма
  const sorted = [...WALL_TARIFFS].sort((a, b) => a.pricePerM2 - b.pricePerM2);
  for (let i = 1; i < sorted.length; i += 1) {
    assert.ok(sorted[i].minArea <= sorted[i - 1].minArea, `${sorted[i].label}: мин. объём`);
    assert.ok(sorted[i].guaranteeMonths >= sorted[i - 1].guaranteeMonths, `${sorted[i].label}: гарантия`);
  }
});
