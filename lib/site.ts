import { DEFAULT_SITE, SITES, SITE_IDS, type SiteConfig, type SiteId, isSiteId } from '@/config/sites';

/** Нормализует Host: убирает порт, www. и регистр. */
export function normalizeHost(host: string | null | undefined): string {
  if (!host) return '';
  const withoutPort = host.trim().toLowerCase().split(':')[0] ?? '';
  return withoutPort.startsWith('www.') ? withoutPort.slice(4) : withoutPort;
}

/**
 * Определяет бренд по заголовку Host.
 * Возвращает null для неизвестных хостов (preview-URL, чужие домены) —
 * решение о фолбэке принимает вызывающий код (cookie / ?site= / зонтик).
 */
export function resolveSiteByHost(host: string | null | undefined): SiteId | null {
  const normalized = normalizeHost(host);
  if (!normalized) return null;
  // Поддомен бренда в разработке: dezgarant.localhost
  const devMatch = SITE_IDS.find((id) => normalized === `${id}.localhost`);
  if (devMatch) return devMatch;
  for (const id of SITE_IDS) {
    if (SITES[id].hosts.includes(normalized)) return id;
  }
  return null;
}

/** Известен ли хост как «настоящий» адрес одного из брендов. */
export function isKnownHost(host: string | null | undefined): boolean {
  return resolveSiteByHost(host) !== null;
}

/**
 * Полный выбор бренда: хост → ?site= → cookie → зонтик.
 * Чистая функция, чтобы одинаково работать на сервере и в тестах.
 */
export function resolveSite(input: {
  host?: string | null;
  querySite?: string | null;
  cookieSite?: string | null;
}): SiteId {
  const byHost = resolveSiteByHost(input.host);
  if (byHost) return byHost;
  if (isSiteId(input.querySite)) return input.querySite;
  if (isSiteId(input.cookieSite)) return input.cookieSite;
  return DEFAULT_SITE;
}

/** Канонический адрес сайта: env, иначе резервный vercel.app. */
export function siteOrigin(id: SiteId): string {
  const config = SITES[id];
  const fromEnv = process.env[config.canonicalEnv];
  const origin = fromEnv && fromEnv.trim() ? fromEnv.trim() : config.fallbackCanonical;
  return origin.replace(/\/$/, '');
}

/**
 * Ссылка на другой бренд. Если его домен известен из env — абсолютная ссылка,
 * иначе переключатель на текущем хосте (для preview-деплоев).
 */
export function siteUrl(id: SiteId, path = '/'): string {
  const config = SITES[id];
  const fromEnv = process.env[config.canonicalEnv];
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (fromEnv && fromEnv.trim()) {
    return `${fromEnv.trim().replace(/\/$/, '')}${normalizedPath === '/' ? '' : normalizedPath}`;
  }
  const target = normalizedPath === '/' ? '' : `&to_path=${encodeURIComponent(normalizedPath)}`;
  return `/api/site?to=${id}${target}`;
}

export function siteConfig(id: SiteId): SiteConfig {
  return SITES[id];
}

export { SITES, SITE_IDS, DEFAULT_SITE, isSiteId };
export type { SiteId, SiteConfig };
