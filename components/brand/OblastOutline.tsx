import { useId } from 'react';

/**
 * Контур Оренбургской области — фоновый мотив айдентики (он же на логотипах).
 * Упрощённый силуэт из 101 опорной точки: северо-западный выступ (Бугуруслан),
 * узкая «талия» у Кувандыка, восточная доля с Орском и Гаем, южный выступ
 * Соль-Илецка. Координаты пересчитаны из градусов в равнопромежуточной
 * проекции с поправкой на широту 52,6°, поэтому пропорции близки к карте.
 */

export const OBLAST_VIEWBOX = { width: 1000, height: 548 } as const;

/** Длина контура в единицах viewBox — для stroke-dasharray. */
const OUTLINE_LENGTH = 2990;

const OBLAST_PATH =
  'M133.3 56L156.3 21.2L188.4 3L220.6 0L252.8 18.2L280.3 42.4L303.3 54.5L335.5 48.4' +
  'L355.7 66.6L374.1 57.5L399.8 84.8L420 78.7L436.6 99.9L468.8 121.1L484.4 115L496.3 139.3' +
  'L523.9 163.5L539.5 157.4L551.5 187.7L574.4 218L592.8 248.3L609.4 242.2L611.2 278.5' +
  'L629.6 308.8L649.8 339.1L664.5 333L671 367.9L689.3 384.5L707.7 387.5L726.1 375.4' +
  'L744.5 360.3L762.9 345.1L781.2 317.9L799.6 290.7L827.2 269.5L854.8 251.3L882.4 236.2' +
  'L907.2 260.4L916.4 302.8L925.6 348.2L942.1 381.5L960.5 411.8L971.5 445.1L988.1 472.3' +
  'L1000 496.5L977 523.8L949.4 532.9L921.9 517.7L894.3 508.6L866.7 517.7L839.2 526.8' +
  'L811.6 517.7L784 508.6L765.6 499.6L747.2 511.7L728.9 520.8L710.5 508.6L692.1 493.5' +
  'L673.7 502.6L655.3 517.7L627.8 526.8L600.2 511.7L572.6 517.7L545 526.8L517.5 517.7' +
  'L489.9 508.6L462.3 517.7L443.9 526.8L425.6 541.9L404.4 548L381.4 538.9L361.2 523.8' +
  'L342.8 502.6L321.7 481.4L300.6 466.3L278.5 457.2L250.9 449.6L223.3 442L195.8 442' +
  'L168.2 434.5L140.6 429.9L113.1 433L85.5 442L57.9 451.1L30.3 454.1L0 449.6L6.4 417.8' +
  'L34 408.7L61.6 399.6L89.2 393.6L116.7 387.5L140.6 375.4L153.5 351.2L149.8 305.8' +
  'L157.2 281.6L142.5 260.4L133.3 215L138.8 190.7L125.9 169.5L128.7 127.2L133.3 90.8Z';

export type OblastCity = {
  name: string;
  /** Доля ширины viewBox, % */
  x: number;
  /** Доля высоты viewBox, % */
  y: number;
  /** Опорные центры выезда — их можно подписывать на карте */
  major: boolean;
};

/** Опорные города для точек на карте: координаты в процентах viewBox. */
export const OBLAST_CITIES: readonly OblastCity[] = [
  { name: 'Оренбург', x: 41.8, y: 73.2, major: true },
  { name: 'Орск', x: 73.6, y: 88.7, major: true },
  { name: 'Новотроицк', x: 71.3, y: 89, major: false },
  { name: 'Бузулук', x: 15.7, y: 45.3, major: true },
  { name: 'Бугуруслан', x: 17.4, y: 21.3, major: false },
  { name: 'Соль-Илецк', x: 40.8, y: 90.1, major: false },
  { name: 'Гай', x: 72.5, y: 81.8, major: false },
  { name: 'Сорочинск', x: 24, y: 55, major: false },
];

export type OblastOutlineProps = {
  className?: string;
  strokeWidth?: number;
  /** Контур прорисовывается линией; при prefers-reduced-motion показывается сразу. */
  animated?: boolean;
  /**
   * По умолчанию контур — водяной знак и скрыт от скринридеров.
   * decorative={false} делает его картинкой с подписью.
   */
  decorative?: boolean;
};

/** Контур Оренбургской области. Цвет линии берётся из currentColor. */
export function OblastOutline({
  className = '',
  strokeWidth = 2,
  animated = false,
  decorative = true,
}: OblastOutlineProps) {
  const uid = useId();
  const safeId = uid.replace(/[^a-zA-Z0-9_-]/g, '');
  const pathId = `oblast-${safeId}`;
  const titleId = `${pathId}-title`;

  const a11y = decorative
    ? ({ 'aria-hidden': true, focusable: 'false' } as const)
    : ({ role: 'img', 'aria-labelledby': titleId } as const);

  const drawCss = `@media (prefers-reduced-motion: no-preference){
#${pathId}{stroke-dasharray:${OUTLINE_LENGTH};stroke-dashoffset:${OUTLINE_LENGTH};animation:${pathId}-draw 2.8s cubic-bezier(0.16,0.84,0.3,1) forwards}
@keyframes ${pathId}-draw{to{stroke-dashoffset:0}}}`;

  return (
    <svg
      viewBox={`0 0 ${OBLAST_VIEWBOX.width} ${OBLAST_VIEWBOX.height}`}
      className={className || undefined}
      fill="none"
      {...a11y}
    >
      <title id={titleId}>Оренбургская область</title>
      {animated ? <style>{drawCss}</style> : null}
      <path
        id={pathId}
        d={OBLAST_PATH}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default OblastOutline;
