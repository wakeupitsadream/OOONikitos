import type { Metadata } from 'next';
import { ArrowRight, Info } from 'lucide-react';
import { MIN_ORDER, PRICE_STATUS, WORK_RATES } from '@/content/remont/prices';
import { REMONT_CONTACTS, REMONT_PHONE } from '@/content/remont/contacts';
import { pageMetadata, jsonLdScript } from '@/lib/seo';
import { siteOrigin } from '@/lib/site';
import { formatPrice, pluralize } from '@/lib/plural';
import { Section, SectionHead } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DraftMark } from '@/components/ui/Badge';
import { Reveal } from '@/components/ui/Reveal';
import { RemontCalculator } from '@/components/blocks/RemontCalculator';
import { LeadForm } from '@/components/blocks/LeadForm';
import { CallbackBar } from '@/components/blocks/CallbackBar';

export const metadata: Metadata = pageMetadata({
  site: 'remont',
  path: '/ceny',
  title: 'Цены на отделку стен в Оренбурге — штукатурка, шпаклёвка, покраска',
  description:
    'Расценки за квадратный метр стен: штукатурка, шпаклёвка, покраска, обои. Норма выработки, технологические паузы, минимальный заказ. Смета фиксируется договором после замера.',
});

/** Что меняет смету — это ровно те параметры, которые спрашивает калькулятор. */
const FACTORS = [
  {
    title: 'Площадь стен, а не комнат',
    text: 'Периметр × высота минус окна и двери. Рулетка на замере проверяет каждую цифру.',
  },
  {
    title: 'Состав работ',
    text: 'Штукатурка, шпаклёвка, покраска и обои считаются отдельными строками — вы платите за то, что реально делаем.',
  },
  {
    title: 'Состояние основания',
    text: 'Завалы, перепады и осыпающаяся старая отделка требуют большего слоя и времени, поэтому дают надбавку.',
  },
  {
    title: 'Высота потолка',
    text: 'Выше 2,7 м — больше площади и работа с подмостей. Это видно на замере и сразу входит в смету.',
  },
];

export default function RemontPricesPage() {
  const origin = siteOrigin('remont');
  const draft = PRICE_STATUS === 'draft';

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

      <Section>
        <Reveal>
          <SectionHead
            as="h1"
            eyebrow="Цены"
            title="Расценки за квадратный метр стен"
            lead="Одна таблица на все работы: ставка, норма выработки и технологическая пауза. По этим же числам считает калькулятор — других цифр «для клиента» у нас нет."
          />
        </Reveal>

        <Reveal delay={80} className="mt-8">
          <div className="overflow-x-auto rounded-[var(--radius-md)] border border-border">
            <table className="w-full min-w-[38rem] border-collapse text-left text-[0.9375rem]">
              <caption className="sr-only">
                Стоимость работ по отделке стен за квадратный метр, норма выработки и пауза на
                высыхание
              </caption>
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Работа
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Цена за м²
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Норма в день
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Пауза на сушку
                  </th>
                </tr>
              </thead>
              <tbody>
                {WORK_RATES.map((rate) => (
                  <tr key={rate.id} className="border-b border-border last:border-b-0">
                    <th scope="row" className="px-4 py-3 text-left font-semibold">
                      {rate.label}
                    </th>
                    <td className="tabular px-4 py-3 whitespace-nowrap">
                      {formatPrice(rate.pricePerM2)}
                      {rate.status === 'draft' ? <DraftMark /> : null}
                    </td>
                    <td className="tabular px-4 py-3 whitespace-nowrap">{rate.m2PerDay} м²</td>
                    <td className="tabular px-4 py-3 whitespace-nowrap">
                      {rate.dryingDays > 0
                        ? pluralize(rate.dryingDays, 'день', 'дня', 'дней')
                        : 'не нужна'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={140} className="mt-6">
          <p className="tabular text-[0.9375rem]">
            Минимальный заказ — <strong>{formatPrice(MIN_ORDER)}</strong>
            {draft ? <DraftMark /> : null}
            <span className="block text-sm text-fg-subtle">
              На маленьком объёме бригада всё равно выезжает, закупает материал и тратит рабочий
              день.
            </span>
          </p>
        </Reveal>
      </Section>

      {/* Честный источник цифр: без этого блока прайс выглядел бы утверждённым */}
      {draft ? (
        <Section tone="deep" compact>
          <Reveal>
            <Card clipped className="max-w-3xl">
              <div className="flex items-center gap-3">
                <Info className="size-5 shrink-0 text-accent-ink" aria-hidden="true" />
                <p className="display-md">Откуда эти цифры</p>
              </div>
              <p className="mt-4 text-[0.9375rem] text-fg-muted">
                Это рыночный ориентир, а не утверждённый прайс — поэтому рядом с каждой ставкой
                стоит пометка «уточняется». Поштучных расценок на штукатурку, шпаклёвку, покраску
                и обои по Оренбургу в открытых источниках нет: конкуренты публикуют только общие
                ставки отделки «под ключ» — 2 490–3 490 ₽ за м² пола. Из них и выведены значения
                в таблице.
              </p>
              <p className="mt-3 text-[0.9375rem] text-fg-muted">
                Точная стоимость называется после замера и фиксируется в договоре. Она не растёт,
                пока не меняется объём работ.
              </p>
            </Card>
          </Reveal>
        </Section>
      ) : null}

      <Section compact>
        <Reveal>
          <SectionHead eyebrow="Смета" title="Что на неё влияет" />
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {FACTORS.map((factor, index) => (
            <Reveal key={factor.title} delay={index * 70}>
              <div className="h-full border-t-2 border-accent pt-4">
                <p className="font-display text-base font-extrabold leading-snug">
                  {factor.title}
                </p>
                <p className="mt-2 text-sm text-fg-muted">{factor.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="raschet" tone="deep">
        <Reveal>
          <SectionHead
            eyebrow="Расчёт"
            title="Посчитайте свои стены"
            lead="Те же ставки, но уже применённые к вашей квартире: площадь, вилка стоимости и срок в рабочих днях."
          />
        </Reveal>
        <Reveal delay={80} className="mt-8">
          <RemontCalculator phone={REMONT_PHONE} />
        </Reveal>
      </Section>

      <Section id="zayavka" compact>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHead
              eyebrow="Заявка"
              title="Нужна точная смета"
              lead="Замер бесплатный: приедем, измерим стены, проверим основание и посчитаем по факту."
            />
            <Button href="/uslugi" variant="outline" className="mt-7">
              Посмотреть состав работ
              <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
            </Button>
          </Reveal>
          <Reveal delay={80}>
            <LeadForm
              site="remont"
              service="Смета на отделку стен"
              fallbackPhone={REMONT_PHONE}
              submitLabel="Записаться на замер"
            />
          </Reveal>
        </div>
      </Section>

      <CallbackBar
        phone={REMONT_PHONE}
        messenger={REMONT_CONTACTS.messengers[0] ?? null}
        formHref="#zayavka"
      />
    </>
  );
}
