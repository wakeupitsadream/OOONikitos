import type { Metadata } from 'next';
import { SITES, type SiteId } from '@/config/sites';
import { siteOrigin } from '@/lib/site';

/** Индексируем только production-деплой. Preview всегда noindex. */
export function isProduction(): boolean {
  return process.env.VERCEL_ENV === 'production';
}

export function robotsMeta(): Metadata['robots'] {
  return isProduction()
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true };
}

type PageMetaInput = {
  site: SiteId;
  title: string;
  description: string;
  path?: string;
  noindex?: boolean;
  ogTitle?: string;
};

export function pageMetadata({
  site,
  title,
  description,
  path = '/',
  noindex = false,
  ogTitle,
}: PageMetaInput): Metadata {
  const origin = siteOrigin(site);
  const config = SITES[site];
  const url = `${origin}${path === '/' ? '' : path}`;
  const ogImage = `${origin}/api/og?site=${site}&title=${encodeURIComponent(ogTitle ?? title)}`;
  const verification = process.env[config.verificationEnv];

  return {
    metadataBase: new URL(origin),
    title,
    description,
    // Иконка своя у каждого бренда: один проект отдаёт три сайта
    icons: {
      icon: [{ url: `/brands/${site}/favicon.svg`, type: 'image/svg+xml' }],
      shortcut: `/brands/${site}/favicon.svg`,
    },
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : robotsMeta(),
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      siteName: config.shortName,
      title,
      description,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    ...(verification ? { verification: { yandex: verification } } : {}),
  };
}

/** JSON-LD в разметку без dangerouslySetInnerHTML в каждом компоненте. */
export function jsonLdScript(data: Record<string, unknown> | Record<string, unknown>[]) {
  return {
    __html: JSON.stringify(data).replace(/</g, '\\u003c'),
  };
}
