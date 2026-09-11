import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, Info, X } from 'lucide-react';
import { SERVICES } from '@/content/dezgarant/services';
import { B2B_RATES, DEZGARANT_RATES, PRICE_STATUS } from '@/content/dezgarant/prices';
import { PRICE_INCLUDES } from '@/content/dezgarant/faq';
import { DEZGARANT_CONTACTS, DEZGARANT_PHONE } from '@/content/dezgarant/contacts';
import type { Tariff } from '@/lib/calc/dezgarant';
import { pageMetadata, jsonLdScript } from '@/lib/seo';
import { siteOrigin } from '@/lib/site';
import { formatPrice, formatPriceFrom, plural, pluralize } from '@/lib/plural';
import { typograf } from '@/lib/typograf';
import { Section, SectionHead } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DraftMark } from '@/components/ui/Badge';
import { Reveal } from '@/components/ui/Reveal';
import { LeadForm } from '@/components/blocks/LeadForm';
import { CallbackBar } from '@/components/blocks/CallbackBar';

export const metadata: Metadata = pageMetadata({
  site: 'dezgarant',
  path: '/ceny',
  title: 'Цены на дезинфекцию и дератизацию в Оренбурге',
  description:
    'Стоимость обработки от тараканов, клопов, грызунов, клещей и плесени в Оренбурге: цена «от», что входит в неё, что считается отдельно, сроки гарантии и тарифы для организаций.',
  ogTitle: 'Цены ДезГаранта',
});

const priceDraft = PRICE_STATUS === 'draft';

/** Что уже включено в цену «от»: единица расчёта у каждой услуги своя. */
function baseLabel(tariff: Tariff): string {
  if (tariff.unit === 'room') {
    // Тариф без доплаты за комнату считается за выезд целиком (осы и шершни).
    if (tariff.perUnit <= 0) return 'Выезд и обработка объекта';
    return tariff.included <= 1 ? 'Однокомнатная квартира' : `Объект до ${tariff.included} комнат`;
  }
  if (tariff.unit === 'm2') return `Помещение до ${tariff.included} м²`;
  return `Участок до ${tariff.included} соток`;
}

/** Сколько стоит каждая единица сверх включённой. */
function extraLabel(tariff: Tariff): string | null {
  if (tariff.perUnit <= 0) return null;
  if (tariff.unit === 'room') return `далее ${formatPrice(tariff.perUnit)} за каждую комнату`;
  if (tariff.unit === 'm2') return `далее ${formatPrice(tariff.perUnit)} за м²`;
  return `далее ${formatPrice(tariff.perUnit)} за сотку`;
}

type PriceRow = {
  slug: string;
  title: string;
  from: number;
  base: string;
  extra: string | null;
  guarantee: string;
  note: string | null;
};

/** Таблица собирается из услуг: цена берётся из тарифа, а не пишется руками. */
const ROWS: PriceRow[] = SERVICES.flatMap((service) => {
  if (!service.problem) return [];
  const tariff = DEZGARANT_RATES.tariffs[service.problem];
  return [
    {
      slug: service.slug,
      title: service.title,
      from: tariff.base,
      base: baseLabel(tariff),
      extra: extraLabel(tariff),
      guarantee: pluralize(tariff.guaranteeDays, 'день', 'дня', 'дней'),
      note:
        tariff.visits > 1
          ? `Цена за курс из ${tariff.visits} ${plural(tariff.visits, 'обработки', 'обработок', 'обработок')}`
          : null,
    },
  ];
});

/** Услуги, где заочная цифра была бы обманом: считаем только после осмотра. */
const BY_INSPECTION = SERVICES.filter((service) => !service.problem);

export default function PricesPage() {
  const origin = siteOrigin('dezgarant');
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: origin },
      { '@type': 'ListItem', position: 2, name: 'Цены', item: `${origin}/ceny` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbs)} />

      <Section compact>
        <Reveal>
          <SectionHead
            as="h1"
            eyebrow="Цены"
            title="Сколько стоит обработка в Оренбурге"
            lead="Цена «от» — за типовой объект. Точную стоимость специалист называет после осмотра и фиксирует в договоре до начала работ: доплат «за степень заражения» не бывает."
          />
        </Reveal>

        <Reveal delay={80} className="mt-8">
          <Card className="border-l-4 border-l-accent">
            <div className="flex items-start gap-4">
              <Info className="mt-1 size-6 shrink-0 text-[var(--warn)]" aria-hidden="true" />
              <div>
                <p className="display-md">Откуда эти цифры</p>
                {priceDraft ? (
                  <>
                    <p className="mt-3 text-[0.9375rem] text-fg-muted">
                      Честно: пока это не прайс компании, а медианы открытых цен служб дезинфекции
                      Оренбурга по состоянию на сентябрь 2026 года. Мы поставили их, чтобы вы видели
                      порядок сумм и могли сравнить, а не гадали.
                    </p>
                    <p className="mt-3 text-[0.9375rem] text-fg-muted">
                      Поэтому у каждой строки стоит пометка «уточняется». Владелец утверждает
                      собственный прайс — после этого цифры заменятся, а пометка исчезнет. До тех пор
                      считайте их ориентиром, а не офертой.
                    </p>
                  </>
                ) : (
                  <p className="mt-3 text-[0.9375rem] text-fg-muted">
                    Это прайс компании. Цена «от» указана за типовой объект; итоговая сумма зависит
                    от площади и состояния объекта и фиксируется в договоре до начала работ.
                  </p>
                )}
              </div>
            </div>
          </Card>
        </Reveal>
      </Section>

      {/* Таблица цен */}
      <Section tone="deep" compact>
        <Reveal>
          <SectionHead eyebrow="Прайс" title="Цены по услугам" />
        </Reveal>

        {/* Мобильный вариант: карточки вместо строк таблицы */}
        <Reveal delay={60} className="mt-8 md:hidden">
          <ul className="space-y-3">
            {ROWS.map((row) => (
              <li
                key={row.slug}
                className="rounded-[var(--radius-md)] border border-border bg-surface p-5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <Link
                    href={`/uslugi/${row.slug}`}
                    className="font-display text-base font-extrabold underline-offset-4 hover:text-accent-ink hover:underline"
                  >
                    {row.title}
                  </Link>
                  <span className="tabular font-display text-lg font-extrabold text-accent-ink">
                    {formatPriceFrom(row.from)}
                    {priceDraft ? <DraftMark /> : null}
                  </span>
                </div>
                {row.note ? <p className="mt-1 text-sm text-fg-subtle">{typograf(row.note)}</p> : null}
                <p className="mt-2 text-[0.9375rem] text-fg-muted">
                  {typograf(row.base)}
                  {row.extra ? `, ${typograf(row.extra)}` : ''}
                </p>
                <p className="mt-1 text-sm text-fg-subtle">Гарантия {row.guarantee}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Десктоп: обычная таблица */}
        <Reveal delay={60} className="mt-8 hidden md:block">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Цены на услуги ДезГаранта в Оренбурге</caption>
            <thead>
              <tr className="border-b border-border-strong">
                <th scope="col" className="py-3 pr-4 text-sm font-semibold text-fg-subtle">
                  Услуга
                </th>
                <th scope="col" className="py-3 pr-4 text-sm font-semibold text-fg-subtle">
                  Цена «от»
                </th>
                <th scope="col" className="py-3 pr-4 text-sm font-semibold text-fg-subtle">
                  За что эта цена
                </th>
                <th scope="col" className="py-3 text-sm font-semibold text-fg-subtle">
                  Гарантия
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.slug} className="border-b border-border align-top">
                  <td className="py-4 pr-4">
                    <Link
                      href={`/uslugi/${row.slug}`}
                      className="font-semibold underline-offset-4 hover:text-accent-ink hover:underline"
                    >
                      {row.title}
                    </Link>
                    {row.note ? (
                      <span className="mt-1 block text-sm text-fg-subtle">{typograf(row.note)}</span>
                    ) : null}
                  </td>
                  <td className="py-4 pr-4">
                    <span className="tabular font-display text-lg font-extrabold text-accent-ink">
                      {formatPriceFrom(row.from)}
                    </span>
                    {priceDraft ? <DraftMark /> : null}
                  </td>
                  <td className="py-4 pr-4 text-[0.9375rem] text-fg-muted">
                    {typograf(row.base)}
                    {row.extra ? (
                      <span className="mt-1 block text-sm text-fg-subtle">{typograf(row.extra)}</span>
                    ) : null}
                  </td>
                  <td className="tabular py-4 text-[0.9375rem] text-fg-muted">{row.guarantee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        <Reveal delay={120} className="mt-8">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <p className="eyebrow text-accent-ink">Доплаты</p>
              <ul className="mt-4 space-y-2.5 text-[0.9375rem]">
                <li className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span>Горячий туман вместо холодного</span>
                  <span className="tabular font-semibold">
                    +{formatPrice(DEZGARANT_RATES.hotFogSurcharge)}
                    {priceDraft ? <DraftMark /> : null}
                  </span>
                </li>
                <li className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span>Выезд за пределы Оренбурга</span>
                  <span className="tabular font-semibold">
                    {formatPriceFrom(DEZGARANT_RATES.outOfTownPerKm)}/км
                    {priceDraft ? <DraftMark /> : null}
                  </span>
                </li>
              </ul>
              <p className="mt-4 text-sm text-fg-subtle">
                Километраж считается в одну сторону и называется до выезда.
              </p>
            </Card>

            <Card>
              <p className="eyebrow text-accent-ink">Только по осмотру</p>
              <ul className="mt-4 space-y-2.5 text-[0.9375rem]">
                {BY_INSPECTION.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/uslugi/${service.slug}`}
                      className="underline-offset-4 hover:text-accent-ink hover:underline"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-fg-subtle">
                Объём работ здесь заранее не виден: называть цифру заочно было бы обманом. Приезжаем,
                смотрим и считаем на месте.
              </p>
            </Card>
          </div>
        </Reveal>
      </Section>

      {/* Что входит в цену */}
      <Section compact>
        <Reveal>
          <SectionHead
            eyebrow="Состав услуги"
            title="Что входит в стоимость, а что считается отдельно"
            lead="Чтобы на объекте не было сюрпризов, состав работ виден заранее."
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
                  <Check className="mt-0.5 size-5 shrink-0 text-[var(--ok)]" aria-hidden="true" />
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

      {/* Бизнесу */}
      <Section tone="deep" compact>
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <SectionHead
              eyebrow="Организациям"
              title="Абонентское обслуживание считается иначе"
              lead="Кафе, магазину, управляющей компании или складу нужна не разовая обработка, а график, журнал учёта и акты для проверки. Это отдельный тариф — с расчётом на странице для бизнеса."
            />
            <Button href="/biznesu" size="lg" className="mt-7">
              Рассчитать договор
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </Reveal>
          <Reveal delay={80}>
            <Card>
              <p className="eyebrow text-accent-ink">Ориентир по абонементу</p>
              <dl className="mt-4 space-y-3 text-[0.9375rem]">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <dt className="text-fg-muted">Объект до {B2B_RATES.includedArea} м², один визит</dt>
                  <dd className="tabular font-display text-lg font-extrabold text-accent-ink">
                    {formatPriceFrom(B2B_RATES.baseVisit)}
                    {B2B_RATES.status === 'draft' ? <DraftMark /> : null}
                  </dd>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <dt className="text-fg-muted">Каждый м² сверх включённого</dt>
                  <dd className="tabular font-semibold">
                    {formatPrice(B2B_RATES.perM2)}
                    {B2B_RATES.status === 'draft' ? <DraftMark /> : null}
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-sm text-fg-subtle">
                Частота визитов зависит от типа объекта и нормы, которая к нему применяется —
                калькулятор показывает и то, и другое.
              </p>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* Заявка */}
      <Section id="zayavka">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHead
              eyebrow="Заявка"
              title="Назовём точную цену по вашему объекту"
              lead="Опишите объект: тип, площадь, что заметили. Этого достаточно, чтобы назвать стоимость и время выезда."
            />
          </Reveal>
          <Reveal delay={80}>
            <LeadForm site="dezgarant" fallbackPhone={DEZGARANT_PHONE} withTask submitLabel="Узнать цену" />
          </Reveal>
        </div>
      </Section>

      <CallbackBar phone={DEZGARANT_PHONE} messenger={DEZGARANT_CONTACTS.messengers[0] ?? null} />
    </>
  );
}
