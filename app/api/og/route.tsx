import { ImageResponse } from 'next/og';

import { DEFAULT_SITE, SITES, isSiteId, type SiteId } from '@/config/sites';
import { COMPANY } from '@/content/company';

/**
 * OG-картинка бренда (§9 п. 6 плана): /api/og?site=&title=
 * ImageResponse не знает про CSS-переменные, поэтому цвета продублированы
 * литералами из app/globals.css. Геометрия — ромб из повёрнутого квадрата:
 * стороны квадрата после rotate(45deg) дают верхнюю и нижнюю половины знака,
 * а стык границ проходит ровно по горизонтали через боковые вершины.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WIDTH = 1200;
const HEIGHT = 630;
const TITLE_LIMIT = 96;

const RED = '#f0202a';
const TEAL = '#05b0ae';
const GOLD = '#d9a24a';
const GOLD_BRIGHT = '#f2c766';
const GOLD_DEEP = '#b4620f';

type Palette = {
  bg: string;
  fg: string;
  muted: string;
  border: string;
  accent: string;
  accentFg: string;
  /** Верхняя (левая) половина ромба */
  markTop: string;
  /** Нижняя (правая) половина ромба */
  markBottom: string;
  watermarkOpacity: number;
};

const PALETTES: Record<SiteId, Palette> = {
  'belye-niti': {
    bg: '#0a0a0a',
    fg: '#f4f6f6',
    muted: '#a8b2b4',
    border: '#262b2e',
    accent: RED,
    accentFg: '#ffffff',
    markTop: RED,
    markBottom: TEAL,
    watermarkOpacity: 0.16,
  },
  dezgarant: {
    bg: '#fafaf9',
    fg: '#102328',
    muted: '#5c696d',
    border: '#e3e7e8',
    accent: TEAL,
    accentFg: '#ffffff',
    markTop: RED,
    markBottom: TEAL,
    watermarkOpacity: 0.14,
  },
  remont: {
    bg: '#0a0a0a',
    fg: '#f4f6f6',
    muted: '#a8b2b4',
    border: '#262b2e',
    accent: GOLD,
    accentFg: '#14110b',
    markTop: GOLD_BRIGHT,
    markBottom: GOLD_DEEP,
    watermarkOpacity: 0.18,
  },
};

/** Крупный заголовок не должен вылезать за холст — подбираем кегль по длине. */
function titleSize(title: string): number {
  if (title.length <= 22) return 78;
  if (title.length <= 40) return 62;
  if (title.length <= 64) return 50;
  return 42;
}

type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 600 | 800;
  style: 'normal';
};

const fontCache = new Map<string, ArrayBuffer>();

/**
 * Montserrat нужен ради кириллицы: встроенный шрифт ImageResponse её не знает.
 * Файлы лежат в public/fonts и читаются с диска — так картинка не зависит
 * от внешней сети и рендерится одинаково быстро на холодном старте.
 */
const FONT_FILES: Record<600 | 800, string> = {
  600: 'Montserrat-SemiBold.ttf',
  800: 'Montserrat-ExtraBold.ttf',
};

async function loadMontserrat(weight: 600 | 800): Promise<ArrayBuffer | null> {
  const key = String(weight);
  const cached = fontCache.get(key);
  if (cached) return cached;

  try {
    const { readFile } = await import('node:fs/promises');
    const { join } = await import('node:path');
    const file = join(process.cwd(), 'public', 'fonts', FONT_FILES[weight]);
    const buffer = await readFile(file);
    const data = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength,
    ) as ArrayBuffer;
    fontCache.set(key, data);
    return data;
  } catch {
    // Без шрифта картинка всё равно отрисуется — латиницей системным шрифтом
    return null;
  }
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const siteParam = params.get('site');
  const site: SiteId = isSiteId(siteParam) ? siteParam : DEFAULT_SITE;
  const config = SITES[site];
  const palette = PALETTES[site];

  const rawTitle = (params.get('title') ?? '').trim();
  // Заголовок приходит со страницы; без него берём имя бренда,
  // а для зонтика — девиз, чтобы не повторять строку над ним.
  const fallbackTitle = site === 'belye-niti' ? COMPANY.motto : config.name;
  const title = (rawTitle || fallbackTitle).slice(0, TITLE_LIMIT);
  // Наверху — зонтичное ООО, внизу — бренд: карточка не повторяет одно имя дважды.
  const eyebrow = COMPANY.shortLegalName.toUpperCase();
  const plate = 'ОРЕНБУРГ';

  const [bold, semibold] = await Promise.all([loadMontserrat(800), loadMontserrat(600)]);

  const fonts: OgFont[] = [];
  if (bold) fonts.push({ name: 'Montserrat', data: bold, weight: 800, style: 'normal' });
  if (semibold) fonts.push({ name: 'Montserrat', data: semibold, weight: 600, style: 'normal' });

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          padding: '70px 80px',
          background: palette.bg,
          color: palette.fg,
          fontFamily: 'Montserrat',
        }}
      >
        {/* Водяной знак: тот же ромб, крупно и в угол */}
        <div
          style={{
            position: 'absolute',
            top: 104,
            right: -78,
            width: 424,
            height: 424,
            display: 'flex',
            borderStyle: 'solid',
            borderWidth: 40,
            borderTopColor: palette.markTop,
            borderLeftColor: palette.markTop,
            borderRightColor: palette.markBottom,
            borderBottomColor: palette.markBottom,
            transform: 'rotate(45deg)',
            opacity: palette.watermarkOpacity,
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 96,
              height: 96,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 24,
            }}
          >
            <div
              style={{
                width: 62,
                height: 62,
                display: 'flex',
                borderStyle: 'solid',
                borderWidth: 9,
                borderTopColor: palette.markTop,
                borderLeftColor: palette.markTop,
                borderRightColor: palette.markBottom,
                borderBottomColor: palette.markBottom,
                transform: 'rotate(45deg)',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: '0.18em',
              color: palette.fg,
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 690 }}>
          <div
            style={{
              width: 128,
              height: 10,
              display: 'flex',
              marginBottom: 30,
              background: palette.accent,
            }}
          />
          <div
            style={{
              display: 'flex',
              fontSize: titleSize(title),
              fontWeight: 800,
              lineHeight: 1.06,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            borderTop: `2px solid ${palette.border}`,
            paddingTop: 28,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 34, fontWeight: 800 }}>{config.shortName}</div>
            <div
              style={{
                display: 'flex',
                marginTop: 10,
                fontSize: 22,
                fontWeight: 600,
                color: palette.muted,
              }}
            >
              {config.slogan}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              padding: '12px 22px',
              background: palette.accent,
              color: palette.accentFg,
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: '0.14em',
            }}
          >
            {plate}
          </div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      ...(fonts.length > 0 ? { fonts } : {}),
      headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=604800' },
    },
  );
}
