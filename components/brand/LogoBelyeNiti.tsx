import { Fragment, useId } from 'react';

/**
 * Знак ООО «Белые Нити»: ромб с красным верхом и бирюзовым низом,
 * внутри — пиктограмма здания (центральная башня с сеткой окон и два крыла).
 * Геометрия снята по пикселям с docs/brand/logo-dezgarant-belye-niti-dark.jpg.
 */

export type LogoProps = {
  /** full — знак и текст, mark — только знак, mono — одноцветный знак currentColor. */
  variant?: 'full' | 'mark' | 'mono';
  className?: string;
  withSlogan?: boolean;
};

export type LogoBelyeNitiProps = LogoProps & {
  /** Знак внутри ромба на контрастной плашке: рисуется цветом фона, а не текста. */
  inverted?: boolean;
};

/** Ромб: квадрат под 45°, разрез по боковым вершинам, обводка ≈14 % стороны. */
const DIAMOND_TOP = 'M50 4L96 50L83.1 50L50 17.1L16.9 50L4 50Z';
const DIAMOND_BOTTOM = 'M50 96L4 50L16.9 50L50 82.9L83.1 50L96 50Z';
const DIAMOND_RING = 'M50 4L96 50L50 96L4 50ZM50 17.1L16.9 50L50 82.9L83.1 50Z';

/** Здание: центральная башня с двускатным верхом и два боковых крыла. */
const TOWER = 'M38.3 72.7V41.9L50 28.9L61.7 41.9V72.7';
const WING_LEFT = 'M23 56.2L31.5 44.6L39 55';
const WING_RIGHT = 'M77 56.2L68.5 44.6L61 55';
const WINDOWS =
  'M43.7 44.8h4.9v4.4h-4.9ZM51.3 44.8h4.9v4.4h-4.9Z' +
  'M43.7 50.4h4.9v4.4h-4.9ZM51.3 50.4h4.9v4.4h-4.9Z' +
  'M43.7 56h4.9v4.4h-4.9ZM51.3 56h4.9v4.4h-4.9Z' +
  'M43.7 61.6h4.9v4.4h-4.9ZM51.3 61.6h4.9v4.4h-4.9Z' +
  'M43.7 67.2h4.9v4.4h-4.9ZM51.3 67.2h4.9v4.4h-4.9Z';

const SLOGAN_PARTS = ['Качество', 'Надёжность', 'Доверие'] as const;

const BRAND_TITLE = 'ООО «Белые Нити»';

type MarkProps = {
  mono: boolean;
  inverted: boolean;
  decorative: boolean;
  titleId: string;
  className: string;
};

function Mark({ mono, inverted, decorative, titleId, className }: MarkProps) {
  const figure = mono ? 'currentColor' : inverted ? 'var(--bg)' : 'var(--fg)';
  const a11y = decorative
    ? ({ 'aria-hidden': true, focusable: 'false' } as const)
    : ({ role: 'img', 'aria-labelledby': titleId } as const);

  return (
    <svg viewBox="0 0 100 100" className={className} {...a11y}>
      <title id={titleId}>{BRAND_TITLE}</title>
      {mono ? (
        <path d={DIAMOND_RING} fill="currentColor" fillRule="evenodd" />
      ) : (
        <>
          <path d={DIAMOND_TOP} fill="var(--color-red)" />
          <path d={DIAMOND_BOTTOM} fill="var(--color-teal)" />
        </>
      )}
      <g
        fill="none"
        stroke={figure}
        strokeWidth="3.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={TOWER} />
        <path d={WING_LEFT} />
        <path d={WING_RIGHT} />
      </g>
      <path d={WINDOWS} fill={figure} />
    </svg>
  );
}

function Slogan() {
  return (
    <span className="font-display text-[0.5rem] font-bold uppercase leading-tight tracking-[0.16em] text-fg-muted">
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
 * Логотип ООО «Белые Нити». Wordmark — живой текст (Montserrat 900),
 * не кривые: так он масштабируется и остаётся доступным поиску.
 */
export function LogoBelyeNiti({
  variant = 'full',
  className = '',
  withSlogan = false,
  inverted = false,
}: LogoBelyeNitiProps) {
  const titleId = useId();

  if (variant !== 'full') {
    return (
      <Mark
        mono={variant === 'mono'}
        inverted={inverted}
        decorative={false}
        titleId={titleId}
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
        className="h-11 w-11 shrink-0"
      />
      <span className="flex flex-col justify-center">
        <span className="font-display text-[1.3rem] font-black uppercase leading-none tracking-[-0.01em] text-fg">
          Белые Нити
        </span>
        <span className="font-display text-[0.6rem] font-bold uppercase leading-none tracking-[0.4em] text-fg-subtle mt-[0.35em]">
          ООО
        </span>
        {withSlogan ? (
          <span className="mt-[0.5em] block">
            <Slogan />
          </span>
        ) : null}
      </span>
    </span>
  );
}

export default LogoBelyeNiti;
