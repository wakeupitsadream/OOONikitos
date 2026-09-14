import { ArrowRight } from 'lucide-react';
import { COMPANY } from '@/content/company';
import { DIRECTIONS } from '@/content/umbrella/directions';
import { siteUrl } from '@/lib/site';
import { Container } from '@/components/ui/Container';
import { OblastOutline } from '@/components/brand/OblastOutline';

/**
 * Hero зонтичного сайта: диагональный раскол показывает два бренда
 * одной компании — слева отделка (чёрное с золотом), справа обработка
 * (светлое с бирюзой). Это буквальный перевод структуры ООО в картинку.
 */
export function HeroSplit() {
  const [remont, dezgarant] = DIRECTIONS;

  return (
    <section className="relative overflow-hidden border-b border-border bg-black text-white">
      <div className="absolute inset-0 opacity-[0.07]" aria-hidden="true">
        <OblastOutline className="h-full w-full text-white" strokeWidth={1.2} />
      </div>

      <Container className="relative py-16 md:py-24 lg:py-28">
        <div className="max-w-3xl">
          <p className="eyebrow rise text-[var(--color-teal)]" style={{ '--rise-delay': '0ms' } as React.CSSProperties}>
            {COMPANY.shortLegalName}
          </p>
          <h1
            className="display-xl rise mt-4"
            style={{ '--rise-delay': '90ms' } as React.CSSProperties}
          >
            Создаём.
            <br />
            Ремонтируем.
            <br />
            <span className="text-[var(--color-teal)]">Защищаем.</span>
          </h1>
          <p
            className="rise mt-6 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl"
            style={{ '--rise-delay': '170ms' } as React.CSSProperties}
          >
            {COMPANY.lead}
          </p>
          <p
            className="eyebrow rise mt-6 text-white/45"
            style={{ '--rise-delay': '230ms' } as React.CSSProperties}
          >
            {/* Неразрывный пробел перед точкой: перенос строки не оставляет её висеть в начале */}
            Качество{' '}
            <span className="text-[var(--brand-dot)]">•</span> Надёжность{' '}
            <span className="text-[var(--brand-dot)]">•</span> Доверие
          </p>
        </div>

        <div
          className="rise mt-12 grid gap-4 md:mt-16 md:grid-cols-2 md:gap-5"
          style={{ '--rise-delay': '300ms' } as React.CSSProperties}
        >
          {/* Бриллиант Ремонт: чёрное с золотом */}
          <a
            href={siteUrl(remont.site)}
            className="group relative overflow-hidden rounded-[var(--radius-md)] border border-white/12 bg-[#121110] p-7 transition-colors duration-300 hover:border-[var(--color-gold)] md:p-9"
          >
            <svg
              className="pointer-events-none absolute inset-y-0 right-0 h-full w-28 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
              viewBox="0 0 112 320"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="hero-crack" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-gold-bright)" />
                  <stop offset="55%" stopColor="var(--color-gold)" />
                  <stop offset="100%" stopColor="var(--color-gold-deep)" />
                </linearGradient>
              </defs>
              {/* Ломаная «трещина» с оборота визитки: тонкая линия, не пятно */}
              <path
                d="M96 -10L66 78L84 104L48 196L64 224L30 330"
                stroke="url(#hero-crack)"
                strokeWidth="5"
                fill="none"
                strokeLinejoin="miter"
              />
            </svg>
            <p className="eyebrow text-[var(--color-gold)]">{remont.tagline}</p>
            <p className="display-md mt-3 text-white">{remont.name}</p>
            <p className="mt-3 max-w-sm text-[0.9375rem] text-white/65">{remont.description}</p>
            <span className="mt-7 inline-flex items-center gap-2 font-display text-base font-extrabold text-[var(--color-gold)]">
              {remont.cta}
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </a>

          {/* ДезГарант: светлое с бирюзой */}
          <a
            href={siteUrl(dezgarant.site)}
            className="group relative overflow-hidden rounded-[var(--radius-md)] border border-transparent bg-[#fafaf9] p-7 text-[#102328] transition-colors duration-300 hover:border-[var(--color-teal)] md:p-9"
          >
            <span
              className="pointer-events-none absolute inset-y-0 left-0 w-2 bg-[linear-gradient(to_bottom,var(--color-red)_0_45%,var(--color-teal)_45%_100%)]"
              aria-hidden="true"
            />
            <p className="eyebrow text-[var(--color-teal-ink)]">{dezgarant.tagline}</p>
            <p className="display-md mt-3">{dezgarant.name}</p>
            <p className="mt-3 max-w-sm text-[0.9375rem] text-[#102328]/70">
              {dezgarant.description}
            </p>
            <span className="mt-7 inline-flex items-center gap-2 font-display text-base font-extrabold text-[var(--color-teal-ink)]">
              {dezgarant.cta}
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </a>
        </div>
      </Container>
    </section>
  );
}
