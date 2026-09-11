import type { Metadata } from 'next';
import { Check, ExternalLink, FileCheck2 } from 'lucide-react';
import { COMPANY, LICENSE } from '@/content/company';
import { LICENSE_DETAILS, LICENSE_FAQ } from '@/content/dezgarant/license';
import { DEZGARANT_CONTACTS, DEZGARANT_PHONE } from '@/content/dezgarant/contacts';
import { pageMetadata, jsonLdScript } from '@/lib/seo';
import { siteOrigin } from '@/lib/site';
import { Section, SectionHead } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { Reveal } from '@/components/ui/Reveal';
import { LicenseBlock } from '@/components/blocks/LicenseBlock';
import { LeadForm } from '@/components/blocks/LeadForm';
import { CallbackBar } from '@/components/blocks/CallbackBar';

export const metadata: Metadata = pageMetadata({
  site: 'dezgarant',
  path: '/licenziya',
  title: 'Лицензия ДезГаранта — проверка в реестре Роспотребнадзора',
  description:
    'Реквизиты лицензии на дезинфекцию, дезинсекцию и дератизацию: номер ЕРУЛ, регистрационный номер, дата и орган выдачи. Инструкция, как проверить лицензию в открытом реестре за минуту.',
  ogTitle: 'Лицензия Роспотребнадзора',
});

/** Пошаговая проверка. Все данные — из content/company.ts, ничего от себя. */
const CHECK_STEPS = [
  {
    title: 'Откройте открытый реестр',
    text: 'Реестр лицензий Роспотребнадзора — fp.rospotrebnadzor.ru/licen. Он бесплатный, регистрация не нужна.',
  },
  {
    title: 'Введите номер лицензии',
    text: `Номер в Едином реестре учёта лицензий (ЕРУЛ) — ${LICENSE.erul}. Искать можно и по ИНН лицензиата: ${COMPANY.inn}.`,
  },
  {
    title: 'Сверьте лицензиата и статус',
    text: `В карточке должно быть указано ${COMPANY.shortLegalName}, регистрационный номер ${LICENSE.registryNumber} и статус «${LICENSE.status}».`,
  },
  {
    title: 'Проверьте перечень работ',
    text: 'В перечне должны быть все три услуги: дезинфекция, дезинсекция, дератизация. Если у подрядчика в перечне нет нужной вам услуги — лицензия её не покрывает.',
  },
];

export default function LicensePage() {
  const origin = siteOrigin('dezgarant');

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: origin },
        { '@type': 'ListItem', position: 2, name: 'Лицензия', item: `${origin}/licenziya` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: LICENSE_FAQ.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />

      <Section compact>
        <Reveal>
          <SectionHead
            as="h1"
            eyebrow="Документы"
            title="Лицензия на дезинфекцию, дезинсекцию и дератизацию"
            lead="Все работы ДезГаранта выполняются по лицензии Роспотребнадзора. Здесь — её реквизиты, что она означает для заказчика и как проверить её самостоятельно, не поверив нам на слово."
          />
        </Reveal>
      </Section>

      <Section tone="deep">
        <Reveal>
          <LicenseBlock variant="full" points={LICENSE_DETAILS} />
        </Reveal>
      </Section>

      {/* Что именно разрешено лицензией */}
      <Section compact>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHead
              eyebrow="Содержание лицензии"
              title="Что именно разрешено"
              lead="Лицензия выдаётся не «на дезинфекцию вообще», а на конкретный вид деятельности с перечнем работ. Вот эта формулировка дословно."
            />
            <blockquote className="mt-6 border-l-2 border-accent pl-5 text-[0.9375rem] text-fg-muted">
              «{LICENSE.activity}»
            </blockquote>
            <p className="mt-5 text-sm text-fg-subtle">
              Лицензия предоставлена приказом {LICENSE.order}. Выписку из реестра мы не выкладываем
              файлом: все её данные и так открыты в реестре, и проверить их лучше там.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <Card>
              <div className="flex items-center gap-3">
                <FileCheck2 className="size-5 text-accent-ink" aria-hidden="true" />
                <p className="font-display text-lg font-extrabold">Работы в перечне лицензии</p>
              </div>
              <ul className="mt-4 space-y-2.5 text-[0.9375rem]">
                {LICENSE.works.map((work) => (
                  <li key={work} className="flex items-start gap-3">
                    <Check className="mt-0.5 size-5 shrink-0 text-accent-ink" aria-hidden="true" />
                    {work}
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-border pt-4 text-sm text-fg-subtle">
                Лицензиат — {COMPANY.shortLegalName}, ИНН {COMPANY.inn}, ОГРН {COMPANY.ogrn}. Договор
                с вами заключает это же юридическое лицо.
              </p>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* Как проверить самому */}
      <Section tone="deep" compact>
        <Reveal>
          <SectionHead
            eyebrow="Проверка за минуту"
            title="Как проверить лицензию самому"
            lead="Это стоит делать с любым подрядчиком, не только с нами: лицензия сегодня — запись в реестре, и она открыта всем."
          />
        </Reveal>

        <ol className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {CHECK_STEPS.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={index * 70} className="h-full">
                <div className="h-full border-t-2 border-accent pt-4">
                  <span className="eyebrow text-accent-ink">Шаг {index + 1}</span>
                  <p className="mt-2 font-display text-base font-extrabold leading-snug">
                    {step.title}
                  </p>
                  <p className="mt-2 text-sm text-fg-muted">{step.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal delay={200} className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <Button href={LICENSE.verifyUrl} size="lg" external>
              Открыть карточку в реестре
              <ExternalLink className="size-4" aria-hidden="true" />
            </Button>
            <a
              href={LICENSE.verifyFallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-ym="license_check_click"
              className="text-sm text-fg-muted underline underline-offset-4 transition-colors hover:text-accent-ink"
            >
              Поиск по номеру лицензии
            </a>
          </div>
        </Reveal>
      </Section>

      {/* Вопросы */}
      <Section compact>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
          <Reveal>
            <SectionHead eyebrow="Вопросы" title="О лицензии спрашивают так" />
          </Reveal>
          <Reveal delay={80}>
            <Accordion>
              {LICENSE_FAQ.map((item, index) => (
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
              title="Проверили — теперь можно к делу"
              lead="Опишите объект и задачу. Перезвоним, назовём стоимость и привезём договор с реквизитами лицензии."
            />
          </Reveal>
          <Reveal delay={80}>
            <LeadForm site="dezgarant" fallbackPhone={DEZGARANT_PHONE} withTask />
          </Reveal>
        </div>
      </Section>

      <CallbackBar phone={DEZGARANT_PHONE} messenger={DEZGARANT_CONTACTS.messengers[0] ?? null} />
    </>
  );
}
