import { Fragment, useId } from 'react';

/**
 * Знак «ДезГарант»: общий с ООО ромб (красный верх, бирюзовый низ),
 * внутри — геральдический щит с диагональной полосой и двумя микробами.
 * Геометрия снята по пикселям с docs/brand/logo-dezgarant-belye-niti-dark.jpg.
 */

export type LogoProps = {
  /** full — знак и текст, mark — только знак, mono — одноцветный знак currentColor. */
  variant?: 'full' | 'mark' | 'mono';
  className?: string;
  withSlogan?: boolean;
};

export type LogoDezgarantProps = LogoProps & {
  /** Щит на контрастной плашке: рисуется цветом фона, а не текста. */
  inverted?: boolean;
};

/** Ромб: квадрат под 45°, разрез по боковым вершинам, обводка ≈14 % стороны. */
const DIAMOND_TOP = 'M50 4L96 50L83.1 50L50 17.1L16.9 50L4 50Z';
const DIAMOND_BOTTOM = 'M50 96L4 50L16.9 50L50 82.9L83.1 50L96 50Z';
const DIAMOND_RING = 'M50 4L96 50L50 96L4 50ZM50 17.1L16.9 50L50 82.9L83.1 50Z';

/** Средняя линия обводки щита: пологий щипец сверху, острый низ. */
const SHIELD =
  'M50 30.5Q58 37.8 67.2 41.6Q69.9 42.7 69.9 45.6L69.9 56.2' +
  'C69.9 61.1 68.4 65.5 65.3 69.4C61.5 74.2 56.4 78.1 50 81.2' +
  'C43.6 78.1 38.5 74.2 34.7 69.4C31.6 65.5 30.1 61.1 30.1 56.2' +
  'L30.1 45.6Q30.1 42.7 32.8 41.6Q42 37.8 50 30.5Z';

/** Внутреннее поле щита — им подрезается диагональная полоса. */
const SHIELD_FIELD =
  'M50 33.3Q57.1 39.8 65.2 43.2Q67.6 44.2 67.6 46.8L67.6 56.3' +
  'C67.6 60.6 66.3 64.6 63.5 68C60.2 72.3 55.7 75.8 50 78.6' +
  'C44.3 75.8 39.8 72.3 36.5 68C33.7 64.6 32.4 60.6 32.4 56.3' +
  'L32.4 46.8Q32.4 44.2 34.8 43.2Q42.9 39.8 50 33.3Z';

/** Полоса, перечёркивающая щит из левого низа в правый верх. */
const SHIELD_BAND = 'M23.5 76.2L71.5 40.2';

const MICROBE_BODY =
  'M-4.6-1.8C-4.9-4.2-3-5.6-0.8-5.2C0.6-5 1.4-4 2.6-4.2' +
  'C4.6-4.5 5.8-2.6 5.2-0.6C4.7 1.2 5.4 2.4 4.6 3.6' +
  'C3.5 5.3 1.2 5.6-0.6 4.8C-2 4.2-3.6 4.4-4.4 3' +
  'C-5.3 1.5-4.4 0.2-4.6-1.8Z';

const MICROBE_LEGS =
  'M-4.4-2.2L-7.4-3.6M0.2-5.2L0.6-8.2M5.1-1.4L8.2-2.2M4.2 3.8L6.4 6.2M-2.6 4.7L-3.4 7.6';

const MICROBE_DOTS: readonly [number, number, number][] = [
  [-8.1, -4, 1.1],
  [0.7, -8.9, 1],
  [8.9, -2.4, 1],
  [7, 6.9, 0.9],
  [-3.6, 8.3, 1],
  [-8.2, 2.6, 1.2],
  [6.2, -6.2, 0.9],
];

const SLOGAN_PARTS = ['Дезинфекция', 'Гарантия', 'Чистота'] as const;

const BRAND_TITLE = 'ДезГарант — дезинфекция, дезинсекция, дератизация';

function Microbe({ x, y, scale, color }: { x: number; y: number; scale: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill={color}>
      <path d={MICROBE_BODY} />
      <path d={MICROBE_LEGS} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {MICROBE_DOTS.map(([cx, cy, r]) => (
        <circle key={`${cx}:${cy}`} cx={cx} cy={cy} r={r} />
      ))}
    </g>
  );
}

type MarkProps = {
  mono: boolean;
  inverted: boolean;
  decorative: boolean;
  titleId: string;
  clipId: string;
  className: string;
};

function Mark({ mono, inverted, decorative, titleId, clipId, className }: MarkProps) {
  const shield = mono ? 'currentColor' : inverted ? 'var(--bg)' : 'var(--fg)';
  const microbe = mono ? 'currentColor' : 'var(--color-teal)';
  const a11y = decorative
    ? ({ 'aria-hidden': true, focusable: 'false' } as const)
    : ({ role: 'img', 'aria-labelledby': titleId } as const);

  return (
    <svg viewBox="0 0 100 100" className={className} {...a11y}>
      <title id={titleId}>{BRAND_TITLE}</title>
      <defs>
        <clipPath id={clipId}>
          <path d={SHIELD_FIELD} />
        </clipPath>
      </defs>
      {mono ? (
        <path d={DIAMOND_RING} fill="currentColor" fillRule="evenodd" />
      ) : (
        <>
          <path d={DIAMOND_TOP} fill="var(--color-red)" />
          <path d={DIAMOND_BOTTOM} fill="var(--color-teal)" />
        </>
      )}
      <path
        d={SHIELD}
        fill="none"
        stroke={shield}
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g clipPath={`url(#${clipId})`}>
        <path d={SHIELD_BAND} fill="none" stroke={shield} strokeWidth="5" />
        <Microbe x={45.2} y={48.6} scale={0.82} color={microbe} />
        <Microbe x={56} y={65.4} scale={0.76} color={microbe} />
      </g>
    </svg>
  );
}

function Slogan() {
  return (
    <span className="font-display text-[0.58rem] font-bold uppercase leading-tight tracking-[0.15em] text-teal-ink">
      {SLOGAN_PARTS.map((part, index) => (
        <Fragment key={part}>
          {index > 0 ? (
            <span aria-hidden="true" className="mx-[0.5em] text-red">
              •
            </span>
          ) : null}
          {part}
        </Fragment>
      ))}
    </span>
  );
}

/**
 * Логотип «ДезГарант». Wordmark — живой текст (Montserrat 900), не кривые.
 * Слоган: бирюзовые слова, красный разделитель — как в исходном знаке.
 */
export function LogoDezgarant({
  variant = 'full',
  className = '',
  withSlogan = false,
  inverted = false,
}: LogoDezgarantProps) {
  const uid = useId();
  const titleId = `${uid}title`;
  const clipId = `${uid}shield`.replace(/[^a-zA-Z0-9_-]/g, '');

  if (variant !== 'full') {
    return (
      <Mark
        mono={variant === 'mono'}
        inverted={inverted}
        decorative={false}
        titleId={titleId}
        clipId={clipId}
        className={className || 'h-10 w-10'}
      />
    );
  }

  return (
    <span className={`inline-flex items-center gap-3 ${className}`.trim()}>
      <Mark
        mono={false}
        inverted={inverted}
        decorative
        titleId={titleId}
        clipId={clipId}
        className="h-11 w-11 shrink-0"
      />
      <span className="flex flex-col justify-center">
        <span className="font-display text-[1.5rem] font-black uppercase leading-none tracking-[-0.02em] text-fg">
          ДезГарант
        </span>
        {withSlogan ? (
          <span className="mt-[0.45em] block">
            <Slogan />
          </span>
        ) : null}
      </span>
    </span>
  );
}

export default LogoDezgarant;
