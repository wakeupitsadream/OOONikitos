import Link from 'next/link';
import { ArrowRight, Check, MapPin, X } from 'lucide-react';
import { COMPANY, LICENSE } from '@/content/company';
import { DEZGARANT_CONTACTS, DEZGARANT_PHONE } from '@/content/dezgarant/contacts';
import { FEATURED_SERVICES } from '@/content/dezgarant/services';
import { DEZGARANT_RATES, PRICE_STATUS } from '@/content/dezgarant/prices';
import { DEZGARANT_FAQ, PRICE_INCLUDES, PROCESS_STEPS, SEASON_CALENDAR, AREA_CITIES } from '@/content/dezgarant/faq';
import { LICENSE_POINTS } from '@/content/dezgarant/license';
import { jsonLdScript } from '@/lib/seo';
import { siteOrigin } from '@/lib/site';
import { pluralize } from '@/lib/plural';
import { Section, SectionHead } from '@/components/ui/Section';
import { Card, Stat } from '@/components/ui/Card';
import { Diamond } from '@/components/ui/Diamond';
import { Button } from '@/components/ui/Button';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { Reveal } from '@/components/ui/Reveal';
import { HeroDez } from '@/components/blocks/HeroDez';
import { DezDiagnostic } from '@/components/blocks/DezDiagnostic';
import { ServiceGrid } from '@/components/blocks/ServiceGrid';
import { LicenseBlock } from '@/components/blocks/LicenseBlock';
import { LeadForm } from '@/components/blocks/LeadForm';
import { CallbackBar } from '@/components/blocks/CallbackBar';
import { CoverageMap } from '@/components/blocks/CoverageMap';

function jsonLd() {
  const origin = siteOrigin('dezgarant');
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${origin}#business`,
      name: 'ДезГарант',
      description:
        'Дезинфекция, дезинсекция и дератизация в Оренбурге и Оренбургской области. Лицензия Роспотребнадзора.',
      url: origin,
      telephone: DEZGARANT_PHONE ?? undefined,
      areaServed: { '@type': 'AdministrativeArea', name: COMPANY.region },
      parentOrganization: {
        '@type': 'Organization',
        name: COMPANY.shortLegalName,
        taxID: COMPANY.inn,
      },
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Лицензия',
        identifier: LICENSE.erul,
        recognizedBy: { '@type': 'GovernmentOrganization', name: LICENSE.authority },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: DEZGARANT_FAQ.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ];
}

export default function DezgarantHome() {
  const services = FEATURED_SERVICES.map((service) => ({
    slug: service.slug,
    title: service.title,
    lead: service.lead,
    icon: service.icon,
    priceFrom: service.problem ? DEZGARANT_RATES.tariffs[service.problem].base : undefined,
  }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd())} />

      <HeroDez />

      {/* Вау-фича: диагностика */}
      <Section id="raschet" tone="deep">
        <Reveal>
          <SectionHead
            eyebrow="Диагностика за 30 секунд"
            title="Узнайте цену до звонка"
            lead="Выберите проблему и объект — покажем ориентир, метод обработки, срок гарантии и ближайший выезд. Без звонка и без «оставьте заявку, перезвоним»."
          />
        </Reveal>
        <Reveal delay={80} className="mt-8">
          <DezDiagnostic phone={DEZGARANT_PHONE} />
        </Reveal>
      </Section>

      {/* Услуги */}
      <Section id="uslugi">
        <Reveal>
          <SectionHead
            eyebrow="Услуги"
            title="С чем работаем"
            lead="Полный перечень — от насекомых и грызунов до плесени, запахов и обработки после пожара или затопления."
          />
        </Reveal>
        <Reveal delay={80} className="mt-8">
          <ServiceGrid items={services} priceDraft={PRICE_STATUS === 'draft'} />
        </Reveal>
        <Reveal delay={140} className="mt-8">
          <Button href="/uslugi" variant="outline" size="lg">
            Все услуги и цены
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </Reveal>
      </Section>

      {/* Лицензия */}
      <Section id="licenziya" tone="deep">
        <Reveal>
          <LicenseBlock variant="full" points={LICENSE_POINTS} />
        </Reveal>
      </Section>

      {/* Как проходит обработка */}
      <Section id="kak-rabotaem">
        <Reveal>
          <SectionHead
            eyebrow="Как проходит обработка"
            title="Пять шагов — от звонка до акта"
          />
        </Reveal>
        <ol className="mt-10 grid gap-5 md:grid-cols-3 lg:grid-cols-5">
          {PROCESS_STEPS.map((step, index) => (
            <Reveal key={step.title} delay={index * 70}>
              <li className="h-full border-t-2 border-accent pt-4">
                <span className="eyebrow text-accent-ink">Шаг {index + 1}</span>
                <p className="mt-2 font-display text-base font-extrabold leading-snug">
                  {step.title}
                </p>
                <p className="mt-2 text-sm text-fg-muted">{step.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* Что входит в цену */}
      <Section id="chto-vhodit" tone="deep">
        <Reveal>
          <SectionHead
            eyebrow="Прозрачная цена"
            title="Что входит в стоимость, а что считается отдельно"
            lead="Чтобы на объекте не было сюрпризов, показываем состав услуги заранее."
          />
        </Reveal>
        <Reveal delay={80} className="mt-8">
          <ul className="grid gap-2 md:grid-cols-2">
            {PRICE_INCLUDES.map((row) => (
              <li
                key={row.label}
                className="flex items-start gap-3 rounded-[var(--radius-sm)] border border-border bg-surface px-4 py-3"
              >
                {row.included ? (
                  <Check className="mt-0.5 size-5 shrink-0 text-[var(--color-ok)]" aria-hidden="true" />
                ) : (
                  <X className="mt-0.5 size-5 shrink-0 text-fg-subtle" aria-hidden="true" />
                )}
                <span className="text-[0.9375rem]">
                  {row.label}
                  {'note' in row && row.note ? (
                    <span className="block text-sm text-fg-subtle">{row.note}</span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* Гарантия и деликатность */}
      <Section id="garantiya">
        <div className="grid gap-6 md:grid-cols-3">
          <Reveal>
            <Card className="h-full">
              <Stat
                value={pluralize(90, 'день', 'дня', 'дней')}
                label="Гарантия на основные услуги"
                hint="Вернулись вредители — приезжаем повторно бесплатно, а не со скидкой"
              />
            </Card>
          </Reveal>
          <Reveal delay={80}>
            <Card className="h-full">
              <Stat
                value="Без надписей"
                label="Деликатный выезд"
                hint="Машина без брендирования, специалист без формы — по клопам это стандарт"
              />
            </Card>
          </Reveal>
          <Reveal delay={160}>
            <Card className="h-full">
              <Stat
                value="С госрегистрацией"
                label="Только зарегистрированные препараты"
                hint="Применение незарегистрированных средств — грубое нарушение лицензионных требований"
              />
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* Бизнесу */}
      <Section id="biznesu" tone="deep">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <SectionHead
              eyebrow="Организациям"
              title="Договор, журнал и акты — комплект для проверки"
              lead="Кафе, магазины, управляющие компании, склады, детские и медицинские организации обязаны проводить обработки. Мы закрываем эту обязанность документами, которые предъявляются инспектору."
            />
            <Button href="/biznesu" size="lg" className="mt-7">
              Условия для бизнеса
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </Reveal>
          <Reveal delay={80}>
            <Card>
              <p className="eyebrow text-accent-ink">Что получает организация</p>
              <ul className="mt-4 space-y-2.5 text-[0.9375rem]">
                {[
                  'Договор с графиком обработок',
                  'Акты выполненных работ',
                  'Журнал учёта мероприятий',
                  'Схема расстановки точек контроля',
                  'Экстренный выезд при обнаружении следов',
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

      {/* Зона выезда */}
      <Section id="zona-vyezda">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <SectionHead
              eyebrow="Зона выезда"
              title="Оренбург и область"
              lead="Работаем в городе и выезжаем по области. Стоимость выезда за пределы Оренбурга считается по километражу и называется до выезда."
            />
            <ul className="mt-6 flex flex-wrap gap-2">
              {AREA_CITIES.map((city) => (
                <li
                  key={city}
                  className="flex items-center gap-1.5 rounded-[var(--radius-xs)] bg-surface-2 px-3 py-1.5 text-sm"
                >
                  <MapPin className="size-3.5 text-accent-ink" aria-hidden="true" />
                  {city}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={80}>
            <div className="rounded-[var(--radius-md)] border border-border bg-surface p-6">
              <CoverageMap />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Сезонный календарь */}
      <Section id="sezon" tone="deep">
        <Reveal>
          <SectionHead
            eyebrow="Календарь Оренбуржья"
            title="Когда что начинается"
            lead="Сезонность у нас своя: клещи с середины апреля, грызуны идут в тепло осенью."
          />
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {SEASON_CALENDAR.map((item, index) => (
            <Reveal key={item.title} delay={index * 70}>
              <Card className="h-full">
                <p className="eyebrow text-accent-ink">{item.period}</p>
                <p className="mt-3 font-display text-lg font-extrabold leading-snug">{item.title}</p>
                <p className="mt-2 text-[0.9375rem] text-fg-muted">{item.text}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
          <Reveal>
            <SectionHead eyebrow="Вопросы" title="Что обычно спрашивают" />
            <p className="lead mt-4">
              Не нашли свой вопрос?{' '}
              <Link href="/kontakty" className="underline underline-offset-4 hover:text-accent-ink">
                Позвоните
              </Link>{' '}
              — ответим без записи на осмотр.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <Accordion>
              {DEZGARANT_FAQ.map((item, index) => (
                <AccordionItem key={item.q} question={item.q} defaultOpen={index === 0}>
                  {item.a}
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </Section>

      {/* Заявка */}
      <Section id="zayavka" tone="deep">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHead
              eyebrow="Заявка"
              title="Оставьте заявку — перезвоним и назовём точную цену"
              lead="Опишите, что происходит: объект, площадь, что заметили. Этого хватит, чтобы назвать стоимость и время выезда."
            />
            <div className="mt-8">
              <Diamond variant="split" size="lg" />
              <p className="mt-4 max-w-sm text-[0.9375rem] text-fg-muted">
                {COMPANY.shortLegalName} · ИНН {COMPANY.inn}
                <br />
                Лицензия ЕРУЛ № {LICENSE.erul}
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <LeadForm site="dezgarant" fallbackPhone={DEZGARANT_PHONE} />
          </Reveal>
        </div>
      </Section>

      <CallbackBar
        phone={DEZGARANT_PHONE}
        messenger={DEZGARANT_CONTACTS.messengers[0] ?? null}
        formHref="#zayavka"
      />
    </>
  );
}
