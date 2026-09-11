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
  const rawPath = url.searchParams.get('to_path') ?? '/';
  const path = rawPath.startsWith('/') && !rawPath.startsWith('//') ? rawPath : '/';

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
