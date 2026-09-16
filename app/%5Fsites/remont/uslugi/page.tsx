import type { Metadata } from 'next';
import { ArrowRight, Check } from 'lucide-react';
import { PUBLISHED_SERVICES } from '@/content/remont/services';
import { SLOPE_TARIFFS, WALL_TARIFFS } from '@/content/remont/prices';
import { REMONT_PHONE } from '@/content/remont/contacts';
import { pageMetadata, jsonLdScript } from '@/lib/seo';
import { siteOrigin } from '@/lib/site';
import { formatPrice } from '@/lib/plural';
import { Section, SectionHead } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { ServiceGrid } from '@/components/blocks/ServiceGrid';
import { TariffCards, servicePriceLabel } from '@/components/blocks/RemontPricing';
import { LeadForm } from '@/components/blocks/LeadForm';

export const metadata: Metadata = pageMetadata({
  site: 'remont',
  path: '/uslugi',
  title: 'Услуги: ремонт под ключ, штукатурка, откосы в Оренбурге',
  description:
    'Ремонт квартир под ключ, штукатурка по трём тарифам, откосы на окна и двери, шпаклёвка, перегородки и демонтаж, обои и покраска в Оренбурге. Смета в договоре.',
});

const NBSP = ' ';

export default function RemontServicesPage() {
  const origin = siteOrigin('remont');
  const items = PUBLISHED_SERVICES.map((service) => ({
    slug: service.slug,
    title: service.title,
    lead: service.lead,
    icon: service.icon,
    priceLabel: servicePriceLabel(service),
    noPriceLabel: 'По смете после замера',
  }));
  const slopeFrom = Math.min(...SLOPE_TARIFFS.map((tariff) => tariff.pricePerMeter));

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
            title="Ремонт под ключ и отдельные работы"
            lead="Берёмся за квартиру или дом целиком — от демонтажа до финальной уборки — и за отдельный этап. Стены считаются за квадратный метр по тарифу, откосы — за погонный метр."
          />
        </Reveal>
        <Reveal delay={80} className="mt-10">
          <ServiceGrid items={items} basePath="/uslugi" />
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-6 max-w-2xl text-sm text-fg-subtle">
            В карточках нет итоговой суммы: она зависит от площади вашего объекта. Тарифы за
            квадратный метр — ниже, точная смета — после бесплатного замера.
          </p>
        </Reveal>
      </Section>

      <Section tone="deep" compact>
        <Reveal>
          <SectionHead
            eyebrow="Тарифы"
            title="Сколько стоит квадратный метр стен"
            lead="Три уровня подготовки с фиксированной ценой. Состав каждого тарифа — на странице цен и в договоре."
          />
        </Reveal>
        <Reveal delay={80} className="mt-8">
          <TariffCards tariffs={WALL_TARIFFS} compact />
        </Reveal>
        <Reveal delay={140} className="mt-8 flex flex-wrap items-center gap-4">
          <Button href="/ceny" variant="outline" size="lg">
            {`Состав тарифов, откосы от ${formatPrice(slopeFrom)}/п.${NBSP}м и прайс`}
            <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
          </Button>
          <Button href="/#raschet" size="lg">
            Рассчитать свои стены
            <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
          </Button>
        </Reveal>
      </Section>

      <Section id="zayavka" compact>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHead eyebrow="Что входит всегда" title="Одинаково на любой из работ" />
            <ul className="mt-6 space-y-2.5 text-[0.9375rem]">
              {[
                'Бесплатный замер и смета до подписания договора',
                'Фиксированная стоимость, пока не меняется объём',
                'Защита зон, не входящих в работу, и уборка после завершения',
                'Приёмка вместе с вами: проверяем плоскость и углы, подписываем акт',
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
