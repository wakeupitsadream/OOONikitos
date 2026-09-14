'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ROUTER_OPTIONS } from '@/content/umbrella/directions';
import { SITES } from '@/config/sites';
import { siteUrl } from '@/lib/site';

/**
 * Подбор направления: «что у вас» × «что нужно» → ссылка сразу на услугу.
 * Посетитель не должен угадывать, к какому из двух брендов идти.
 */
export function TaskRouter() {
  const [objectId, setObjectId] = useState(ROUTER_OPTIONS[0].id);
  const current = ROUTER_OPTIONS.find((option) => option.id === objectId) ?? ROUTER_OPTIONS[0];

  return (
    <div>
      {/* Обычные кнопки-переключатели, не ARIA-вкладки: панелей и стрелочной навигации здесь нет */}
      <div role="group" aria-label="Тип объекта" className="flex flex-wrap gap-2">
        {ROUTER_OPTIONS.map((option) => {
          const active = option.id === objectId;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => setObjectId(option.id)}
              className={`rounded-[var(--radius-sm)] border px-5 py-2.5 font-display text-[0.9375rem] font-extrabold transition-colors duration-150 ${
                active
                  ? 'border-accent bg-accent text-accent-fg'
                  : 'border-border-strong text-fg-muted hover:border-accent hover:text-fg'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2" aria-live="polite" aria-label="Подходящие услуги">
        {current.tasks.map((task) => (
          <li key={task.label}>
            <a
              href={siteUrl(task.site, task.href)}
              className="group flex items-center justify-between gap-4 rounded-[var(--radius-sm)] border border-border bg-surface px-5 py-4 transition-colors duration-150 hover:border-accent"
            >
              <span>
                <span className="block font-semibold">{task.label}</span>
                <span className="mt-0.5 block text-sm text-fg-subtle">
                  {SITES[task.site].shortName}
                </span>
              </span>
              <ArrowRight
                className="size-5 shrink-0 text-accent-ink transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
