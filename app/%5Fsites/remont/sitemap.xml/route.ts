import { PUBLISHED_SERVICES } from '@/content/remont/services';
import { siteOrigin } from '@/lib/site';

/**
 * Карта сайта «Бриллиант Ремонт». В неё попадают только опубликованные
 * услуги (PUBLISHED_SERVICES): неподтверждённые владельцем страницы
 * не существуют, и в карте их быть не должно.
 * /politika закрыта от индексации и сюда не входит.
 */
export const dynamic = 'force-static';

const PATHS = ['/', '/uslugi', '/portfolio', '/ceny', '/etapy', '/kontakty'];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function GET() {
  const origin = siteOrigin('remont');
  const paths = [...PATHS, ...PUBLISHED_SERVICES.map((service) => `/uslugi/${service.slug}`)];

  const urls = paths
    .map((path) => `  <url><loc>${escapeXml(`${origin}${path === '/' ? '/' : path}`)}</loc></url>`)
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
