import test from 'node:test';
import assert from 'node:assert/strict';

import {
  validateLead,
  isTooFast,
  looksLikeBot,
  leadFields,
  MIN_FILL_MS,
  PHONE_ERROR,
  CONSENT_ERROR,
  checkRateLimit,
  resetRateLimit,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
  escapeHtml,
  truncate,
  buildLeadMessage,
  TELEGRAM_TEXT_LIMIT,
} from '../helpers/loader.mjs';

/** Заготовка корректной заявки: тесты меняют только нужное поле. */
function payload(overrides = {}) {
  return {
    site: 'dezgarant',
    name: 'Иван',
    phone: '+7 909 613 29 37',
    consent: true,
    hp: '',
    t: 1,
    page: '/uslugi',
    ...overrides,
  };
}

test('validateLead принимает корректную заявку и нормализует поля', () => {
  const result = validateLead(payload({ name: '  Иван  ', service: '  Дезинсекция  ' }));
  assert.equal(result.ok, true);
  assert.equal(result.data.name, 'Иван');
  assert.equal(result.data.phone, '+79096132937');
  assert.equal(result.data.service, 'Дезинсекция');
  assert.equal(result.data.site, 'dezgarant');
  assert.equal(result.data.page, '/uslugi');
});

test('validateLead подставляет значения по умолчанию для необязательного', () => {
  const result = validateLead({
    site: 'remont',
    name: 'Пётр',
    phone: '89096132937',
    consent: true,
  });
  assert.equal(result.ok, true);
  assert.equal(result.data.page, '/');
  assert.equal(result.data.service, undefined);
  assert.equal(result.data.details, undefined);
});

test('validateLead отвергает чужой сайт', () => {
  const result = validateLead(payload({ site: 'unknown' }));
  assert.equal(result.ok, false);
  assert.match(result.errors.site, /сайт/i);
});

test('validateLead требует имя от двух символов', () => {
  const short = validateLead(payload({ name: 'И' }));
  assert.equal(short.ok, false);
  assert.match(short.errors.name, /коротк/i);

  const empty = validateLead(payload({ name: '   ' }));
  assert.equal(empty.ok, false);
  assert.ok(empty.errors.name);

  const long = validateLead(payload({ name: 'и'.repeat(61) }));
  assert.equal(long.ok, false);
  assert.match(long.errors.name, /длинн/i);
});

test('validateLead отвергает невалидный телефон с понятным сообщением', () => {
  const result = validateLead(payload({ phone: '123' }));
  assert.equal(result.ok, false);
  assert.equal(result.errors.phone, PHONE_ERROR);
  assert.equal(validateLead(payload({ phone: '' })).errors.phone, PHONE_ERROR);
});

test('validateLead не пропускает заявку без согласия', () => {
  const unchecked = validateLead(payload({ consent: false }));
  assert.equal(unchecked.ok, false);
  assert.equal(unchecked.errors.consent, CONSENT_ERROR);

  const missing = validateLead(payload({ consent: undefined }));
  assert.equal(missing.ok, false);
  assert.equal(missing.errors.consent, CONSENT_ERROR);
});

test('validateLead ограничивает длину услуги и комментария', () => {
  const service = validateLead(payload({ service: 'у'.repeat(121) }));
  assert.equal(service.ok, false);
  assert.ok(service.errors.service);

  const details = validateLead(payload({ details: 'д'.repeat(2001) }));
  assert.equal(details.ok, false);
  assert.ok(details.errors.details);

  assert.equal(validateLead(payload({ details: 'д'.repeat(2000) })).ok, true);
});

test('honeypot: заполненная ловушка выдаёт бота', () => {
  assert.equal(looksLikeBot(payload({ hp: 'http://spam' })), true);
  assert.equal(looksLikeBot(payload({ hp: '  ' })), false);
  assert.equal(looksLikeBot(payload()), false);
  assert.equal(looksLikeBot(null), false);

  // Схема тоже не пропустит непустую ловушку, если её проверят напрямую.
  assert.equal(validateLead(payload({ hp: 'спам' })).ok, false);
});

test('honeypot: слишком быстрое заполнение видно по метке времени', () => {
  const now = 1_000_000;
  assert.equal(looksLikeBot({ ...payload(), t: now - 500 }, now), true);
  assert.equal(looksLikeBot({ ...payload(), t: now - MIN_FILL_MS }, now), false);
});

test('isTooFast срабатывает строго до границы в 3 секунды', () => {
  const now = 1_000_000;
  assert.equal(isTooFast(now - (MIN_FILL_MS - 1), now), true);
  assert.equal(isTooFast(now - MIN_FILL_MS, now), false);
  assert.equal(isTooFast(now - (MIN_FILL_MS + 1), now), false);
  // Часы клиента спешат или метки нет — живого человека не наказываем.
  assert.equal(isTooFast(now + 10_000, now), false);
  assert.equal(isTooFast(0, now), false);
  assert.equal(isTooFast(Number.NaN, now), false);
});

test('checkRateLimit пропускает пять заявок и блокирует шестую', () => {
  resetRateLimit('ip-1');
  const start = 5_000_000;
  for (let i = 0; i < RATE_LIMIT_MAX; i += 1) {
    const result = checkRateLimit('ip-1', start + i * 1000);
    assert.equal(result.allowed, true, `попытка ${i + 1} должна проходить`);
    assert.equal(result.retryAfterSec, 0);
  }

  const blocked = checkRateLimit('ip-1', start + RATE_LIMIT_MAX * 1000);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSec > 0);
  assert.ok(blocked.retryAfterSec <= RATE_LIMIT_WINDOW_MS / 1000);
});

test('checkRateLimit снова пускает после окна и считает ключи раздельно', () => {
  resetRateLimit('ip-2');
  resetRateLimit('ip-3');
  const start = 7_000_000;
  for (let i = 0; i < RATE_LIMIT_MAX; i += 1) {
    checkRateLimit('ip-2', start + i);
  }
  assert.equal(checkRateLimit('ip-2', start + RATE_LIMIT_MAX).allowed, false);
  assert.equal(checkRateLimit('ip-2', start + RATE_LIMIT_WINDOW_MS + 1).allowed, true);
  assert.equal(checkRateLimit('ip-3', start).allowed, true);
});

test('escapeHtml обезвреживает разметку в пользовательском вводе', () => {
  assert.equal(escapeHtml('<b>клоп</b>'), '&lt;b&gt;клоп&lt;/b&gt;');
  assert.equal(escapeHtml('Мыши & крысы'), 'Мыши &amp; крысы');
  assert.equal(escapeHtml('обычный текст'), 'обычный текст');
});

test('truncate держит текст в лимите Telegram', () => {
  const long = 'я'.repeat(TELEGRAM_TEXT_LIMIT + 500);
  const cut = truncate(long);
  assert.equal(cut.length, TELEGRAM_TEXT_LIMIT);
  assert.ok(cut.endsWith('…'));
  assert.equal(truncate('коротко'), 'коротко');
  assert.equal(truncate('абвгд', 3), 'аб…');
});

test('buildLeadMessage собирает безопасное сообщение в пределах лимита', () => {
  const lead = validateLead(
    payload({ name: 'Иван <script>', details: 'д'.repeat(2000), service: 'Клопы & тараканы' }),
  );
  assert.equal(lead.ok, true);

  const message = buildLeadMessage(lead.data, 'dezgarant');
  assert.ok(message.length <= TELEGRAM_TEXT_LIMIT);
  assert.ok(message.includes('Новая заявка — ДезГарант'));
  assert.ok(message.includes('&lt;script&gt;'));
  assert.ok(!message.includes('<script>'));
  assert.ok(message.includes('+7 909 613-29-37'));
});

test('leadFields даёт подписи по-русски и пропускает пустые поля', () => {
  const lead = validateLead(payload());
  assert.equal(lead.ok, true);
  const labels = leadFields(lead.data).map((field) => field.label);
  assert.deepEqual(labels, ['Сайт', 'Имя', 'Телефон', 'Страница']);
});
