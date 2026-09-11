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
            Качество <span className="text-[var(--color-red)]">•</span> Надёжность{' '}
            <span className="text-[var(--color-red)]">•</span> Доверие
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
            <span
              className="pointer-events-none absolute -right-6 top-0 h-full w-24 rotate-[12deg] bg-gradient-to-b from-[var(--color-gold-bright)] via-[var(--color-gold)] to-transparent opacity-25 transition-opacity duration-300 group-hover:opacity-45"
              aria-hidden="true"
            />
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
              className="pointer-events-none absolute -left-6 top-0 h-full w-24 -rotate-[12deg] bg-gradient-to-b from-[var(--color-red)] to-[var(--color-teal)] opacity-20 transition-opacity duration-300 group-hover:opacity-35"
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
