import { type ReactNode } from 'react';

type DiamondProps = {
  children?: ReactNode;
  /** split — фирменный красно-бирюзовый раскол, accent — цвет бренда, outline — контур. */
  variant?: 'split' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const SIZE: Record<NonNullable<DiamondProps['size']>, string> = {
  sm: 'size-9',
  md: 'size-12',
  lg: 'size-16',
};

const ICON_SIZE: Record<NonNullable<DiamondProps['size']>, string> = {
  sm: '[&_svg]:size-4',
  md: '[&_svg]:size-5',
  lg: '[&_svg]:size-7',
};

/** Ромб рисуем обрезкой, а не поворотом: у rotate(45°) рамка шире на 41 %,
 *  и это давало горизонтальную прокрутку на узких экранах. */
const CLIP = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';

/**
 * Ромб — фирменный контейнер иконки: квадрат под 45°, содержимое не повёрнуто.
 * Раскол по горизонтали (верх красный, низ бирюзовый) повторяет знак ООО.
 */
export function Diamond({
  children,
  variant = 'outline',
  size = 'md',
  className = '',
}: DiamondProps) {
  const frameStyle =
    variant === 'split'
      ? 'linear-gradient(to bottom, var(--color-red) 0 50%, var(--color-teal) 50% 100%)'
      : variant === 'accent'
        ? 'var(--accent)'
        : 'var(--accent)';

  // outline — тонкая рамка: внешний ромб красим акцентом, внутренний вырезаем фоном
  const innerInset = variant === 'outline' ? 'inset-[2px]' : 'inset-[3px]';
  const needsCutout = variant !== 'accent';

  return (
    <span
      className={`relative inline-grid ${SIZE[size]} shrink-0 place-items-center ${className}`}
      aria-hidden="true"
    >
      <span
        className="absolute inset-0"
        style={{ clipPath: CLIP, background: frameStyle }}
      />
      {needsCutout ? (
        <span
          className={`absolute ${innerInset} bg-[var(--surface)]`}
          style={{ clipPath: CLIP }}
        />
      ) : null}
      <span
        className={`relative grid place-items-center ${ICON_SIZE[size]} ${
          variant === 'accent' ? 'text-accent-fg' : 'text-accent-ink'
        }`}
      >
        {children}
      </span>
    </span>
  );
}
