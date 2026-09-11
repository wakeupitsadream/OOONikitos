import { isProduction } from '@/lib/seo';
import { siteOrigin } from '@/lib/site';

/**
 * robots.txt лежит в папке сайта — значит, у каждого хоста он свой
 * (§9 п. 3 плана). Индексировать разрешаем только production-деплой:
 * preview-адреса не должны попадать в выдачу.
 */
export const dynamic = 'force-static';

export function GET() {
  const origin = siteOrigin('belye-niti');
  const host = origin.replace(/^https?:\/\//, '');

  const body = isProduction()
    ? [
        'User-agent: *',
        'Allow: /',
        'Disallow: /_sites/',
        'Disallow: /api/',
        '',
        `Host: ${host}`,
        `Sitemap: ${origin}/sitemap.xml`,
        '',
      ].join('\n')
    : ['User-agent: *', 'Disallow: /', ''].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
