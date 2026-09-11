import { SERVICES } from '@/content/dezgarant/services';
import { siteOrigin } from '@/lib/site';

/**
 * Карта сайта ДезГаранта: только реально существующие страницы.
 * /politika сюда не попадает — она закрыта от индексации (§9 п. 1 плана).
 * Новая страница сайта = новая строка в PATHS.
 */
export const dynamic = 'force-static';

const PATHS = ['/', '/uslugi', '/ceny', '/biznesu', '/licenziya', '/kontakty'];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function GET() {
  const origin = siteOrigin('dezgarant');
  const paths = [...PATHS, ...SERVICES.map((service) => `/uslugi/${service.slug}`)];

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
