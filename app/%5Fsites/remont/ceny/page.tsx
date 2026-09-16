import type { Metadata } from 'next';
import { ArrowRight, Check, Info } from 'lucide-react';
import {
  ALWAYS_INCLUDED,
  EXTRA_WORKS,
  SLOPE_TARIFFS,
  TARIFF_OBJECTS,
  WALL_TARIFFS,
} from '@/content/remont/prices';
import { REMONT_PHONE } from '@/content/remont/contacts';
import { pageMetadata, jsonLdScript } from '@/lib/seo';
import { siteOrigin } from '@/lib/site';
import { Section, SectionHead } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { RemontCalculator } from '@/components/blocks/RemontCalculator';
import {
  ExtraWorksTable,
  SlopeStages,
  SlopeTariffCards,
  TariffCards,
} from '@/components/blocks/RemontPricing';
import { LeadForm } from '@/components/blocks/LeadForm';

export const metadata: Metadata = pageMetadata({
  site: 'remont',
  path: '/ceny',
  title: 'Цены на ремонт и отделку в Оренбурге — тарифы за м² и прайс',
  description:
    'Три тарифа на штукатурку и шпаклёвку стен с фиксированной ценой за м², откосы за погонный метр, прайс дополнительных работ: перегородки, демонтаж, вывоз мусора. Смета в договоре.',
});

/** Что меняет смету — ровно те параметры, которые спрашивает калькулятор. */
const FACTORS = [
  {
    title: 'Площадь стен, а не комнат',
    text: 'Периметр × высота минус окна и двери. Рулетка на замере проверяет каждую цифру.',
  },
  {
    title: 'Тариф',
    text: 'Базовый, Стандарт или Премиум — от штукатурки по маякам до поверхности под покраску со шпаклёвкой. Цена за м² у каждого своя и фиксированная.',
  },
  {
    title: 'Откосы и дополнительные работы',
    text: 'Откосы считаются отдельно за погонный метр, демонтаж, перегородки и вывоз мусора — по строкам прайса.',
  },
  {
    title: 'Минимальный объём',
    text: 'У каждого тарифа свой порог: 100, 50 и 30 м². На маленьком объекте подойдёт тариф с меньшим порогом или расчёт индивидуально.',
  },
];

export default function RemontPricesPage() {
  const origin = siteOrigin('remont');

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
            title="Три тарифа на стены, откосы и прайс дополнительных работ"
            lead="Это наш прайс, а не «цены от»: стоимость тарифа за квадратный метр фиксированная, состав напечатан и записывается в договор. По этим же числам считает калькулятор."
          />
        </Reveal>

        <Reveal delay={80} className="mt-10">
          <SectionHead eyebrow="Стены" title="Тарифы за квадратный метр" />
        </Reveal>
        <Reveal delay={120} className="mt-6">
          <TariffCards tariffs={WALL_TARIFFS} />
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-5 text-sm text-fg-subtle">
            Работаем на объектах: {TARIFF_OBJECTS.join(', ').toLowerCase()}. Минимальный объём
            заказа указан в карточке тарифа.
          </p>
        </Reveal>
      </Section>

      <Section id="otkosy" tone="deep">
        <Reveal>
          <SectionHead
            eyebrow="Откосы на окна и двери"
            title="Три тарифа за погонный метр"
            lead="Качественно. Ровно. Надёжно. Откосы считаем отдельно от стен: периметр проёма без низа."
          />
        </Reveal>
        <Reveal delay={80} className="mt-8">
          <SlopeTariffCards tariffs={SLOPE_TARIFFS} />
        </Reveal>
        <Reveal delay={140} className="mt-10">
          <SectionHead eyebrow="Этапы" title="Как делаем откосы" />
        </Reveal>
        <Reveal delay={180} className="mt-6">
          <SlopeStages />
        </Reveal>
      </Section>

      <Section id="dopolnitelno">
        <Reveal>
          <SectionHead
            eyebrow="Дополнительные работы"
            title="Прайс на всё, что вокруг стен"
            lead="Перегородки, демонтаж, защита пола и мебели, доставка, грузчики и вывоз мусора — отдельными строками, чтобы в смете не было «прочего»."
          />
        </Reveal>
        <Reveal delay={80} className="mt-8">
          <ExtraWorksTable works={EXTRA_WORKS} caption="Дополнительные работы и их стоимость" />
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-3 text-sm text-fg-subtle sm:hidden">Таблица прокручивается вбок.</p>
        </Reveal>
      </Section>

      <Section tone="deep" compact>
        <Reveal>
          <Card clipped className="max-w-3xl">
            <div className="flex items-center gap-3">
              <Info className="size-5 shrink-0 text-accent-ink" aria-hidden="true" />
              <h3 className="display-md">На любом тарифе</h3>
            </div>
            <ul className="mt-4 grid gap-2.5 text-[0.9375rem] sm:grid-cols-2">
              {ALWAYS_INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-5 shrink-0 text-accent-ink" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-border pt-4 text-[0.9375rem] text-fg-muted">
              Покраска стен и поклейка обоев считаются по осмотру: цена зависит от материала и
              состояния основания. Точная стоимость называется после бесплатного замера и
              фиксируется в договоре — она не растёт, пока не меняется объём работ.
            </p>
          </Card>
        </Reveal>
      </Section>

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
            lead="Те же тарифы, но уже применённые к вашей квартире: площадь, стоимость, срок и гарантия."
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
              service="Смета на ремонт"
              fallbackPhone={REMONT_PHONE}
              submitLabel="Записаться на замер"
            />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
