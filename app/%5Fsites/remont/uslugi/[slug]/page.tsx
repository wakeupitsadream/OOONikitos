import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Check, Lightbulb } from 'lucide-react';
import { PUBLISHED_SERVICES, REMONT_SERVICE_BY_SLUG } from '@/content/remont/services';
import { PRICE_STATUS, WORK_RATES } from '@/content/remont/prices';
import { REMONT_PHONE } from '@/content/remont/contacts';
import type { WorkId } from '@/lib/calc/remont';
import { pageMetadata, jsonLdScript } from '@/lib/seo';
import { siteOrigin } from '@/lib/site';
import { formatPrice, pluralize } from '@/lib/plural';
import { Section, SectionHead } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Diamond } from '@/components/ui/Diamond';
import { DraftMark } from '@/components/ui/Badge';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { Reveal } from '@/components/ui/Reveal';
import { RemontCalculator } from '@/components/blocks/RemontCalculator';
import { LeadForm } from '@/components/blocks/LeadForm';
import { ServiceIcon } from '@/components/icons';

type PageProps = { params: Promise<{ slug: string }> };

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

export default async function RemontServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = REMONT_SERVICE_BY_SLUG.get(slug);
  if (!service) notFound();

  const origin = siteOrigin('remont');
  // Слаги услуг совпадают с id расценок: страница знает свою ставку.
  const rate = WORK_RATES.find((item) => item.id === slug);
  const initialWorks: WorkId[] = rate ? [rate.id] : ['shtukaturka'];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.title,
      description: service.seo.description,
      serviceType: service.title,
      areaServed: { '@type': 'AdministrativeArea', name: 'Оренбургская область' },
      provider: {
        '@type': 'HomeAndConstructionBusiness',
        name: 'Бриллиант Ремонт',
        '@id': `${origin}#business`,
      },
      url: `${origin}/uslugi/${service.slug}`,
      ...(rate
        ? {
            offers: {
              '@type': 'Offer',
              priceCurrency: 'RUB',
              price: rate.pricePerM2,
              unitText: 'м² стен',
              availability: 'https://schema.org/InStock',
            },
          }
        : {}),
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

          {rate ? (
            <p className="tabular mt-7 font-display text-2xl font-extrabold text-accent-ink">
              {formatPrice(rate.pricePerM2)}
              <span className="text-base font-semibold text-fg-subtle"> / м² стен</span>
              {rate.status === 'draft' || PRICE_STATUS === 'draft' ? <DraftMark /> : null}
            </p>
          ) : null}
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
                <p className="display-md">Зачем это нужно</p>
              </div>
              <p className="mt-4 text-[0.9375rem] text-fg-muted">{service.why}</p>
              {rate ? (
                <p className="mt-5 border-t border-border pt-4 text-sm text-fg-subtle">
                  Норма выработки —{' '}
                  <span className="tabular text-fg">
                    {rate.m2PerDay} м² в день
                  </span>
                  {rate.dryingDays > 0 ? (
                    <>
                      {' '}
                      плюс{' '}
                      {pluralize(rate.dryingDays, 'день', 'дня', 'дней')} технологической паузы на
                      сушку
                    </>
                  ) : null}
                  . По этой норме считается срок в калькуляторе.
                </p>
              ) : null}
            </Card>
          </Reveal>
        </div>
      </Section>

      <Section id="raschet">
        <Reveal>
          <SectionHead
            eyebrow="Расчёт"
            title={`${service.title}: сколько это будет стоить`}
            lead="Работа уже отмечена — добавьте комнаты и получите площадь стен, вилку стоимости и срок."
          />
        </Reveal>
        <Reveal delay={80} className="mt-8">
          <RemontCalculator phone={REMONT_PHONE} initialWorks={initialWorks} />
        </Reveal>
      </Section>

      {service.faq.length > 0 ? (
        <Section tone="deep" compact>
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

      <Section id="zayavka" compact={service.faq.length > 0}>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHead
              eyebrow="Заявка"
              title="Записаться на замер"
              lead="Приедем, измерим стены и посчитаем точно. Замер бесплатный, смета фиксируется договором."
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
