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

/** Хосты бренда: собственные домены, их www-варианты и поддомен для разработки. */
function hostsFor(id: SiteId): string[] {
  const values = SITES[id].hosts.flatMap((host) => [host, `www.${host}`]);
  values.push(`${id}.localhost`);
  return Array.from(new Set(values));
}

/**
 * Порядок правил важен: сначала ВСЕ хосты всех брендов, затем ?site=,
 * затем cookie. Иначе cookie одного бренда перебивает собственный домен другого.
 */
const hostRules: Rewrite[] = SITE_IDS.flatMap((id) =>
  hostsFor(id).map((value) => ({
    source: SOURCE,
    destination: destinationFor(id),
    has: [{ type: 'host' as const, value }],
  })),
);

const queryRules: Rewrite[] = SITE_IDS.map((id) => ({
  source: SOURCE,
  destination: destinationFor(id),
  has: [{ type: 'query' as const, key: 'site', value: id }],
}));

const cookieRules: Rewrite[] = SITE_IDS.map((id) => ({
  source: SOURCE,
  destination: destinationFor(id),
  has: [{ type: 'cookie' as const, key: 'site', value: id }],
}));

/** Фолбэк: неизвестный хост без явного выбора — зонтичный сайт. */
const fallbackRule: Rewrite = { source: SOURCE, destination: destinationFor('belye-niti') };

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
};

export default nextConfig;
