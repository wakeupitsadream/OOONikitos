import type { Metadata } from 'next';
import { AlertTriangle, Check, FileText } from 'lucide-react';
import { OBLIGATIONS, DOCUMENT_PACKAGE, FREQUENCY_NOTE, LICENSE_DETAILS } from '@/content/dezgarant/license';
import { DEZGARANT_CONTACTS, DEZGARANT_PHONE } from '@/content/dezgarant/contacts';
import { pageMetadata, jsonLdScript } from '@/lib/seo';
import { siteOrigin } from '@/lib/site';
import { Section, SectionHead } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { B2bCalculator } from '@/components/blocks/B2bCalculator';
import { LeadForm } from '@/components/blocks/LeadForm';
import { CallbackBar } from '@/components/blocks/CallbackBar';

export const metadata: Metadata = pageMetadata({
  site: 'dezgarant',
  path: '/biznesu',
  title: 'Дезинфекция и дератизация для бизнеса в Оренбурге — договор и акты',
  description:
    'Абонентское обслуживание кафе, магазинов, управляющих компаний, складов, детских и медицинских организаций в Оренбурге. Договор, журнал учёта, акты для проверки Роспотребнадзора.',
  ogTitle: 'Обслуживание организаций',
});

export default function BusinessPage() {
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: siteOrigin('dezgarant') },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Бизнесу',
        item: `${siteOrigin('dezgarant')}/biznesu`,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbs)} />

      <Section>
        <Reveal>
          <SectionHead
            as="h1"
            eyebrow="Организациям"
            title="Дезинфекция и дератизация для бизнеса в Оренбурге"
            lead="Проверка Роспотребнадзора смотрит не на чистоту в моменте, а на то, можете ли вы подтвердить проведённые мероприятия. Мы даём комплект, который это подтверждает."
          />
        </Reveal>
      </Section>

      {/* Кому обязательно */}
      <Section tone="deep" compact>
        <Reveal>
          <SectionHead eyebrow="Кому обязательно" title="И на каком основании" />
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {OBLIGATIONS.map((item, index) => (
            <Reveal key={item.id} delay={index * 60}>
              <Card className="h-full">
                <p className="font-display text-lg font-extrabold leading-snug">{item.title}</p>
                <p className="mt-2 text-[0.9375rem] text-fg-muted">{item.text}</p>
                <p className="mt-3 border-t border-border pt-3 text-xs text-fg-subtle">
                  {item.norm}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Периодичность */}
      <Section compact>
        <Reveal>
          <Card className="border-l-4 border-l-accent">
            <div className="flex items-start gap-4">
              <AlertTriangle className="mt-1 size-6 shrink-0 text-[var(--warn)]" aria-hidden="true" />
              <div>
                <p className="display-md">Как часто нужны обработки</p>
                <p className="mt-3 text-[0.9375rem] text-fg-muted">{FREQUENCY_NOTE}</p>
              </div>
            </div>
          </Card>
        </Reveal>
      </Section>

      {/* Калькулятор */}
      <Section id="raschet" tone="deep">
        <Reveal>
          <SectionHead
            eyebrow="Расчёт обслуживания"
            title="Сколько стоит договор на ваш объект"
            lead="Ни одна служба в Оренбурге не публикует абонентские тарифы. Мы показываем — вместе с нормой, на которой основана частота визитов."
          />
        </Reveal>
        <Reveal delay={80} className="mt-8">
          <B2bCalculator phone={DEZGARANT_PHONE} />
        </Reveal>
      </Section>

      {/* Пакет документов */}
      <Section compact>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHead
              eyebrow="Пакет документов"
              title="Что вы показываете инспектору"
              lead="Комплект собирается по ходу обслуживания — его не нужно готовить перед проверкой."
            />
            <p className="mt-6 text-sm text-fg-subtle">
              Образцы договора, акта и журнала пришлём по запросу вместе с расчётом.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <Card>
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-accent-ink" aria-hidden="true" />
                <p className="font-display text-lg font-extrabold">В комплект входит</p>
              </div>
              <ul className="mt-4 space-y-2.5 text-[0.9375rem]">
                {DOCUMENT_PACKAGE.map((item) => (
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

      {/* Почему лицензия важна заказчику */}
      <Section tone="deep" compact>
        <Reveal>
          <SectionHead
            eyebrow="Почему это важно"
            title="Риски работы с нелицензированным подрядчиком"
          />
        </Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {LICENSE_DETAILS.slice(0, 6).map((point, index) => (
            <Reveal key={point.title} delay={index * 60}>
              <div className="h-full border-l-2 border-accent pl-5">
                <p className="font-display text-base font-extrabold leading-snug">{point.title}</p>
                <p className="mt-2 text-[0.9375rem] text-fg-muted">{point.text}</p>
                <p className="mt-2 text-xs text-fg-subtle">{point.source}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="zayavka">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHead
              eyebrow="Заявка"
              title="Запросить договор"
              lead="Опишите объект: тип, площадь, что уже было. Пришлём расчёт, график и проект договора."
            />
          </Reveal>
          <Reveal delay={80}>
            <LeadForm
              site="dezgarant"
              service="Договор на обслуживание"
              withTask
              fallbackPhone={DEZGARANT_PHONE}
              title="Запросить договор"
              lead="Перезвоним в рабочее время и согласуем обследование объекта."
              submitLabel="Запросить договор"
            />
          </Reveal>
        </div>
      </Section>

      <CallbackBar
        phone={DEZGARANT_PHONE}
        messenger={DEZGARANT_CONTACTS.messengers[0] ?? null}
      />
    </>
  );
}
