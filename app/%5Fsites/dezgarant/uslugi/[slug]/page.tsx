import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Check, ClipboardList, ShieldCheck } from 'lucide-react';
import { SERVICES, SERVICE_BY_SLUG } from '@/content/dezgarant/services';
import { DEZGARANT_PHONE } from '@/content/dezgarant/contacts';
import { pageMetadata, jsonLdScript } from '@/lib/seo';
import { siteOrigin } from '@/lib/site';
import { Section, SectionHead } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Diamond } from '@/components/ui/Diamond';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { Reveal } from '@/components/ui/Reveal';
import { DezDiagnostic } from '@/components/blocks/DezDiagnostic';
import { LeadForm } from '@/components/blocks/LeadForm';
import { ServiceIcon } from '@/components/icons';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICE_BY_SLUG.get(slug);
  if (!service) return {};
  return pageMetadata({
    site: 'dezgarant',
    path: `/uslugi/${service.slug}`,
    title: service.seo.title,
    description: service.seo.description,
    ogTitle: service.title,
  });
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = SERVICE_BY_SLUG.get(slug);
  if (!service) notFound();

  const origin = siteOrigin('dezgarant');

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.title,
      description: service.seo.description,
      serviceType: service.title,
      areaServed: { '@type': 'AdministrativeArea', name: 'Оренбургская область' },
      provider: { '@type': 'LocalBusiness', name: 'ДезГарант', '@id': `${origin}#business` },
      url: `${origin}/uslugi/${service.slug}`,
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
            <ArrowLeft className="size-4" aria-hidden="true" />
            Все услуги
          </Link>

          <div className="mt-6 flex items-start gap-4">
            <Diamond variant="accent" size="lg">
              <ServiceIcon name={service.icon} />
            </Diamond>
            <div>
              <h1 className="display-lg">{service.h1}</h1>
              <p className="lead mt-4 max-w-2xl">{service.lead}</p>
            </div>
          </div>
        </Reveal>
      </Section>

      {service.symptoms.length > 0 ? (
        <Section tone="deep" compact>
          <Reveal>
            <SectionHead eyebrow="Похоже на ваш случай" title="Когда пора вызывать специалиста" />
          </Reveal>
          <Reveal delay={80} className="mt-6">
            <ul className="grid gap-2 md:grid-cols-2">
              {service.symptoms.map((symptom) => (
                <li
                  key={symptom}
                  className="flex items-start gap-3 rounded-[var(--radius-sm)] border border-border bg-surface px-4 py-3"
                >
                  <AlertTriangle
                    className="mt-0.5 size-5 shrink-0 text-[var(--warn)]"
                    aria-hidden="true"
                  />
                  <span className="text-[0.9375rem]">{symptom}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Section>
      ) : null}

      <Section compact>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHead eyebrow="Как работаем" title="Метод обработки" />
            <p className="lead mt-4">{service.method}</p>
          </Reveal>
          <Reveal delay={80}>
            <Card>
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-5 text-accent-ink" aria-hidden="true" />
                <p className="font-display text-lg font-extrabold">Что вы получите</p>
              </div>
              <ul className="mt-4 space-y-2.5 text-[0.9375rem]">
                {[
                  'Договор до начала работ с фиксированной ценой',
                  'Акт выполненных работ с перечнем применённых средств',
                  'Гарантию с бесплатной повторной обработкой',
                  'Памятку: что делать до и после',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="mt-0.5 size-5 shrink-0 text-accent-ink" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>
      </Section>

      {service.problem ? (
        <Section id="raschet" tone="deep">
          <Reveal>
            <SectionHead
              eyebrow="Расчёт"
              title="Сколько это будет стоить"
              lead="Проблема уже выбрана — укажите объект и получите ориентир с гарантией и временем выезда."
            />
          </Reveal>
          <Reveal delay={80} className="mt-8">
            <DezDiagnostic initialProblem={service.problem} phone={DEZGARANT_PHONE} />
          </Reveal>
        </Section>
      ) : null}

      <Section compact tone={service.problem ? 'base' : 'deep'}>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <div className="flex items-center gap-3">
              <ClipboardList className="size-5 text-accent-ink" aria-hidden="true" />
              <p className="display-md">Как подготовить помещение</p>
            </div>
            <ul className="mt-5 space-y-2.5">
              {service.prep.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[0.9375rem]">
                  <span
                    className="mt-2 size-1.5 shrink-0 rotate-45 bg-accent"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={80}>
            <div className="flex items-center gap-3">
              <Check className="size-5 text-accent-ink" aria-hidden="true" />
              <p className="display-md">Что делать после обработки</p>
            </div>
            <ul className="mt-5 space-y-2.5">
              {service.after.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[0.9375rem]">
                  <span
                    className="mt-2 size-1.5 shrink-0 rotate-45 bg-accent"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
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

      <Section id="zayavka">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHead
              eyebrow="Заявка"
              title="Вызвать специалиста"
              lead="Перезвоним, уточним детали и назовём точную стоимость."
            />
          </Reveal>
          <Reveal delay={80}>
            <LeadForm
              site="dezgarant"
              service={service.title}
              fallbackPhone={DEZGARANT_PHONE}
              submitLabel="Вызвать специалиста"
            />
          </Reveal>
        </div>
      </Section>

    </>
  );
}
