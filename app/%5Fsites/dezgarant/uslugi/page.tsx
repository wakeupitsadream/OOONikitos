import type { Metadata } from 'next';
import { SERVICES } from '@/content/dezgarant/services';
import { DEZGARANT_RATES, PRICE_STATUS } from '@/content/dezgarant/prices';
import { DEZGARANT_PHONE } from '@/content/dezgarant/contacts';
import { pageMetadata, jsonLdScript } from '@/lib/seo';
import { siteOrigin } from '@/lib/site';
import { Section, SectionHead } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { ServiceGrid } from '@/components/blocks/ServiceGrid';
import { LeadForm } from '@/components/blocks/LeadForm';
import { CallbackBar } from '@/components/blocks/CallbackBar';
import { DEZGARANT_CONTACTS } from '@/content/dezgarant/contacts';

export const metadata: Metadata = pageMetadata({
  site: 'dezgarant',
  path: '/uslugi',
  title: 'Услуги ДезГарант в Оренбурге — дезинфекция, дезинсекция, дератизация',
  description:
    'Полный перечень услуг: тараканы, клопы, муравьи, грызуны, осы, клещи, плесень, дезинфекция, обработка после пожара и затопления, устранение запахов. Цены, гарантия, договор.',
});

export default function ServicesPage() {
  const items = SERVICES.map((service) => ({
    slug: service.slug,
    title: service.title,
    lead: service.lead,
    icon: service.icon,
    priceFrom: service.problem ? DEZGARANT_RATES.tariffs[service.problem].base : undefined,
  }));

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: siteOrigin('dezgarant') },
      { '@type': 'ListItem', position: 2, name: 'Услуги', item: `${siteOrigin('dezgarant')}/uslugi` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbs)} />

      <Section>
        <Reveal>
          <SectionHead
            eyebrow="Услуги"
            title="Что мы делаем"
            lead="Работаем по лицензии Роспотребнадзора с физическими и юридическими лицами. Цена фиксируется до начала работ, на каждую услугу даётся гарантия."
          />
        </Reveal>
        <Reveal delay={80} className="mt-10">
          <ServiceGrid items={items} priceDraft={PRICE_STATUS === 'draft'} />
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-8 max-w-2xl text-sm text-fg-subtle">
            Цены указаны за типовой объект и служат ориентиром. Точную стоимость называем после
            осмотра и фиксируем в договоре. Обработка после смерти, пожара и затопления считается
            только по осмотру — заочная цифра в этих случаях была бы обманом.
          </p>
        </Reveal>
      </Section>

      <Section id="zayavka" tone="deep">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHead
              eyebrow="Не нашли свою задачу"
              title="Опишите ситуацию — подскажем, что нужно"
              lead="Перечень на визитке не исчерпывающий: если задача похожа на нашу, скажем честно, беремся или нет."
            />
          </Reveal>
          <Reveal delay={80}>
            <LeadForm site="dezgarant" fallbackPhone={DEZGARANT_PHONE} withTask />
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
