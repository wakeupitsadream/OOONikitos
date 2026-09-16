import type { Metadata } from 'next';
import { ArrowRight, Check } from 'lucide-react';
import { STEPS } from '@/content/remont/services';
import { REMONT_PHONE } from '@/content/remont/contacts';
import { pageMetadata, jsonLdScript } from '@/lib/seo';
import { siteOrigin } from '@/lib/site';
import { Section, SectionHead } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { LeadForm } from '@/components/blocks/LeadForm';

export const metadata: Metadata = pageMetadata({
  site: 'remont',
  path: '/etapy',
  title: 'Как мы работаем: шесть шагов от заявки до сдачи объекта',
  description:
    'Как идёт ремонт: заявка, бесплатный замер, детальная смета, договор с фиксированной стоимостью, работы под контролем прораба, приёмка по акту. Оплата поэтапно.',
});

/** Что остаётся у заказчика после каждого этапа — по тексту самих этапов. */
const RESULTS = [
  'Мы связываемся с вами и уточняем задачу и удобное время замера',
  'Измеренная площадь стен, погонные метры откосов и состояние основания',
  'Детальная смета по тарифу и прайсу — без строки «прочее»',
  'Договор с фиксированной стоимостью и сроками',
  'Работы под контролем прораба, фото- и видеоотчёты по каждому этапу',
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
    name: 'Как проходит ремонт: шесть шагов',
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
            title="Как проходит работа — шесть шагов от заявки до акта"
            lead="Порядок один и тот же на любом объёме: сначала считаем, потом договариваемся, потом работаем. Ни один шаг не начинается, пока не закрыт предыдущий."
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

    </>
  );
}
