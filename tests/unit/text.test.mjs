import test from 'node:test';
import assert from 'node:assert/strict';

import { plural, pluralize, formatNumber, formatPrice, formatPriceFrom, typograf, normalizePhone, formatPhone, telHref } from '../helpers/loader.mjs';

const NBSP = ' ';
const NNBSP = ' ';

test('plural склоняет по русским правилам', () => {
  const f = (n) => plural(n, 'объект', 'объекта', 'объектов');
  assert.equal(f(1), 'объект');
  assert.equal(f(2), 'объекта');
  assert.equal(f(4), 'объекта');
  assert.equal(f(5), 'объектов');
  assert.equal(f(11), 'объектов');
  assert.equal(f(12), 'объектов');
  assert.equal(f(14), 'объектов');
  assert.equal(f(21), 'объект');
  assert.equal(f(22), 'объекта');
  assert.equal(f(25), 'объектов');
  assert.equal(f(101), 'объект');
  assert.equal(f(111), 'объектов');
  assert.equal(f(0), 'объектов');
});

test('pluralize склеивает число и слово', () => {
  assert.equal(pluralize(1, 'день', 'дня', 'дней'), `1${NBSP}день`);
  assert.equal(pluralize(5, 'день', 'дня', 'дней'), `5${NBSP}дней`);
});

test('formatNumber группирует разряды тонким пробелом', () => {
  assert.equal(formatNumber(1500), `1${NNBSP}500`);
  assert.equal(formatNumber(12500), `12${NNBSP}500`);
  assert.equal(formatNumber(999), '999');
  assert.equal(formatNumber(1000000), `1${NNBSP}000${NNBSP}000`);
});

test('formatPrice и formatPriceFrom дают неразрывные пробелы', () => {
  assert.equal(formatPrice(1500), `1${NNBSP}500${NBSP}₽`);
  assert.equal(formatPriceFrom(1500), `от${NBSP}1${NNBSP}500${NBSP}₽`);
});

test('typograf ставит ёлочки и длинное тире', () => {
  assert.equal(typograf('Компания "Белые Нити"'), 'Компания «Белые Нити»');
  assert.ok(typograf('Штукатурка - это ровные стены').includes('—'));
});

test('typograf не отрывает единицы от числа', () => {
  assert.ok(typograf('от 1500 ₽').includes(`1500${NBSP}₽`));
  assert.ok(typograf('50 м²').includes(`50${NBSP}м²`));
});

test('typograf связывает короткие слова', () => {
  assert.ok(typograf('работаем в Оренбурге').includes(`в${NBSP}Оренбурге`));
  assert.ok(typograf('по договору').startsWith(`по${NBSP}`));
});

test('typograf не портит пустую строку', () => {
  assert.equal(typograf(''), '');
});

test('normalizePhone приводит к +7XXXXXXXXXX', () => {
  assert.equal(normalizePhone('8 909 613 29 37'), '+79096132937');
  assert.equal(normalizePhone('+7 (909) 613-29-37'), '+79096132937');
  assert.equal(normalizePhone('9096132937'), '+79096132937');
  assert.equal(normalizePhone('79510377008'), '+79510377008');
});

test('normalizePhone отбрасывает мусор', () => {
  assert.equal(normalizePhone('123'), null);
  assert.equal(normalizePhone(''), null);
  assert.equal(normalizePhone(null), null);
  assert.equal(normalizePhone('0000000000'), null);
  assert.equal(normalizePhone('12345678901234'), null);
});

test('formatPhone и telHref дают читаемый и кликабельный вид', () => {
  assert.equal(formatPhone('+79096132937'), '+7 909 613-29-37');
  assert.equal(telHref('8 909 613 29 37'), 'tel:+79096132937');
});
