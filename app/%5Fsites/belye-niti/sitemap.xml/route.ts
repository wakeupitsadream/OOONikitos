import { siteOrigin } from '@/lib/site';

/**
 * Карта зонтичного сайта. У него одна публичная страница — главная;
 * /politika закрыта от индексации и в карту не попадает.
 * Появится новый раздел — добавляется строкой в PATHS.
 */
export const dynamic = 'force-static';

const PATHS = ['/'];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function GET() {
  const origin = siteOrigin('belye-niti');

  const urls = PATHS.map(
    (path) => `  <url><loc>${escapeXml(`${origin}${path === '/' ? '/' : path}`)}</loc></url>`,
  ).join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
