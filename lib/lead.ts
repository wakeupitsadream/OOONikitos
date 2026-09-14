import { z } from 'zod';

import { SITE_IDS, SITES } from '@/config/sites';
import { formatPhone, normalizePhone } from '@/lib/phone';

/**
 * Схема заявки — одна на клиент и сервер (§8 плана).
 * Все сообщения об ошибках показываются человеку, поэтому они по-русски
 * и объясняют, что именно поправить.
 */

/** Минимальное время заполнения формы: быстрее человек физически не успевает. */
export const MIN_FILL_MS = 3000;

export const PHONE_ERROR = 'Укажите телефон в формате +7 999 123-45-67';
export const CONSENT_ERROR = 'Нужно согласие на обработку персональных данных';

/** Необязательное текстовое поле: пустая строка равна отсутствию значения. */
function optionalText(max: number, tooLong: string) {
  return z
    .string({ error: tooLong })
    .trim()
    .max(max, tooLong)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined));
}

export const leadSchema = z.object({
  site: z.enum(SITE_IDS, { error: 'Не удалось определить сайт — обновите страницу' }),

  name: z
    .string({ error: 'Укажите имя — как к вам обращаться' })
    .trim()
    .min(2, 'Имя слишком короткое: минимум 2 символа')
    .max(60, 'Имя слишком длинное: максимум 60 символов'),

  // Телефон сначала проверяем, потом приводим к виду +7XXXXXXXXXX.
  phone: z
    .string({ error: PHONE_ERROR })
    .trim()
    .refine((value) => normalizePhone(value) !== null, PHONE_ERROR)
    .transform((value) => normalizePhone(value) ?? value),

  service: optionalText(120, 'Название услуги слишком длинное: максимум 120 символов'),

  details: optionalText(2000, 'Комментарий слишком длинный: максимум 2000 символов'),

  page: z
    .string({ error: 'Не удалось определить страницу заявки' })
    .trim()
    .max(300, 'Слишком длинный адрес страницы')
    .default('/'),

  consent: z.literal(true, { error: CONSENT_ERROR }),

  // Ловушка для ботов: настоящая форма держит это поле пустым и скрытым.
  hp: z
    .string({ error: 'Поле должно остаться пустым' })
    .max(0, 'Поле должно остаться пустым')
    .optional()
    .default(''),

  // Время открытия формы (Date.now() на клиенте).
  t: z
    .number({ error: 'Не удалось определить время заполнения формы' })
    .optional()
    .default(0),
});

/** То, что отправляет форма. */
export type LeadInput = z.input<typeof leadSchema>;
/** То, что получает сервер после нормализации. */
export type Lead = z.output<typeof leadSchema>;

export type LeadValidation =
  | { ok: true; data: Lead }
  | { ok: false; errors: Record<string, string> };

/** Проверка заявки. Ошибки — по одной на поле, в порядке появления. */
export function validateLead(raw: unknown): LeadValidation {
  const parsed = leadSchema.safeParse(raw);
  if (parsed.success) return { ok: true, data: parsed.data };

  const errors: Record<string, string> = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path.length > 0 ? String(issue.path[0]) : 'form';
    if (!(key in errors)) errors[key] = issue.message;
  }
  return { ok: false, errors };
}

/**
 * Форму заполнили подозрительно быстро.
 * Отрицательная разница (часы клиента спешат) подозрением не считается —
 * живого человека из-за сбитого времени терять нельзя.
 */
export function isTooFast(t: number, now: number): boolean {
  if (!Number.isFinite(t) || t <= 0) return false;
  const elapsed = now - t;
  if (elapsed < 0) return false;
  return elapsed < MIN_FILL_MS;
}

/** Заполнено скрытое поле-ловушка — это бот, ответ ему «успех» без подсказок. */
export function hasHoneypot(raw: unknown): boolean {
  if (typeof raw !== 'object' || raw === null) return false;
  const hp = (raw as Record<string, unknown>).hp;
  if (typeof hp === 'string') return hp.trim().length > 0;
  return hp !== undefined;
}

/**
 * Форма отправлена быстрее MIN_FILL_MS. Это лишь подозрение: автозаполнение
 * браузера укладывается в такое время — поэтому такую заявку не бросаем,
 * а доставляем с пометкой.
 */
export function isSuspiciouslyFast(raw: unknown, now: number = Date.now()): boolean {
  if (typeof raw !== 'object' || raw === null) return false;
  const t = (raw as Record<string, unknown>).t;
  return typeof t === 'number' && isTooFast(t, now);
}

/** Обе эвристики вместе — для тестов и обратной совместимости. */
export function looksLikeBot(raw: unknown, now: number = Date.now()): boolean {
  return hasHoneypot(raw) || isSuspiciouslyFast(raw, now);
}

/** Пометка для владельца в тексте заявки, отправленной подозрительно быстро. */
export const FAST_FILL_NOTE =
  'Внимание: форма заполнена быстрее 3 секунд — возможно, автозаполнение браузера или бот.';

/** Поля заявки для Telegram и письма — один порядок и одни подписи. */
export function leadFields(lead: Lead): { label: string; value: string }[] {
  const fields: { label: string; value: string }[] = [
    { label: 'Сайт', value: SITES[lead.site].shortName },
    { label: 'Имя', value: lead.name },
    { label: 'Телефон', value: formatPhone(lead.phone) },
  ];
  if (lead.service) fields.push({ label: 'Услуга', value: lead.service });
  if (lead.details) fields.push({ label: 'Комментарий', value: lead.details });
  fields.push({ label: 'Страница', value: lead.page });
  return fields;
}
