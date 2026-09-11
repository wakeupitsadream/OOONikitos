import { useId } from 'react';

/**
 * Знак «Бриллиант Ремонт»: объёмный гранёный камень в золоте —
 * трапециевидная площадка (таблица) с фасетами по краям и павильон
 * из треугольных граней, сходящихся в точку. Пересобран по визитке
 * docs/brand/cards/brilliant-remont-front.jpg.
 */

export type LogoProps = {
  /** full — знак и текст, mark — только знак, mono — одноцветный знак currentColor. */
  variant?: 'full' | 'mark' | 'mono';
  className?: string;
  withSlogan?: boolean;
};

type Facet = {
  id: string;
  d: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** Блик грани */
  from: string;
  /** Тень грани */
  to: string;
};

/** Восемь граней короны: таблица, задний поясок, четыре боковых и два передних фасета. */
const CROWN: readonly Facet[] = [
  { id: 'table', d: 'M32 21L68 21L78 34L50 37L22 34Z', x1: 22, y1: 21, x2: 78, y2: 37, from: '#F2C766', to: '#E0B25A' },
  { id: 'back', d: 'M26 15L74 15L68 21L32 21Z', x1: 26, y1: 15, x2: 74, y2: 21, from: '#B4620F', to: '#8F4C0B' },
  { id: 'upperLeft', d: 'M10 27L26 15L32 21L22 34Z', x1: 10, y1: 15, x2: 32, y2: 34, from: '#F7D584', to: '#D9A24A' },
  { id: 'upperRight', d: 'M90 27L74 15L68 21L78 34Z', x1: 68, y1: 15, x2: 90, y2: 34, from: '#C67A2A', to: '#9E5A12' },
  { id: 'left', d: 'M6 42L10 27L22 34L16 46Z', x1: 6, y1: 27, x2: 22, y2: 46, from: '#D9A24A', to: '#B4620F' },
  { id: 'frontLeft', d: 'M16 46L22 34L50 37L50 52L32 50Z', x1: 16, y1: 34, x2: 50, y2: 52, from: '#F2C766', to: '#D9A24A' },
  { id: 'frontRight', d: 'M50 52L50 37L78 34L84 46L68 50Z', x1: 50, y1: 34, x2: 84, y2: 52, from: '#C07A28', to: '#8F4C0B' },
  { id: 'right', d: 'M84 46L78 34L90 27L94 42Z', x1: 78, y1: 27, x2: 94, y2: 46, from: '#A8620F', to: '#7E430A' },
];

/** Шесть граней павильона: треугольники от рундиста к острию. */
const PAVILION: readonly Facet[] = [
  { id: 'pav1', d: 'M6 42L16 46L50 90Z', x1: 6, y1: 42, x2: 50, y2: 90, from: '#F2C766', to: '#C88A34' },
  { id: 'pav2', d: 'M16 46L32 50L50 90Z', x1: 16, y1: 46, x2: 50, y2: 90, from: '#B4620F', to: '#8F4C0B' },
  { id: 'pav3', d: 'M32 50L50 52L50 90Z', x1: 32, y1: 50, x2: 50, y2: 90, from: '#E8BC62', to: '#B4620F' },
  { id: 'pav4', d: 'M50 52L68 50L50 90Z', x1: 50, y1: 50, x2: 50, y2: 90, from: '#A8620F', to: '#7E430A' },
  { id: 'pav5', d: 'M68 50L84 46L50 90Z', x1: 50, y1: 46, x2: 50, y2: 90, from: '#D9A24A', to: '#9E5A12' },
  { id: 'pav6', d: 'M84 46L94 42L50 90Z', x1: 50, y1: 42, x2: 50, y2: 90, from: '#8F4C0B', to: '#6E3A08' },
];

const FACETS: readonly Facet[] = [...CROWN, ...PAVILION];

/** Силуэт камня и рёбра граней для одноцветного варианта. */
const MONO_OUTLINE = 'M26 15L74 15L90 27L94 42L50 90L6 42L10 27Z';
const MONO_EDGES =
  'M6 42L16 46L32 50L50 52L68 50L84 46L94 42' +
  'M32 21L68 21L78 34L50 37L22 34Z' +
  'M26 15L32 21M74 15L68 21M10 27L22 34M90 27L78 34' +
  'M22 34L16 46M78 34L84 46M50 37L50 52' +
  'M16 46L50 90M32 50L50 90M68 50L50 90M84 46L50 90';

const BRAND_TITLE = 'Бриллиант Ремонт';

type MarkProps = {
  mono: boolean;
  decorative: boolean;
  titleId: string;
  gradientPrefix: string;
  className: string;
};

function Mark({ mono, decorative, titleId, gradientPrefix, className }: MarkProps) {
  const a11y = decorative
    ? ({ 'aria-hidden': true, focusable: 'false' } as const)
    : ({ role: 'img', 'aria-labelledby': titleId } as const);

  if (mono) {
    return (
      <svg viewBox="0 0 100 100" className={className} {...a11y}>
        <title id={titleId}>{BRAND_TITLE}</title>
        <path d={MONO_OUTLINE} fill="currentColor" fillOpacity="0.16" />
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={MONO_OUTLINE} />
        </g>
        <path
          d={MONO_EDGES}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" className={className} {...a11y}>
      <title id={titleId}>{BRAND_TITLE}</title>
      <defs>
        {FACETS.map((facet) => (
          <linearGradient
            key={facet.id}
            id={`${gradientPrefix}${facet.id}`}
            gradientUnits="userSpaceOnUse"
            x1={facet.x1}
            y1={facet.y1}
            x2={facet.x2}
            y2={facet.y2}
          >
            <stop offset="0" stopColor={facet.from} />
            <stop offset="1" stopColor={facet.to} />
          </linearGradient>
        ))}
      </defs>
      {FACETS.map((facet) => {
        const paint = `url(#${gradientPrefix}${facet.id})`;
        return (
          <path
            key={facet.id}
            d={facet.d}
            fill={paint}
            stroke={paint}
            strokeWidth="0.4"
            strokeLinejoin="round"
          />
        );
      })}
    </svg>
  );
}

/**
 * Логотип «Бриллиант Ремонт». Слогана у бренда нет: только «БРИЛЛИАНТ»
 * крупно и «РЕМОНТ» под ним с широким трекингом — как на визитке.
 * Проп withSlogan принимается ради единого API и ничего не добавляет.
 */
export function LogoRemont({ variant = 'full', className = '' }: LogoProps) {
  const uid = useId();
  const titleId = `${uid}title`;
  const gradientPrefix = `${uid}gem-`.replace(/[^a-zA-Z0-9_-]/g, '');

  if (variant !== 'full') {
    return (
      <Mark
        mono={variant === 'mono'}
        decorative={false}
        titleId={titleId}
        gradientPrefix={gradientPrefix}
        className={className || 'h-10 w-10'}
      />
    );
  }

  return (
    <span className={`inline-flex items-center gap-3 ${className}`.trim()}>
      <Mark
        mono={false}
        decorative
        titleId={titleId}
        gradientPrefix={gradientPrefix}
        className="h-11 w-11 shrink-0"
      />
      <span className="flex flex-col justify-center">
        <span className="font-display text-[1.45rem] font-black uppercase leading-none tracking-[-0.02em] text-fg">
          Бриллиант
        </span>
        <span className="font-display text-[0.72rem] font-bold uppercase leading-none tracking-[0.2em] text-fg-muted mt-[0.45em]">
          Ремонт
        </span>
      </span>
    </span>
  );
}

export default LogoRemont;
