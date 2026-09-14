import { SITES, type SiteId } from '@/config/sites';
import { leadFields, type Lead } from '@/lib/lead';

/**
 * Доставка заявки в Telegram (§8 п. 3 плана).
 * Функция никогда не бросает исключение: канал доставки — не повод уронить
 * запрос, вызывающий код сам решает, что делать с отказом.
 */

/** Ограничение Telegram на длину sendMessage. */
export const TELEGRAM_TEXT_LIMIT = 4096;

/** Максимальное ожидание перед единственным повтором после 429. */
const MAX_RETRY_WAIT_MS = 5000;

const REQUEST_TIMEOUT_MS = 8000;

export type DeliveryResult = { ok: boolean; reason?: string };

/** Экранирует символы, ломающие parse_mode: 'HTML'. */
export function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Обрезает текст до лимита, добавляя многоточие вместо оборванного слова. */
export function truncate(text: string, limit: number = TELEGRAM_TEXT_LIMIT): string {
  if (limit <= 0) return '';
  if (text.length <= limit) return text;
  return `${text.slice(0, limit - 1)}…`;
}

/** Предел одного значения до экранирования: обрезка после него могла бы разрубить сущность. */
const FIELD_LIMIT = 1000;

/** Сообщение для Telegram: подписи наши, значения — обрезанные и экранированные. */
export function buildLeadMessage(lead: Lead, siteId: SiteId): string {
  const header = `<b>Новая заявка — ${escapeHtml(SITES[siteId].shortName)}</b>`;
  const lines = leadFields(lead).map(
    (field) => `<b>${escapeHtml(field.label)}:</b> ${escapeHtml(truncate(field.value, FIELD_LIMIT))}`,
  );
  // Общий предел — страховка: 6 полей по 1000 знаков в &amp; не превысят его
  return truncate([header, ...lines].join('\n'));
}

/** Достаёт retry_after из ответа Telegram, не доверяя его форме. */
function readRetryAfter(body: unknown): number {
  if (typeof body !== 'object' || body === null) return 1;
  const parameters = (body as { parameters?: unknown }).parameters;
  if (typeof parameters !== 'object' || parameters === null) return 1;
  const retryAfter = (parameters as { retry_after?: unknown }).retry_after;
  return typeof retryAfter === 'number' && retryAfter > 0 ? retryAfter : 1;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Отправляет заявку в чат бренда (fallback — общий TELEGRAM_CHAT_ID).
 * Нет токена или чата → { ok: false, reason: 'not_configured' }.
 */
export async function sendLeadToTelegram(lead: Lead, siteId: SiteId): Promise<DeliveryResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = (process.env[SITES[siteId].telegramChatEnv] ?? process.env.TELEGRAM_CHAT_ID ?? '').trim();
  if (!token || !chatId) return { ok: false, reason: 'not_configured' };

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const payload = JSON.stringify({
    chat_id: chatId,
    text: buildLeadMessage(lead, siteId),
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  });

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (response.ok) return { ok: true };

      if (response.status === 429 && attempt === 0) {
        const body: unknown = await response.json().catch(() => null);
        const waitMs = Math.min(readRetryAfter(body) * 1000, MAX_RETRY_WAIT_MS);
        await wait(waitMs);
        continue;
      }

      return { ok: false, reason: `http_${response.status}` };
    } catch {
      return { ok: false, reason: 'network_error' };
    }
  }

  return { ok: false, reason: 'rate_limited' };
}
