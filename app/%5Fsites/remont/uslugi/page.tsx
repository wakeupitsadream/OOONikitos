import type { Metadata } from 'next';
import { ArrowRight, Check } from 'lucide-react';
import { PUBLISHED_SERVICES } from '@/content/remont/services';
import { PRICE_STATUS, WORK_RATES } from '@/content/remont/prices';
import { REMONT_PHONE } from '@/content/remont/contacts';
import { pageMetadata, jsonLdScript } from '@/lib/seo';
import { siteOrigin } from '@/lib/site';
import { formatPrice } from '@/lib/plural';
import { Section, SectionHead } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { DraftMark } from '@/components/ui/Badge';
import { Reveal } from '@/components/ui/Reveal';
import { ServiceGrid } from '@/components/blocks/ServiceGrid';
import { LeadForm } from '@/components/blocks/LeadForm';

export const metadata: Metadata = pageMetadata({
  site: 'remont',
  path: '/uslugi',
  title: 'Услуги: штукатурка, шпаклёвка, покраска и обои в Оренбурге',
  description:
    'Отделка стен в Оренбурге: штукатурка по маякам, шпаклёвка под покраску, покраска стен и потолков, обои. Расчёт площади онлайн, смета в договоре.',
});

export default function RemontServicesPage() {
  const origin = siteOrigin('remont');
  const items = PUBLISHED_SERVICES.map((service) => ({
    slug: service.slug,
    title: service.title,
    lead: service.lead,
    icon: service.icon,
  }));

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: origin },
      { '@type': 'ListItem', position: 2, name: 'Услуги', item: `${origin}/uslugi` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbs)} />

      <Section>
        <Reveal>
          <SectionHead
            as="h1"
            eyebrow="Услуги"
            title="Отделка стен: от основания до готовой поверхности"
            lead="Каждая работа считается за квадратный метр стен. Берёмся и за один этап, и за всю цепочку — штукатурка, шпаклёвка, покраска или обои."
          />
        </Reveal>
        <Reveal delay={80} className="mt-10">
          <ServiceGrid items={items} basePath="/uslugi" />
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-6 max-w-2xl text-sm text-fg-subtle">
            В карточках нет итоговой суммы: она зависит от площади стен вашего объекта. Ставка за
            квадратный метр — ниже, точная смета — после замера.
          </p>
        </Reveal>
      </Section>

      <Section tone="deep" compact>
        <Reveal>
          <SectionHead
            eyebrow="Расценки"
            title="Сколько стоит квадратный метр"
            lead="Цена привязана к площади стен, а не к числу комнат: так объём проверяется рулеткой, а не на слово."
          />
        </Reveal>
        <Reveal delay={80} className="mt-8">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {WORK_RATES.map((rate) => (
              <li
                key={rate.id}
                className="rounded-[var(--radius-md)] border border-border bg-surface p-5"
              >
                <p className="text-[0.9375rem] font-semibold">{rate.label}</p>
                <p className="tabular mt-2 font-display text-xl font-extrabold text-accent-ink">
                  {formatPrice(rate.pricePerM2)}
                  <span className="text-sm font-semibold text-fg-subtle"> / м²</span>
                </p>
                {rate.status === 'draft' ? <DraftMark className="ml-0" /> : null}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={140} className="mt-8 flex flex-wrap items-center gap-4">
          <Button href="/ceny" variant="outline" size="lg">
            Вся таблица цен и откуда взяты цифры
            <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
          </Button>
          <Button href="/#raschet" size="lg">
            Рассчитать свои стены
            <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
          </Button>
        </Reveal>
        {PRICE_STATUS === 'draft' ? (
          <Reveal delay={180}>
            <p className="mt-6 max-w-2xl text-sm text-fg-subtle">
              Расценки помечены как уточняемые: это рыночный ориентир, а не утверждённый прайс.
              Точная стоимость называется после замера и фиксируется в договоре.
            </p>
          </Reveal>
        ) : null}
      </Section>

      <Section id="zayavka" compact>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHead
              eyebrow="Что входит всегда"
              title="Одинаково на любой из работ"
            />
            <ul className="mt-6 space-y-2.5 text-[0.9375rem]">
              {[
                'Бесплатный замер и смета до подписания договора',
                'Фиксированная стоимость, пока не меняется объём',
                'Защита зон, не входящих в работу, и вынос мусора',
                'Приёмка вместе с вами: проверяем плоскость и углы',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-5 shrink-0 text-accent-ink" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={80}>
            <LeadForm
              site="remont"
              fallbackPhone={REMONT_PHONE}
              withTask
              title="Не нашли свою работу?"
              lead="Опишите задачу: объект, площадь, что нужно сделать. Скажем честно, берёмся или нет."
              submitLabel="Отправить задачу"
            />
          </Reveal>
        </div>
      </Section>

    </>
  );
}
