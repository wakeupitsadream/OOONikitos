'use client';

import { useState } from 'react';
import Image from 'next/image';

type BeforeAfterProps = {
  /** Фото до работ. Нет файла — компонент не рендерится. */
  beforeSrc?: string | null;
  /** Фото после работ. */
  afterSrc?: string | null;
  /** Описание кадра для незрячих: что именно на снимке. */
  alt: string;
  /** Стартовое положение линии сравнения, % от левого края. */
  initial?: number;
  className?: string;
};

/**
 * Слайдер «до/после»: два одинаковых кадра, верхний обрезается по линии.
 * Линию двигает нативный input[type=range] — значит, работает и мышью,
 * и пальцем, и стрелками с клавиатуры без единой строчки кода на события.
 */
export function BeforeAfter({
  beforeSrc,
  afterSrc,
  alt,
  initial = 50,
  className = '',
}: BeforeAfterProps) {
  const [position, setPosition] = useState(Math.min(100, Math.max(0, initial)));

  // Честный фолбэк: без обоих кадров сравнивать нечего.
  if (!beforeSrc || !afterSrc) return null;

  return (
    <figure className={`m-0 ${className}`}>
      <div className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface-2">
        <Image
          src={beforeSrc}
          alt={`${alt} — до работ`}
          fill
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 0 0 ${position}%)` }}
          aria-hidden="true"
        >
          <Image
            src={afterSrc}
            alt=""
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
          />
        </div>

        {/* Линия раздела и маркер: чисто декоративные, тянет их input ниже */}
        <span
          className="pointer-events-none absolute inset-y-0 w-px bg-accent"
          style={{ left: `${position}%` }}
          aria-hidden="true"
        />

        <span className="pointer-events-none absolute left-3 top-3 rounded-[var(--radius-xs)] bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] px-2.5 py-1 text-xs font-semibold">
          До
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-[var(--radius-xs)] bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] px-2.5 py-1 text-xs font-semibold text-accent-ink">
          После
        </span>

        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label={`Сравнение до и после: ${alt}. Стрелками влево и вправо двигайте линию`}
          aria-valuetext={`Видно ${100 - position}% кадра «после»`}
          className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent [&::-moz-range-thumb]:size-11 [&::-moz-range-thumb]:cursor-ew-resize [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-accent [&::-moz-range-thumb]:bg-[color-mix(in_srgb,var(--bg)_75%,transparent)] [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:size-11 [&::-webkit-slider-thumb]:cursor-ew-resize [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-accent [&::-webkit-slider-thumb]:bg-[color-mix(in_srgb,var(--bg)_75%,transparent)]"
        />
      </div>
      <figcaption className="mt-3 text-sm text-fg-muted">{alt}</figcaption>
    </figure>
  );
}
