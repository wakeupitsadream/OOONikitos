import Link from 'next/link';
import { ArrowRight, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { COMPANY } from '@/content/company';
import { REMONT_PHONE } from '@/content/remont/contacts';
import {
  CLEANING,
  GUARANTEES,
  PRINCIPLES,
  PUBLISHED_SERVICES,
  REMONT_FAQ,
  STEPS,
} from '@/content/remont/services';
import { ALWAYS_INCLUDED, SLOPE_TARIFFS, TARIFF_OBJECTS, WALL_TARIFFS } from '@/content/remont/prices';
import { HAS_PORTFOLIO, PORTFOLIO } from '@/content/remont/portfolio';
import { guaranteeLabel } from '@/lib/calc/remont';
import { jsonLdScript } from '@/lib/seo';
import { siteOrigin, siteUrl } from '@/lib/site';
import { formatPrice } from '@/lib/plural';
import { Section, SectionHead } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { Reveal } from '@/components/ui/Reveal';
import { HeroRemont } from '@/components/blocks/HeroRemont';
import { RemontCalculator } from '@/components/blocks/RemontCalculator';
import { TariffCards, TariffFactsTable, servicePriceLabel } from '@/components/blocks/RemontPricing';
import { BeforeAfter } from '@/components/blocks/BeforeAfter';
import { ServiceGrid } from '@/components/blocks/ServiceGrid';
import { LeadForm } from '@/components/blocks/LeadForm';

/**
 * Главная «Бриллиант Ремонт» (§6.2 плана + правки владельца от 15.09.2026).
 * Ни одной цифры «из головы»: тарифы, сроки, гарантии и состав работ —
 * с листовок владельца (content/remont/prices.ts), обещания — с визитки.
 */

const NBSP = ' ';

function jsonLd() {
  const origin = siteOrigin('remont');
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${origin}#business`,
      name: 'Бриллиант Ремонт',
      description:
        'Ремонт квартир и домов под ключ в Оренбурге: штукатурка по тарифам, шпаклёвка, откосы, перегородки, обои и покраска. Фиксированная смета в договоре.',
      url: origin,
      slogan: 'Быстро, ровно, надолго',
      telephone: REMONT_PHONE ?? undefined,
      areaServed: { '@type': 'AdministrativeArea', name: COMPANY.region },
      parentOrganization: {
        '@type': 'Organization',
        name: COMPANY.shortLegalName,
        legalName: COMPANY.legalName,
        taxID: COMPANY.inn,
        url: siteOrigin('belye-niti'),
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Ремонт и отделка',
        itemListElement: [
          ...WALL_TARIFFS.map((tariff) => ({
            '@type': 'Offer',
            name: `${tariff.scope} — тариф «${tariff.label}»`,
            priceCurrency: 'RUB',
            price: tariff.pricePerM2,
            unitText: 'м² стен',
            url: `${origin}/ceny`,
          })),
          ...PUBLISHED_SERVICES.map((service) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: service.title },
            url: `${origin}/uslugi/${service.slug}`,
          })),
        ],
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: REMONT_FAQ.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ];
}

export default function RemontHome() {
  const services = PUBLISHED_SERVICES.map((service) => ({
    slug: service.slug,
    title: service.title,
    lead: service.lead,
    icon: service.icon,
    priceLabel: servicePriceLabel(service),
    noPriceLabel: 'По смете после замера',
  }));
  const slopeFrom = Math.min(...SLOPE_TARIFFS.map((tariff) => tariff.pricePerMeter));
  const maxGuarantee = Math.max(...WALL_TARIFFS.map((tariff) => tariff.guaranteeMonths));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd())} />

      <HeroRemont />

      {/* Вау-фича: калькулятор стен по тарифам */}
      <Section id="raschet" tone="deep">
        <Reveal>
          <SectionHead
            eyebrow="Расчёт за минуту"
            title="Посчитайте стены до звонка"
            lead="Добавьте комнаты, выберите тариф — покажем площадь стен, стоимость по прайсу, срок и гарантию. Без «оставьте заявку, менеджер перезвонит»."
          />
        </Reveal>
        <Reveal delay={80} className="mt-8">
          <RemontCalculator phone={REMONT_PHONE} />
        </Reveal>
      </Section>

      {/* Тарифы — с листовки владельца */}
      <Section id="tarify">
        <Reveal>
          <SectionHead
            eyebrow="Тарифы"
            title="Три тарифа на стены — цена за м² фиксированная"
            lead="Состав каждого тарифа напечатан в нашем прайсе и записывается в договор. Выбираете уровень подготовки — от ровных стен под обои до поверхности под покраску."
          />
        </Reveal>
        <Reveal delay={80} className="mt-8">
          <TariffCards tariffs={WALL_TARIFFS} />
        </Reveal>
        <Reveal delay={140} className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <p className="text-sm text-fg-subtle">Работаем на объектах: {TARIFF_OBJECTS.join(', ').toLowerCase()}.</p>
          <Button href="/ceny" variant="outline">
            {`Откосы от ${formatPrice(slopeFrom)}/п.${NBSP}м и прайс доп. работ`}
            <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
          </Button>
        </Reveal>
      </Section>

      {/* Услуги */}
      <Section id="uslugi" tone="deep">
        <Reveal>
          <SectionHead
            eyebrow="Услуги"
            title="Ремонт под ключ или отдельный этап"
            lead="Берёмся за квартиру или дом целиком — от демонтажа до уборки — и за отдельную работу: штукатурку, откосы, шпаклёвку, перегородки, обои или покраску."
          />
        </Reveal>
        <Reveal delay={80} className="mt-8">
          <ServiceGrid items={services} basePath="/uslugi" />
        </Reveal>
      </Section>

      {/* Портфолио — только с реальными фото объектов */}
      {HAS_PORTFOLIO ? (
        <Section id="portfolio">
          <Reveal>
            <SectionHead eyebrow="Работы" title="Было — стало" />
          </Reveal>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {PORTFOLIO.slice(0, 4).map((item, index) => (
              <Reveal key={item.id} delay={index * 70}>
                <BeforeAfter
                  beforeSrc={item.beforeSrc}
                  afterSrc={item.afterSrc}
                  alt={`${item.title}, ${item.district}`}
                />
                <p className="mt-3 text-sm text-fg-muted">{item.comment}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={140} className="mt-8">
            <Button href="/portfolio" variant="outline" size="lg">
              Все работы
              <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
            </Button>
          </Reveal>
        </Section>
      ) : null}

      {/* Гарантии — с визитки и листовки.
          Светлая мраморная панель: лицевая сторона визитки внутри чёрного сайта. */}
      <Section id="garantii">
        <Reveal>
          <div className="clip-corner relative overflow-hidden bg-[var(--color-marble)] p-6 text-[var(--color-ink)] md:p-10 lg:p-14">
            <span
              className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(110%_80%_at_12%_0%,#ffffff_0%,transparent_58%),repeating-linear-gradient(118deg,rgba(16,35,40,0.045)_0px,rgba(16,35,40,0.045)_1px,transparent_1px,transparent_16px)]"
              aria-hidden="true"
            />
            <header className="relative max-w-2xl">
              <p className="eyebrow text-[color-mix(in_srgb,var(--color-ink)_65%,transparent)]">
                Мы гарантируем
              </p>
              <h2 className="display-lg mt-3">Гарантия прописана в договоре, а не на словах</h2>
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-[color-mix(in_srgb,var(--color-ink)_78%,transparent)]">
                Четыре обещания напечатаны на нашей визитке, сроки гарантии — в прайсе:
                {` до ${guaranteeLabel(maxGuarantee)} на стены по тарифам и до 3 лет на откосы.`}
              </p>
            </header>

            <ul className="relative mt-10 grid gap-7 sm:grid-cols-2 lg:gap-9">
              {GUARANTEES.map((item, index) => (
                <li key={item.title} className="border-t-2 border-[var(--color-gold-deep)] pt-4">
                  <span className="tabular font-display text-sm font-extrabold text-[var(--color-gold-deep)]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-1.5 font-display text-lg font-extrabold leading-snug">
                    {item.title}
                  </p>
                  <p className="mt-2 text-[0.9375rem] text-[color-mix(in_srgb,var(--color-ink)_75%,transparent)]">
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>

            <ul className="relative mt-9 grid gap-2.5 border-t border-[color-mix(in_srgb,var(--color-ink)_15%,transparent)] pt-6 text-sm text-[color-mix(in_srgb,var(--color-ink)_78%,transparent)] sm:grid-cols-2 lg:grid-cols-3">
              {PRINCIPLES.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <ShieldCheck
                    className="mt-0.5 size-4 shrink-0 text-[var(--color-gold-deep)]"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Section>

      {/* Этапы — шесть шагов с листовки */}
      <Section id="etapy" tone="deep">
        <Reveal>
          <SectionHead
            eyebrow="Как мы работаем"
            title="Шесть шагов — от заявки до сдачи объекта"
            lead="Каждый шаг заканчивается результатом, который можно проверить: смета, договор, акт."
          />
        </Reveal>
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {STEPS.map((step, index) => (
            <Reveal key={step.title} delay={index * 60}>
              <li className="h-full border-t-2 border-accent pt-4">
                <span className="eyebrow text-accent-ink">
                  {`Шаг ${String(index + 1).padStart(2, '0')}`}
                </span>
                <p className="mt-2 font-display text-base font-extrabold leading-snug">
                  {step.title}
                </p>
                <p className="mt-2 text-sm text-fg-muted">{step.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <Reveal delay={140} className="mt-8">
          <Button href="/etapy" variant="outline">
            Подробно про этапы
            <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
          </Button>
        </Reveal>
      </Section>

      {/* Поэтапная оплата: принцип с листовки («оплата поэтапно, без переплат»),
          проценты владелец не публикует. */}
      <Section id="oplata">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHead
              eyebrow="Оплата"
              title="Поэтапно и без переплат"
              lead="Деньги идут за результатом, а не вперёд него. Порядок платежей прописывается в договоре вместе с составом и сроками работ."
            />
          </Reveal>
          <Reveal delay={80}>
            <Card>
              <ul className="space-y-3 text-[0.9375rem]">
                {[
                  'Замер и смета — бесплатно, до подписания договора',
                  'Оплата разбивается по этапам работ, а не вносится целиком вперёд',
                  'Этап закрывается только после того, как вы его приняли',
                  'Объём вырос — согласуем письменно до начала работ, а не по факту',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="mt-0.5 size-5 shrink-0 text-accent-ink" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-border pt-4 text-sm text-fg-subtle">
                Конкретные доли платежей зависят от объёма и закрепляются в договоре — на сайте
                мы их не публикуем, чтобы не обещать того, что потом придётся менять.
              </p>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* Сроки, объём, гарантия — из прайса, не из «средних по рынку» */}
      <Section id="sroki" tone="deep">
        <Reveal>
          <SectionHead
            eyebrow="Сроки и объём"
            title="Что зависит от тарифа"
            lead="Минимальный объём заказа, срок старта работ и срок гарантии — по прайсу. Точная длительность считается от площади после замера и записывается в договор."
          />
        </Reveal>
        <Reveal delay={80} className="mt-8">
          <TariffFactsTable tariffs={WALL_TARIFFS} />
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-3 text-sm text-fg-subtle sm:hidden">Таблица прокручивается вбок.</p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-fg-muted">
            {ALWAYS_INCLUDED.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="size-4 shrink-0 text-accent-ink" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* TODO_OWNER: образцы договора, сметы, акта и гарантийного талона (PDF).
          Без файлов секция «Документы» не рендерится. */}

      {/* Один подрядчик: ремонт и обработка помещения */}
      <Section id="odin-podryadchik">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHead
              eyebrow="Одна компания"
              title="После ремонта помещение можно обработать у нас же"
              lead="«Бриллиант Ремонт» и «ДезГарант» — два направления ООО «Белые Нити». Обработка перед заселением или после ремонта делается по лицензии Роспотребнадзора, с договором и актом."
            />
            {/* external: ссылка на соседний бренд идёт через /api/site — обычный
                <a>, чтобы Next не пытался префетчить чужой сайт как маршрут. */}
            <Button
              href={siteUrl('dezgarant')}
              external
              variant="outline"
              size="lg"
              className="mt-7"
            >
              Перейти в ДезГарант
              <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
            </Button>
          </Reveal>
          <Reveal delay={80}>
            <Card>
              <p className="eyebrow text-accent-ink">Что это даёт</p>
              <ul className="mt-4 space-y-2.5 text-[0.9375rem]">
                {[
                  'Одно юридическое лицо на обе задачи — договор общий или отдельный на каждую, как удобнее',
                  'Не нужно искать вторую бригаду и согласовывать доступ',
                  'Обработка планируется в график ремонта, а не «когда получится»',
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

      {/* Акцент владельца: полноценная уборка после работ — в самом конце */}
      <Section id="uborka" tone="deep">
        <Reveal>
          <div className="relative overflow-hidden rounded-[var(--radius-md)] border border-accent/40 bg-surface p-6 md:p-10">
            <span
              className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-accent/10 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
              <div>
                <p className="eyebrow flex items-center gap-2 text-accent-ink">
                  <Sparkles className="size-4" aria-hidden="true" />
                  Уборка после работ
                </p>
                <h2 className="display-lg mt-3">{CLEANING.title}</h2>
                <p className="lead mt-4">{CLEANING.lead}</p>
                <p className="mt-4 text-sm text-fg-subtle">{CLEANING.extra}</p>
              </div>
              <ul className="space-y-3">
                {CLEANING.byTariff.map((row) => (
                  <li
                    key={row.tariff}
                    className="flex items-start gap-4 rounded-[var(--radius-sm)] border border-border bg-bg-deep px-4 py-3"
                  >
                    <span className="eyebrow mt-0.5 shrink-0 text-fg-subtle">{row.tariff}</span>
                    <span className="text-[0.9375rem]">{row.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* FAQ */}
      <Section id="faq">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
          <Reveal>
            <SectionHead eyebrow="Вопросы" title="Что спрашивают до замера" />
            <p className="lead mt-4">
              Не нашли свой вопрос?{' '}
              <Link href="/kontakty" className="underline underline-offset-4 hover:text-accent-ink">
                Позвоните
              </Link>{' '}
              — ответим без выезда.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <Accordion>
              {REMONT_FAQ.map((item, index) => (
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
              title="Запишитесь на замер"
              lead="Приедем, измерим стены, проверим геометрию основания и посчитаем смету по тарифу. Замер бесплатный."
            />
            <p className="mt-8 max-w-sm text-[0.9375rem] text-fg-muted">
              {COMPANY.shortLegalName} · ИНН {COMPANY.inn}
              <br />
              Работаем с физическими и юридическими лицами: договор, смета, акты.
            </p>
            <p className="tabular mt-4 text-sm text-fg-subtle">
              {`Минимальный объём — от 30${NBSP}м² стен по тарифу «Премиум», от 50${NBSP}м² — «Стандарт», от 100${NBSP}м² — «Базовый».`}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <LeadForm
              site="remont"
              fallbackPhone={REMONT_PHONE}
              submitLabel="Записаться на замер"
            />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
