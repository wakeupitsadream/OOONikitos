/**
 * Лимит заявок по ключу (IP) в памяти инстанса.
 *
 * Честно: на serverless это только best effort. Инстансы функции изолированы
 * и живут недолго, поэтому счётчик обнуляется при холодном старте и не общий
 * для параллельных инстансов. Это не единственная защита — основную работу
 * делают honeypot и минимальное время заполнения (§8 п. 2 плана).
 * Полноценный лимит появится вместе с общим хранилищем или Vercel BotID.
 */

export const RATE_LIMIT_MAX = 5;
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

/** Сколько ключей держим в памяти, чтобы не расти бесконечно. */
const MAX_KEYS = 2000;

const hits = new Map<string, number[]>();

export type RateLimitResult = { allowed: boolean; retryAfterSec: number };

/**
 * Выбрасывает ключи, у которых не осталось попыток в окне. Если и после этого
 * ключей больше предела (поток разных подставных адресов), удаляет самые
 * старые: память не должна расти до конца окна.
 */
function prune(now: number): void {
  for (const [key, stamps] of hits) {
    const fresh = stamps.filter((stamp) => now - stamp < RATE_LIMIT_WINDOW_MS);
    if (fresh.length === 0) hits.delete(key);
    else hits.set(key, fresh);
  }
  if (hits.size > MAX_KEYS) {
    const overflow = hits.size - MAX_KEYS;
    // Map хранит порядок вставки: первые ключи — самые старые
    for (const key of Array.from(hits.keys()).slice(0, overflow)) hits.delete(key);
  }
}

/**
 * Учитывает попытку и говорит, пропускать её или нет.
 * Время передаётся параметром, чтобы логика оставалась чистой и тестируемой.
 */
export function checkRateLimit(key: string, now: number = Date.now()): RateLimitResult {
  const previous = hits.get(key) ?? [];
  const fresh = previous.filter((stamp) => now - stamp < RATE_LIMIT_WINDOW_MS);

  if (fresh.length >= RATE_LIMIT_MAX) {
    hits.set(key, fresh);
    const oldest = fresh[0] ?? now;
    const waitMs = Math.max(0, oldest + RATE_LIMIT_WINDOW_MS - now);
    return { allowed: false, retryAfterSec: Math.max(1, Math.ceil(waitMs / 1000)) };
  }

  fresh.push(now);
  hits.set(key, fresh);
  if (hits.size > MAX_KEYS) prune(now);
  return { allowed: true, retryAfterSec: 0 };
}

/** Сброс счётчика: нужен тестам и ручной отладке. */
export function resetRateLimit(key?: string): void {
  if (key === undefined) hits.clear();
  else hits.delete(key);
}
