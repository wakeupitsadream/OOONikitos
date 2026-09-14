import { NextResponse } from 'next/server';
import { isSiteId } from '@/config/sites';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Переключатель бренда для preview-деплоев: запоминает выбор в cookie
 * и уводит на корень (или на указанный путь) уже нужного сайта.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const to = url.searchParams.get('to');
  // Открытый редирект закрываем не по строке, а по результату разбора:
  // «/\evil.com» и «/%09/evil.com» проходят проверку префикса, но парсятся
  // как чужой origin — такие уводим на корень.
  const rawPath = url.searchParams.get('to_path') ?? '/';
  let path = '/';
  try {
    const target = new URL(rawPath || '/', url.origin);
    if (target.origin === url.origin && rawPath.startsWith('/')) {
      path = `${target.pathname}${target.search}${target.hash}`;
    }
  } catch {
    path = '/';
  }

  if (!isSiteId(to)) {
    return NextResponse.redirect(new URL('/', url.origin), 307);
  }

  const response = NextResponse.redirect(new URL(path, url.origin), 307);
  response.cookies.set('site', to, {
    path: '/',
    sameSite: 'lax',
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
