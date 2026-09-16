import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Check, Lightbulb } from 'lucide-react';
import { PUBLISHED_SERVICES, REMONT_SERVICE_BY_SLUG } from '@/content/remont/services';
import { EXTRA_WORKS, SLOPE_TARIFFS, WALL_TARIFFS } from '@/content/remont/prices';
import { REMONT_PHONE } from '@/content/remont/contacts';
import { pageMetadata, jsonLdScript } from '@/lib/seo';
import { siteOrigin } from '@/lib/site';
import { formatPrice } from '@/lib/plural';
import { Section, SectionHead } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Diamond } from '@/components/ui/Diamond';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { Reveal } from '@/components/ui/Reveal';
import { RemontCalculator } from '@/components/blocks/RemontCalculator';
import {
  ExtraWorksTable,
  SlopeStages,
  SlopeTariffCards,
  TariffCards,
  extraPriceLabel,
} from '@/components/blocks/RemontPricing';
import { LeadForm } from '@/components/blocks/LeadForm';
import { ServiceIcon } from '@/components/icons';

type PageProps = { params: Promise<{ slug: string }> };

const NBSP = ' ';

/** Публикуются только подтверждённые услуги — см. content/remont/services.ts. */
export function generateStaticParams() {
  return PUBLISHED_SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = REMONT_SERVICE_BY_SLUG.get(slug);
  if (!service) return {};
  return pageMetadata({
    site: 'remont',
    path: `/uslugi/${service.slug}`,
    title: service.seo.title,
    description: service.seo.description,
    ogTitle: service.title,
  });
}

/** Строка цены под заголовком и предложения для разметки — по типу прайса услуги. */
function pricing(service: NonNullable<ReturnType<typeof REMONT_SERVICE_BY_SLUG.get>>) {
  if (service.pricing === 'walls') {
    const from = Math.min(...WALL_TARIFFS.map((tariff) => tariff.pricePerM2));
    return {
      line: `от ${formatPrice(from)}/м² стен`,
      offers: WALL_TARIFFS.map((tariff) => ({
        '@type': 'Offer',
        name: `${tariff.scope} — тариф «${tariff.label}»`,
        priceCurrency: 'RUB',
        price: tariff.pricePerM2,
        unitText: 'м² стен',
        availability: 'https://schema.org/InStock',
      })),
    };
  }
  if (service.pricing === 'slopes') {
    const from = Math.min(...SLOPE_TARIFFS.map((tariff) => tariff.pricePerMeter));
    return {
      line: `от ${formatPrice(from)}/п.${NBSP}м`,
      offers: SLOPE_TARIFFS.map((tariff) => ({
        '@type': 'Offer',
        name: `Откосы — тариф «${tariff.label}»`,
        priceCurrency: 'RUB',
        price: tariff.pricePerMeter,
        unitText: 'погонный метр',
        availability: 'https://schema.org/InStock',
      })),
    };
  }
  if (service.pricing === 'extras') {
    const rows = EXTRA_WORKS.filter((work) => service.extraIds?.includes(work.id));
    const first = rows.find((work) => work.price !== null);
    return { line: first ? extraPriceLabel(first) : null, offers: [] };
  }
  return { line: null, offers: [] };
}

export default async function RemontServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = REMONT_SERVICE_BY_SLUG.get(slug);
  if (!service) notFound();

  const origin = siteOrigin('remont');
  const price = pricing(service);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.title,
      description: service.seo.description,
      serviceType: service.title,
      areaServed: { '@type': 'AdministrativeArea', name: 'Оренбургская область' },
      provider: {
        '@type': 'Organization',
        name: 'Бриллиант Ремонт',
        '@id': `${origin}#business`,
      },
      url: `${origin}/uslugi/${service.slug}`,
      ...(price.offers.length > 0 ? { offers: price.offers } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: origin },
        { '@type': 'ListItem', position: 2, name: 'Услуги', item: `${origin}/uslugi` },
        {
          '@type': 'ListItem',
          position: 3,
          name: service.title,
          item: `${origin}/uslugi/${service.slug}`,
        },
      ],
    },
    ...(service.faq.length > 0
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: service.faq.map((item) => ({
              '@type': 'Question',
              name: item.q,
              acceptedAnswer: { '@type': 'Answer', text: item.a },
            })),
          },
        ]
      : []),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />

      <Section compact>
        <Reveal>
          <Link
            href="/uslugi"
            className="inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-accent-ink"
          >
            <ArrowLeft className="size-4 shrink-0" aria-hidden="true" />
            Все услуги
          </Link>

          <div className="mt-6 flex items-start gap-4">
            <Diamond variant="accent" size="lg">
              <ServiceIcon name={service.icon} />
            </Diamond>
            <div className="min-w-0">
              <h1 className="display-lg">{service.h1}</h1>
              <p className="lead mt-4 max-w-2xl">{service.lead}</p>
            </div>
          </div>

          {price.line ? (
            <p className="tabular mt-7 font-display text-2xl font-extrabold text-accent-ink">
              {price.line}
              <span className="block text-sm font-normal text-fg-subtle">
                фиксированная стоимость работ по прайсу
              </span>
            </p>
          ) : (
            <p className="mt-7 text-[0.9375rem] text-fg-muted">
              Стоимость — по смете после бесплатного замера: зависит от объёма и состава работ.
            </p>
          )}
        </Reveal>
      </Section>

      <Section tone="deep" compact>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHead eyebrow="Состав работ" title="Что входит" />
            <ul className="mt-6 space-y-2.5 text-[0.9375rem]">
              {service.includes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-5 shrink-0 text-accent-ink" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={80}>
            <Card className="h-full" clipped>
              <div className="flex items-center gap-3">
                <Lightbulb className="size-5 shrink-0 text-accent-ink" aria-hidden="true" />
                <h3 className="display-md">Зачем это нужно</h3>
              </div>
              <p className="mt-4 text-[0.9375rem] text-fg-muted">{service.why}</p>
            </Card>
          </Reveal>
        </div>
      </Section>

      {service.pricing === 'walls' ? (
        <Section id="tarify" compact>
          <Reveal>
            <SectionHead
              eyebrow="Тарифы"
              title="Три тарифа на стены"
              lead="Цена за квадратный метр фиксированная, состав накопительный: каждый следующий тариф включает предыдущий."
            />
          </Reveal>
          <Reveal delay={80} className="mt-8">
            <TariffCards tariffs={WALL_TARIFFS} highlight={service.initialTariff} />
          </Reveal>
        </Section>
      ) : null}

      {service.pricing === 'slopes' ? (
        <Section id="tarify" compact>
          <Reveal>
            <SectionHead
              eyebrow="Тарифы"
              title="Три тарифа за погонный метр"
              lead="Периметр проёма без низа: у окна и двери — две вертикали и верх."
            />
          </Reveal>
          <Reveal delay={80} className="mt-8">
            <SlopeTariffCards tariffs={SLOPE_TARIFFS} />
          </Reveal>
          <Reveal delay={140} className="mt-10">
            <SectionHead eyebrow="Этапы" title="Как делаем откосы" />
          </Reveal>
          <Reveal delay={180} className="mt-6">
            <SlopeStages />
          </Reveal>
        </Section>
      ) : null}

      {service.pricing === 'extras' ? (
        <Section id="prays" compact>
          <Reveal>
            <SectionHead
              eyebrow="Прайс"
              title="Стоимость по строкам"
              lead="Считается по факту замера: за квадратный метр, штуку или выезд — как указано в строке."
            />
          </Reveal>
          <Reveal delay={80} className="mt-8">
            <ExtraWorksTable
              works={EXTRA_WORKS}
              ids={service.extraIds}
              caption={`${service.title}: стоимость работ`}
            />
          </Reveal>
        </Section>
      ) : null}

      <Section id="raschet" tone={service.pricing === 'estimate' ? 'base' : 'deep'}>
        <Reveal>
          <SectionHead
            eyebrow="Расчёт"
            title={`${service.title}: сколько это будет стоить`}
            lead="Добавьте комнаты и выберите тариф — получите площадь стен, стоимость по прайсу, срок и гарантию."
          />
        </Reveal>
        <Reveal delay={80} className="mt-8">
          <RemontCalculator phone={REMONT_PHONE} initialTariff={service.initialTariff} />
        </Reveal>
      </Section>

      {service.faq.length > 0 ? (
        <Section compact>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
            <Reveal>
              <SectionHead eyebrow="Вопросы" title={`${service.title}: что спрашивают`} />
            </Reveal>
            <Reveal delay={80}>
              <Accordion>
                {service.faq.map((item, index) => (
                  <AccordionItem key={item.q} question={item.q} defaultOpen={index === 0}>
                    {item.a}
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </Section>
      ) : null}

      <Section id="zayavka" tone="deep" compact={service.faq.length > 0}>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHead
              eyebrow="Заявка"
              title="Записаться на замер"
              lead="Приедем, измерим и посчитаем точно. Замер бесплатный, смета фиксируется договором."
            />
          </Reveal>
          <Reveal delay={80}>
            <LeadForm
              site="remont"
              service={service.title}
              fallbackPhone={REMONT_PHONE}
              submitLabel="Записаться на замер"
            />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
