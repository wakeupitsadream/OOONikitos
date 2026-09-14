import { ArrowRight, MessageCircle } from 'lucide-react';
import { COMPANY } from '@/content/company';
import { REMONT_MESSENGER, REMONT_PHONE } from '@/content/remont/contacts';
import { formatPhone, telHref } from '@/lib/phone';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LogoRemont } from '@/components/brand/LogoRemont';
import { IconLevel, IconRoller, IconTrowel } from '@/components/icons';

/**
 * Hero «Бриллиант Ремонт»: чёрный фон, золотая «трещина»-молния с оборота
 * визитки и мраморная панель-визитка справа. Ни одной цифры, которой нет
 * в подтверждённых данных: факты — только то, что напечатано на визитке
 * и закреплено договором.
 */

/** Три обещания с оборота визитки — дословно. */
const PROMISES = [
  { icon: IconTrowel, title: 'Ровные стены под обои', text: 'Плоскость по маякам, проверка правилом' },
  { icon: IconLevel, title: 'Понятные сроки', text: 'Срок считаем от площади и состава работ' },
  { icon: IconRoller, title: 'Фиксированная смета', text: 'Стоимость закрепляем договором до старта' },
];

/** Тонкая ломаная «трещина» по диагонали — графика с оборота визитки. */
function GoldCrack() {
  return (
    <svg
      // На узком экране ломаная уходит к правому краю и гаснет: иначе она
      // режет заголовок, который на 375 px занимает всю ширину.
      className="pointer-events-none absolute inset-0 h-full w-full translate-x-[30%] opacity-50 md:translate-x-0 md:opacity-100"
      viewBox="0 0 1200 700"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="remont-hero-crack" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-gold-bright)" />
          <stop offset="45%" stopColor="var(--color-gold)" />
          <stop offset="100%" stopColor="var(--color-gold-deep)" />
        </linearGradient>
      </defs>
      <path
        d="M980 -20L864 150L900 208L742 372L784 430L600 620L640 720"
        fill="none"
        stroke="url(#remont-hero-crack)"
        strokeWidth="3"
        strokeLinejoin="miter"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M900 208L960 268M784 430L846 470M864 150L806 128"
        fill="none"
        stroke="url(#remont-hero-crack)"
        strokeWidth="1.5"
        opacity="0.6"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function HeroRemont() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-bg">
      <GoldCrack />

      <Container className="relative py-12 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="quiet">{COMPANY.city} и область</Badge>
              <Badge variant="quiet">Работаем по договору</Badge>
            </div>

            {/* Ключевой запрос держим в H1, обещание выносим строкой ниже:
                в шесть строк дисплейным кеглем заголовок давил всю страницу. */}
            <h1
              className="display-xl rise mt-6"
              style={{ '--rise-delay': '60ms' } as React.CSSProperties}
            >
              Штукатурка и отделка стен в Оренбурге
            </h1>

            <p
              className="display-md rise mt-4 text-accent"
              style={{ '--rise-delay': '100ms' } as React.CSSProperties}
            >
              Ровно, в срок, по фиксированной смете
            </p>

            <p
              className="lead rise mt-5 max-w-xl"
              style={{ '--rise-delay': '140ms' } as React.CSSProperties}
            >
              Идеальная поверхность под обои и покраску. Считаем площадь стен честно — по
              периметру и высоте, за вычетом окон и дверей.
            </p>

            <div
              className="rise mt-8 flex flex-wrap gap-3"
              style={{ '--rise-delay': '210ms' } as React.CSSProperties}
            >
              <Button href="#raschet" size="lg">
                Рассчитать стены
                <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
              </Button>
              {REMONT_MESSENGER ? (
                <Button
                  href={REMONT_MESSENGER.url}
                  variant="secondary"
                  size="lg"
                >
                  <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
                  {REMONT_MESSENGER.label}
                </Button>
              ) : null}
            </div>

            {REMONT_PHONE ? (
              <p
                className="rise mt-6 text-sm text-fg-muted"
                style={{ '--rise-delay': '260ms' } as React.CSSProperties}
              >
                Или позвоните:{' '}
                <a
                  href={telHref(REMONT_PHONE)}
                  data-ym="phone_click"
                  className="font-display text-[1.0625rem] font-extrabold tracking-tight text-fg transition-colors hover:text-accent-ink"
                >
                  {formatPhone(REMONT_PHONE)}
                </a>
              </p>
            ) : null}

            <ul
              className="rise mt-9 grid gap-4 border-t border-border pt-7 sm:grid-cols-3"
              style={{ '--rise-delay': '320ms' } as React.CSSProperties}
            >
              {PROMISES.map(({ icon: Icon, title, text }) => (
                <li key={title}>
                  <Icon className="size-6 text-accent-ink" aria-hidden="true" />
                  <p className="mt-2.5 font-display text-[0.9375rem] font-extrabold leading-tight">
                    {title}
                  </p>
                  <p className="mt-1 text-sm text-fg-subtle">{text}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Панель-визитка: мрамор слева, чёрный срез справа — как на карточке */}
          <div
            className="rise relative"
            style={{ '--rise-delay': '180ms' } as React.CSSProperties}
          >
            <div className="clip-corner relative overflow-hidden bg-[var(--color-marble)] p-6 text-[var(--color-ink)] md:p-8">
              <span
                className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(120%_90%_at_18%_8%,#ffffff_0%,transparent_62%),repeating-linear-gradient(118deg,rgba(16,35,40,0.05)_0px,rgba(16,35,40,0.05)_1px,transparent_1px,transparent_15px)]"
                aria-hidden="true"
              />
              <div className="relative flex items-center gap-4">
                <LogoRemont variant="mark" className="h-16 w-16 shrink-0" />
                <span className="min-w-0">
                  <span className="block font-display text-[1.5rem] font-black uppercase leading-none tracking-[-0.02em]">
                    Бриллиант
                  </span>
                  <span className="mt-1.5 block font-display text-[0.7rem] font-bold uppercase leading-none tracking-[0.2em] text-[color-mix(in_srgb,var(--color-ink)_65%,transparent)]">
                    Ремонт
                  </span>
                </span>
              </div>

              <div className="relative mt-6 bg-[var(--color-black)] p-5 text-[#f4f6f6] md:p-6">
                <p className="font-display text-[1.35rem] font-black uppercase leading-none tracking-[-0.02em] text-[var(--color-gold-bright)] sm:text-[1.6rem]">
                  Штукатурка
                </p>
                <p className="mt-2.5 text-[0.9375rem] font-semibold">быстро, ровно, надолго.</p>
                <p className="mt-1 text-sm text-[#f4f6f6]/70">
                  Идеальная поверхность под обои и покраску.
                </p>
                <ul className="mt-5 flex gap-3">
                  {[IconTrowel, IconLevel, IconRoller].map((Icon, index) => (
                    <li
                      key={index}
                      className="grid size-10 place-items-center rounded-full border border-[var(--color-gold)]/60 text-[var(--color-gold)]"
                    >
                      <Icon className="size-5" aria-hidden="true" />
                    </li>
                  ))}
                </ul>
              </div>

              <p className="relative mt-5 text-sm text-[color-mix(in_srgb,var(--color-ink)_70%,transparent)]">
                {COMPANY.shortLegalName} · ИНН {COMPANY.inn}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
