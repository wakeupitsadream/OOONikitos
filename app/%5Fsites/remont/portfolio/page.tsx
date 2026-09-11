import type { Metadata } from 'next';
import { Camera, Ruler } from 'lucide-react';
import { HAS_PORTFOLIO, PORTFOLIO } from '@/content/remont/portfolio';
import { REMONT_CONTACTS, REMONT_PHONE } from '@/content/remont/contacts';
import { pageMetadata, jsonLdScript } from '@/lib/seo';
import { siteOrigin } from '@/lib/site';
import { pluralize } from '@/lib/plural';
import { Section, SectionHead } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { BeforeAfter } from '@/components/blocks/BeforeAfter';
import { LeadForm } from '@/components/blocks/LeadForm';
import { CallbackBar } from '@/components/blocks/CallbackBar';

export const metadata: Metadata = pageMetadata({
  site: 'remont',
  path: '/portfolio',
  title: 'Наши работы — отделка стен в Оренбурге',
  description:
    'Объекты «Бриллиант Ремонт» в Оренбурге: фото до и после, площадь стен, состав работ и срок. Показываем только свои объекты — без стоковых фотографий.',
});

/** Что будет в карточке каждого объекта, когда появятся фото. */
const PROMISED = [
  'Один и тот же ракурс до и после — без «удачного угла» и подмены кадра',
  'Площадь стен в квадратных метрах и состав выполненных работ',
  'Срок в рабочих днях — сколько объект реально занял',
  'Что было сложного и как решили: завалы, сырые стены, сжатые сроки',
];

export default function RemontPortfolioPage() {
  const origin = siteOrigin('remont');

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: origin },
      { '@type': 'ListItem', position: 2, name: 'Работы', item: `${origin}/portfolio` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbs)} />

      {HAS_PORTFOLIO ? (
        <>
          <Section>
            <Reveal>
              <SectionHead
                as="h1"
                eyebrow="Работы"
                title="Было — стало"
                lead="Свои объекты в Оренбурге: тот же кадр до и после, площадь стен, состав работ и срок."
              />
            </Reveal>
            <div className="mt-10 grid gap-10 lg:grid-cols-2">
              {PORTFOLIO.map((item, index) => (
                <Reveal key={item.id} delay={index * 70}>
                  <article>
                    <BeforeAfter
                      beforeSrc={item.beforeSrc}
                      afterSrc={item.afterSrc}
                      alt={`${item.title}, ${item.district}`}
                    />
                    <h2 className="display-md mt-5">{item.title}</h2>
                    <p className="tabular mt-2 text-sm text-fg-subtle">
                      {item.district} · {item.area} м² стен ·{' '}
                      {pluralize(item.durationDays, 'рабочий день', 'рабочих дня', 'рабочих дней')}
                    </p>
                    <p className="mt-3 text-[0.9375rem] text-fg-muted">{item.comment}</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {item.works.map((work) => (
                        <li
                          key={work}
                          className="rounded-[var(--radius-xs)] bg-surface-2 px-2.5 py-1 text-sm text-fg-muted"
                        >
                          {work}
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              ))}
            </div>
          </Section>
        </>
      ) : (
        <Section>
          <Reveal>
            <SectionHead
              as="h1"
              eyebrow="Работы"
              title="Портфолио собирается"
              lead="Здесь будут наши объекты в Оренбурге — с фотографиями до и после. Пока их нет на сайте, и мы не станем подставлять вместо них чужие снимки из интернета: стены на картинке должны быть те самые, которые сделала наша бригада."
            />
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
            <Reveal delay={80}>
              <Card clipped className="h-full">
                <div className="flex items-center gap-3">
                  <Camera className="size-5 shrink-0 text-accent-ink" aria-hidden="true" />
                  <p className="display-md">Что здесь появится</p>
                </div>
                <ul className="mt-5 space-y-2.5 text-[0.9375rem]">
                  {PROMISED.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        className="mt-2 size-1.5 shrink-0 rotate-45 bg-accent"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-border pt-4 text-sm text-fg-subtle">
                  Сравнение «до/после» будет с подвижной линией: её можно тянуть мышью, пальцем
                  или стрелками с клавиатуры.
                </p>
              </Card>
            </Reveal>

            <Reveal delay={140}>
              <Card className="h-full">
                <div className="flex items-center gap-3">
                  <Ruler className="size-5 shrink-0 text-accent-ink" aria-hidden="true" />
                  <p className="display-md">Чем проверить нас сейчас</p>
                </div>
                <p className="mt-4 text-[0.9375rem] text-fg-muted">
                  Замер бесплатный и ни к чему не обязывает. На нём видно то, чего не покажет ни
                  одна фотография: как считают площадь, что говорят про состояние стен и что
                  именно попадёт в смету. Стоимость фиксируется договором — это проверяется до
                  начала работ, а не после.
                </p>
                <p className="mt-4 text-[0.9375rem] text-fg-muted">
                  Работаем от ООО «Белые Нити»: договор, смета, акты выполненных работ.
                </p>
              </Card>
            </Reveal>
          </div>
        </Section>
      )}

      <Section id="zayavka" tone="deep">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHead
              eyebrow="Заявка"
              title="Начнём с замера"
              lead="Приедем, измерим стены и посчитаем смету. Если по итогу решите не делать — ничего не должны."
            />
          </Reveal>
          <Reveal delay={80}>
            <LeadForm
              site="remont"
              service="Заявка со страницы работ"
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
