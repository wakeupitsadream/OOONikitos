import type { NextConfig } from 'next';
import type { Rewrite } from 'next/dist/lib/load-custom-routes';
import { SITE_IDS, SITES, type SiteId } from './config/sites';

/**
 * Пути, которые никогда не переписываются на брендовые маршруты.
 * Сами страницы брендов лежат в app/%5Fsites/<id> и публично доступны
 * по /_sites/<id> — этот префикс закрыт в robots.txt.
 */
const EXCLUDED = 'api/|_next/|_sites/|brands/|fonts/|favicon\\.ico';
const SOURCE = `/:path((?!${EXCLUDED}).*)`;

const destinationFor = (id: SiteId) => `/_sites/${id}/:path`;

/** Значение has/missing компилируется как регулярное выражение — точки экранируем. */
const escapeHost = (host: string) => host.replace(/\./g, '\\.');

/** Хосты бренда: собственные домены, их www-варианты и поддомен для разработки. */
function hostsFor(id: SiteId): string[] {
  const values = SITES[id].hosts.flatMap((host) => [host, `www.${host}`]);
  values.push(`${id}.localhost`);
  return Array.from(new Set(values));
}

const ALL_BRAND_HOSTS = SITE_IDS.flatMap(hostsFor);

/**
 * Условие «запрос пришёл не на брендовый домен». Нужно правилам по ?site=,
 * cookie и фолбэку: Next пропускает правило, чей destination не разрешился
 * в существующую страницу, и идёт к следующему. Без этого условия
 * dezgarant56.ru/portfolio?site=remont отдавал бы страницу Ремонта.
 */
const notBrandHost = [
  { type: 'host' as const, value: `(${ALL_BRAND_HOSTS.map(escapeHost).join('|')})` },
];

/**
 * Порядок правил: сначала ВСЕ хосты всех брендов, затем ?site=, затем cookie,
 * затем фолбэк — и три последних группы не действуют на брендовых доменах.
 */
const hostRules: Rewrite[] = SITE_IDS.flatMap((id) =>
  hostsFor(id).map((value) => ({
    source: SOURCE,
    destination: destinationFor(id),
    has: [{ type: 'host' as const, value: escapeHost(value) }],
  })),
);

const queryRules: Rewrite[] = SITE_IDS.map((id) => ({
  source: SOURCE,
  destination: destinationFor(id),
  has: [{ type: 'query' as const, key: 'site', value: id }],
  missing: notBrandHost,
}));

const cookieRules: Rewrite[] = SITE_IDS.map((id) => ({
  source: SOURCE,
  destination: destinationFor(id),
  has: [{ type: 'cookie' as const, key: 'site', value: id }],
  missing: notBrandHost,
}));

/** Фолбэк: неизвестный хост без явного выбора — зонтичный сайт. */
const fallbackRule: Rewrite = {
  source: SOURCE,
  destination: destinationFor('belye-niti'),
  missing: notBrandHost,
};

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [...hostRules, ...queryRules, ...cookieRules, fallbackRule],
      fallback: [],
    };
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Шрифты для OG-картинок читаются с диска по динамическому пути —
  // трассировка файлов их не видит, поэтому включаем явно.
  outputFileTracingIncludes: {
    '/api/og': ['./public/fonts/**'],
  },
};

export default nextConfig;
