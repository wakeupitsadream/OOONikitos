import Link from 'next/link';
import { ArrowRight, Award, Home as HomeIcon, ShieldCheck } from 'lucide-react';
import { COMPANY, LICENSE } from '@/content/company';
import { DEZGARANT_PHONE } from '@/content/dezgarant/contacts';
import { formatPhone, telHref } from '@/lib/phone';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Diamond } from '@/components/ui/Diamond';
import { OblastOutline } from '@/components/brand/OblastOutline';

/** Три знака доверия с оборота визитки — дословно. */
const BADGES = [
  { icon: ShieldCheck, title: 'Эффективно и безопасно' },
  { icon: Award, title: 'Гарантия результата' },
  { icon: HomeIcon, title: 'Чистота и комфорт' },
];

export function HeroDez() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-bg">
      <div
        className="pointer-events-none absolute -right-24 top-0 h-full w-[55%] opacity-[0.06] lg:opacity-[0.1]"
        aria-hidden="true"
      >
        <OblastOutline className="h-full w-full text-[var(--color-teal)]" strokeWidth={1.4} animated />
      </div>

      <Container className="relative py-14 md:py-20">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="plate">{COMPANY.region}</Badge>
          <Badge variant="quiet">Работаем с физическими и юридическими лицами</Badge>
        </div>

        <h1
          className="display-xl rise mt-6 max-w-4xl"
          style={{ '--rise-delay': '60ms' } as React.CSSProperties}
        >
          Уничтожение насекомых и грызунов в Оренбурге — с гарантией и по лицензии
        </h1>

        <p
          className="lead rise mt-5 max-w-2xl"
          style={{ '--rise-delay': '140ms' } as React.CSSProperties}
        >
          Тараканы, клопы, муравьи, грызуны, клещи, плесень и запахи. Работаем по договору,
          выдаём акт, даём гарантию с бесплатной повторной обработкой.
        </p>

        <div
          className="rise mt-8 flex flex-wrap gap-3"
          style={{ '--rise-delay': '210ms' } as React.CSSProperties}
        >
          <Button href="#raschet" size="lg">
            Рассчитать за 30 секунд
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
          {DEZGARANT_PHONE ? (
            <Button href={telHref(DEZGARANT_PHONE)} variant="secondary" size="lg">
              {formatPhone(DEZGARANT_PHONE)}
            </Button>
          ) : null}
        </div>

        <div
          className="rise mt-10 grid gap-4 sm:grid-cols-3"
          style={{ '--rise-delay': '280ms' } as React.CSSProperties}
        >
          {BADGES.map(({ icon: Icon, title }) => (
            <div key={title} className="flex items-center gap-3">
              <Diamond variant="accent" size="md">
                <Icon aria-hidden="true" />
              </Diamond>
              <p className="font-display text-[0.9375rem] font-extrabold leading-tight">{title}</p>
            </div>
          ))}
        </div>

        <p
          className="rise mt-8 border-t border-border pt-5 text-sm text-fg-muted"
          style={{ '--rise-delay': '340ms' } as React.CSSProperties}
        >
          Лицензия Роспотребнадзора{' '}
          <span className="whitespace-nowrap font-semibold text-fg">ЕРУЛ № {LICENSE.erul}</span>.{' '}
          <Link href="/licenziya" className="underline underline-offset-4 hover:text-accent-ink">
            Почему это важно
          </Link>
        </p>
      </Container>
    </section>
  );
}
