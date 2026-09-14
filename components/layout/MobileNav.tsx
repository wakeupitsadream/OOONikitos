'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Menu, Phone, X } from 'lucide-react';
import { SITES, type SiteId } from '@/config/sites';
import { formatPhone, telHref } from '@/lib/phone';

type MobileNavProps = {
  site: SiteId;
  nav: { href: string; label: string }[];
  phone: string | null;
};

/** Мобильное меню: шторка снизу, закрывается по Esc, клику вне и переходу. */
export function MobileNav({ site, nav, phone }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const config = SITES[site];

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="grid size-11 place-items-center rounded-[var(--radius-sm)] border border-border-strong text-fg lg:hidden"
        aria-label="Открыть меню"
        aria-expanded={open}
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      {/*
        Шторка выносится порталом в body. У шапки backdrop-filter, а он делает
        шапку системой отсчёта для position: fixed — без портала меню
        позиционируется относительно шапки и уезжает за верхнюю кромку экрана.
      */}
      {open
        ? createPortal(
        <div
          // Портал уносит шторку из обёртки сайта, поэтому тему и акцент
          // приходится объявлять заново — иначе меню рендерится палитрой :root.
          data-theme={config.theme}
          data-accent={config.accent}
          className="fixed inset-0 z-[70] text-fg lg:hidden"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Закрыть меню"
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Меню сайта"
            className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto overscroll-contain rounded-t-[var(--radius-md)] border-t border-border bg-bg p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.6)]"
          >
            <div className="mb-5 flex items-center justify-between">
              <p className="eyebrow text-fg-subtle">{config.shortName}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-10 place-items-center rounded-[var(--radius-sm)] border border-border-strong"
                aria-label="Закрыть меню"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Меню сайта">
              <ul className="space-y-1">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block border-b border-border py-3.5 font-display text-lg font-extrabold"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {phone ? (
              <a
                href={telHref(phone)}
                data-ym="phone_click"
                className="mt-6 flex h-14 items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-accent font-display text-lg font-extrabold text-accent-fg"
              >
                <Phone className="size-5" aria-hidden="true" />
                {formatPhone(phone)}
              </a>
            ) : null}
          </div>
        </div>,
            document.body,
          )
        : null}
    </>
  );
}
