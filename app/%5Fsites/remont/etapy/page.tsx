import type { Metadata } from 'next';
import { ArrowRight, Check } from 'lucide-react';
import { STEPS } from '@/content/remont/services';
import { REMONT_CONTACTS, REMONT_PHONE } from '@/content/remont/contacts';
import { pageMetadata, jsonLdScript } from '@/lib/seo';
import { siteOrigin } from '@/lib/site';
import { Section, SectionHead } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { LeadForm } from '@/components/blocks/LeadForm';
import { CallbackBar } from '@/components/blocks/CallbackBar';

export const metadata: Metadata = pageMetadata({
  site: 'remont',
  path: '/etapy',
  title: 'Этапы работ по отделке стен в Оренбурге — от замера до акта',
  description:
    'Как проходит ремонт стен: бесплатный замер, смета и договор, подготовка, основные работы с паузами на сушку, приёмка по акту. Оплата по этапам после приёмки предыдущего.',
});

/** Что остаётся у заказчика после каждого этапа — по тексту самих этапов. */
const RESULTS = [
  'Измеренная площадь стен и понятное состояние основания',
  'Договор со стоимостью и сроком, смета по фактическому объёму',
  'Защищённые зоны вне ремонта, подготовленное основание и выставленные маяки',
  'График работ, который соблюдается вместе с паузами на сушку',
  'Подписанный акт: замечания устраняются до подписания, а не после',
];

export default function RemontStepsPage() {
  const origin = siteOrigin('remont');

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: origin },
      { '@type': 'ListItem', position: 2, name: 'Этапы', item: `${origin}/etapy` },
    ],
  };

  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Как проходит отделка стен',
    step: STEPS.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.text,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript([breadcrumbs, howTo])}
      />

      <Section>
        <Reveal>
          <SectionHead
            as="h1"
            eyebrow="Этапы"
            title="Как проходит работа — от первого звонка до акта"
            lead="Порядок один и тот же на любом объёме: сначала считаем, потом договариваемся, потом работаем. Ни один этап не начинается, пока не закрыт предыдущий."
          />
        </Reveal>

        <ol className="mt-12 space-y-8">
          {STEPS.map((step, index) => (
            <Reveal key={step.title} delay={index * 60}>
              <li className="grid gap-4 border-t border-border pt-6 md:grid-cols-[auto_1fr_1fr] md:gap-8">
                <span className="tabular font-display text-3xl font-black leading-none text-accent-ink md:text-4xl">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h2 className="display-md">{step.title}</h2>
                  <p className="mt-3 text-[0.9375rem] text-fg-muted">{step.text}</p>
                </div>
                <p className="flex items-start gap-3 text-[0.9375rem] md:pt-1">
                  <Check className="mt-0.5 size-5 shrink-0 text-accent-ink" aria-hidden="true" />
                  <span>
                    <span className="eyebrow block text-fg-subtle">Результат этапа</span>
                    <span className="mt-1.5 block text-fg-muted">{RESULTS[index]}</span>
                  </span>
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* TODO_OWNER: доли платежей по этапам владельцем не подтверждены —
          показываем принцип, без процентов. */}
      <Section id="oplata" tone="deep">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHead
              eyebrow="Оплата"
              title="Не платите за этап, пока не приняли предыдущий"
              lead="Оплата разбита по этапам и идёт за результатом. Порядок платежей прописывается в договоре вместе с составом и сроками работ."
            />
            <Button href="/#raschet" size="lg" className="mt-7">
              Посчитать стоимость
              <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
            </Button>
          </Reveal>
          <Reveal delay={80}>
            <Card clipped>
              <ul className="space-y-3 text-[0.9375rem]">
                {[
                  'Замер и смета — бесплатно, до подписания договора',
                  'Оплата по этапам, а не всей суммой вперёд',
                  'Этап закрывается после того, как вы его приняли',
                  'Объём вырос — согласуем письменно до начала работ',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="mt-0.5 size-5 shrink-0 text-accent-ink" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-border pt-4 text-sm text-fg-subtle">
                Конкретные доли платежей зависят от объёма и фиксируются в договоре — на сайте мы
                их не публикуем, чтобы не обещать того, что придётся менять.
              </p>
            </Card>
          </Reveal>
        </div>
      </Section>

      <Section id="zayavka" compact>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHead
              eyebrow="Первый этап"
              title="Начинается с бесплатного замера"
              lead="Приедем, измерим стены, проверим геометрию основания и посчитаем смету. Дальше — только по договору."
            />
          </Reveal>
          <Reveal delay={80}>
            <LeadForm
              site="remont"
              service="Замер стен"
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
