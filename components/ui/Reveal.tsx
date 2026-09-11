'use client';

import { useEffect, useRef, type ReactNode } from 'react';

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

type RevealProps = {
  children: ReactNode;
  /** Задержка появления в миллисекундах — для каскада внутри секции. */
  delay?: number;
  className?: string;
  /** Якорь для ссылок вида #zayavka. */
  id?: string;
};

/**
 * Мягкое появление секции при попадании в окно.
 * Состояние пишется прямо в data-атрибут: перерисовка React не нужна,
 * при prefers-reduced-motion переход отключается на уровне CSS.
 */
export function Reveal({ children, delay = 0, className = '', id }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const show = () => {
      node.dataset.visible = 'true';
    };
    if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) {
      show();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show();
            observer.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      className={`reveal ${className}`}
      data-visible="false"
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

type CounterProps = {
  value: number;
  suffix?: string;
  className?: string;
};

/**
 * Счётчик, добегающий до значения при появлении. Значение пишется в DOM
 * напрямую; при выключенной анимации и на сервере сразу видно итоговое число.
 */
export function Counter({ value, suffix = '', className = '' }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) return;

    const format = (n: number) => `${n.toLocaleString('ru-RU')}${suffix}`;
    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        const duration = 900;
        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          node.textContent = format(Math.round(value * eased));
          if (progress < 1) frame = requestAnimationFrame(step);
        };
        node.textContent = format(0);
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value, suffix]);

  return (
    <span ref={ref} className={`tabular ${className}`}>
      {value.toLocaleString('ru-RU')}
      {suffix}
    </span>
  );
}
