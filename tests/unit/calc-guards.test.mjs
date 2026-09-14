import test from 'node:test';
import assert from 'node:assert/strict';

import { calcB2b } from '@/lib/calc/b2b';
import { calcRemont } from '@/lib/calc/remont';
import { B2B_OBJECTS, B2B_RATES } from '@/content/dezgarant/prices';
import { WORK_RATES } from '@/content/remont/prices';

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

test('ремонт: неизвестное состояние стен считается как обычное', () => {
  const rooms = [{ length: 4, width: 3, height: 2.7, windows: 1, doors: 1 }];
  const works = ['shtukaturka'];
  const normal = calcRemont({ rooms, works, condition: 'normal', minOrder: 0 }, WORK_RATES);
  const unknown = calcRemont({ rooms, works, condition: 'weird', minOrder: 0 }, WORK_RATES);
  assert.ok(Number.isFinite(unknown.priceFrom) && unknown.priceFrom > 0);
  assert.equal(unknown.priceFrom, normal.priceFrom);
  assert.equal(unknown.priceTo, normal.priceTo);
});

test('ремонт: проёмов больше, чем стен — площадь не отрицательная', () => {
  const rooms = [{ length: 1, width: 1, height: 2, windows: 10, doors: 10 }];
  const r = calcRemont({ rooms, works: ['shtukaturka'], condition: 'normal', minOrder: 0 }, WORK_RATES);
  assert.equal(r.wallArea, 0);
  assert.equal(r.priceFrom, 0);
});
