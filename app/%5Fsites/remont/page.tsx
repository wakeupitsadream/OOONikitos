import Link from 'next/link';
import { ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { COMPANY } from '@/content/company';
import { REMONT_PHONE } from '@/content/remont/contacts';
import { GUARANTEES, PUBLISHED_SERVICES, REMONT_FAQ, STEPS } from '@/content/remont/services';
import { MIN_ORDER, PRICE_STATUS, ROOM_PRESETS, WORK_RATES } from '@/content/remont/prices';
import { HAS_PORTFOLIO, PORTFOLIO } from '@/content/remont/portfolio';
import { calcRemont, totalWallArea, type Room } from '@/lib/calc/remont';
import { jsonLdScript } from '@/lib/seo';
import { siteOrigin, siteUrl } from '@/lib/site';
import { formatPrice, pluralize } from '@/lib/plural';
import { Section, SectionHead } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { DraftMark } from '@/components/ui/Badge';
import { Reveal } from '@/components/ui/Reveal';
import { HeroRemont } from '@/components/blocks/HeroRemont';
import { RemontCalculator } from '@/components/blocks/RemontCalculator';
import { BeforeAfter } from '@/components/blocks/BeforeAfter';
import { ServiceGrid } from '@/components/blocks/ServiceGrid';
import { LeadForm } from '@/components/blocks/LeadForm';

/**
 * Главная «Бриллиант Ремонт» (§6.2 плана).
 * Ни одной цифры «из головы»: сроки в таблице считает тот же lib/calc/remont,
 * что и калькулятор, гарантии — дословно с визитки, проценты поэтапной
 * оплаты не выдуманы и потому не показаны.
 */

const PRESETS = new Map(ROOM_PRESETS.map((preset) => [preset.id, preset]));

function roomsOf(ids: string[]): Room[] {
  return ids.flatMap((id) => {
    const preset = PRESETS.get(id);
    return preset
      ? [
          {
            length: preset.length,
            width: preset.width,
            height: preset.height,
            windows: preset.windows,
            doors: preset.doors,
          },
        ]
      : [];
  });
}

/** Типовые объекты собраны из тех же комнат, что предлагает калькулятор. */
const TYPICAL_OBJECTS = [
  { id: 'room', label: 'Одна комната', composition: 'комната 18 м²', rooms: ['room-medium'] },
  {
    id: 'flat-1',
    label: 'Однокомнатная квартира',
    composition: 'комната 18 м² + кухня 10 м² + прихожая 6 м²',
    rooms: ['room-medium', 'kitchen', 'hall'],
  },
  {
    id: 'flat-2',
    label: 'Двухкомнатная квартира',
    composition: 'комнаты 18 и 12 м² + кухня 10 м² + прихожая 6 м²',
    rooms: ['room-medium', 'room-small', 'kitchen', 'hall'],
  },
  { id: 'bath', label: 'Санузел', composition: 'санузел 4 м²', rooms: ['bath'] },
];

function timingRows() {
  return TYPICAL_OBJECTS.map((object) => {
    const rooms = roomsOf(object.rooms);
    const base = { rooms, condition: 'normal' as const, minOrder: MIN_ORDER };
    const plaster = calcRemont({ ...base, works: ['shtukaturka'] }, WORK_RATES);
    const full = calcRemont({ ...base, works: ['shtukaturka', 'shpaklevka'] }, WORK_RATES);
    return {
      id: object.id,
      label: object.label,
      composition: object.composition,
      area: Math.round(totalWallArea(rooms)),
      plasterDays: plaster.workDays,
      fullDays: full.workDays,
    };
  });
}

function jsonLd() {
  const origin = siteOrigin('remont');
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'HomeAndConstructionBusiness',
      '@id': `${origin}#business`,
      name: 'Бриллиант Ремонт',
      description:
        'Штукатурка, шпаклёвка, покраска стен и поклейка обоев в Оренбурге. Фиксированная смета в договоре.',
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
        name: 'Отделка стен',
        itemListElement: PUBLISHED_SERVICES.map((service) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: service.title },
          url: `${origin}/uslugi/${service.slug}`,
        })),
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
  }));
  const rows = timingRows();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd())} />

      <HeroRemont />

      {/* Вау-фича: калькулятор стен */}
      <Section id="raschet" tone="deep">
        <Reveal>
          <SectionHead
            eyebrow="Расчёт за минуту"
            title="Посчитайте стены до звонка"
            lead="Добавьте комнаты, отметьте работы — покажем площадь стен, вилку стоимости и срок в рабочих днях. Без «оставьте заявку, менеджер перезвонит»."
          />
        </Reveal>
        <Reveal delay={80} className="mt-8">
          <RemontCalculator phone={REMONT_PHONE} />
        </Reveal>
      </Section>

      {/* Услуги */}
      <Section id="uslugi">
        <Reveal>
          <SectionHead
            eyebrow="Услуги"
            title="Что делаем со стенами"
            lead="Четыре работы, которые закрывают отделку стен от голого основания до готовой поверхности. Берёмся и за отдельный этап, и за всю цепочку."
          />
        </Reveal>
        <Reveal delay={80} className="mt-8">
          <ServiceGrid items={services} basePath="/uslugi" />
        </Reveal>
        <Reveal delay={140} className="mt-8 flex flex-wrap items-center gap-4">
          <Button href="/ceny" variant="outline" size="lg">
            Расценки за м²
            <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
          </Button>
          <p className="text-sm text-fg-subtle">
            Стоимость считается за квадратный метр стен, а не «за комнату».
          </p>
        </Reveal>
      </Section>

      {/* Портфолио — только с реальными фото объектов */}
      {HAS_PORTFOLIO ? (
        <Section id="portfolio" tone="deep">
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

      {/* Гарантии — дословно с оборота визитки.
          Светлая мраморная панель: лицевая сторона визитки внутри чёрного сайта. */}
      <Section id="garantii" tone="deep">
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
              <h2 className="display-lg mt-3">Четыре обещания с нашей визитки</h2>
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-[color-mix(in_srgb,var(--color-ink)_78%,transparent)]">
                Это не рекламные формулировки, а то, что напечатано на карточке, которую мы
                отдаём клиенту в руки.
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

            <p className="relative mt-9 flex items-center gap-3 border-t border-[color-mix(in_srgb,var(--color-ink)_15%,transparent)] pt-5 text-sm text-[color-mix(in_srgb,var(--color-ink)_70%,transparent)]">
              <ShieldCheck
                className="size-5 shrink-0 text-[var(--color-gold-deep)]"
                aria-hidden="true"
              />
              Всё перечисленное закрепляется договором — это проверяется до начала работ.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* Этапы */}
      <Section id="etapy">
        <Reveal>
          <SectionHead
            eyebrow="Как идёт работа"
            title="Пять этапов — от замера до акта"
            lead="Каждый этап заканчивается результатом, который можно проверить."
          />
        </Reveal>
        <ol className="mt-10 grid gap-5 md:grid-cols-3 lg:grid-cols-5">
          {STEPS.map((step, index) => (
            <Reveal key={step.title} delay={index * 70}>
              <li className="h-full border-t-2 border-accent pt-4">
                <span className="eyebrow text-accent-ink">Этап {index + 1}</span>
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

      {/* Поэтапная оплата: принцип без выдуманных процентов.
          TODO_OWNER: схема «аванс X % → этап → приёмка» ждёт цифр владельца. */}
      <Section id="oplata" tone="deep">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHead
              eyebrow="Оплата"
              title="Не платите за этап, пока не приняли предыдущий"
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

      {/* Сроки: те же формулы, что в калькуляторе */}
      <Section id="sroki">
        <Reveal>
          <SectionHead
            eyebrow="Сроки"
            title="Сколько дней занимают типовые объекты"
            lead="Это не «в среднем по рынку», а расчёт по нашей норме выработки и площади стен — тот же, что выдаёт калькулятор выше. Технологические паузы на сушку уже внутри."
          />
        </Reveal>
        <Reveal delay={80} className="mt-8">
          <div className="overflow-x-auto rounded-[var(--radius-md)] border border-border">
            <table className="w-full min-w-[34rem] border-collapse text-left text-[0.9375rem]">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Объект
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Стены
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Штукатурка
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    + шпаклёвка
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3">
                      <span className="font-semibold">{row.label}</span>
                      <span className="block text-sm text-fg-subtle">{row.composition}</span>
                    </td>
                    <td className="tabular px-4 py-3 whitespace-nowrap">{row.area} м²</td>
                    <td className="tabular px-4 py-3 whitespace-nowrap">
                      {pluralize(row.plasterDays, 'день', 'дня', 'дней')}
                    </td>
                    <td className="tabular px-4 py-3 whitespace-nowrap">
                      {pluralize(row.fullDays, 'день', 'дня', 'дней')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-3 text-sm text-fg-subtle sm:hidden">
            Таблица прокручивается вбок.
          </p>
          <p className="mt-5 max-w-3xl text-sm text-fg-subtle">
            Дни рабочие. Высота потолка 2,7 м, из площади вычтены окна и двери.
            {PRICE_STATUS === 'draft'
              ? ' Норма выработки пока черновая — после подтверждения владельцем таблица пересчитается автоматически.'
              : ''}
          </p>
        </Reveal>
      </Section>

      {/* TODO_OWNER: образцы договора, сметы, акта и гарантийного талона (PDF).
          Без файлов секция «Документы» не рендерится. */}

      {/* Один подрядчик: ремонт и обработка помещения */}
      <Section id="odin-podryadchik" tone="deep">
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
                  'Один договор и одно юридическое лицо на обе задачи',
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
              lead="Приедем, измерим стены, проверим геометрию основания и посчитаем смету. Замер бесплатный."
            />
            <p className="mt-8 max-w-sm text-[0.9375rem] text-fg-muted">
              {COMPANY.shortLegalName} · ИНН {COMPANY.inn}
              <br />
              Работаем с физическими и юридическими лицами: договор, смета, акты.
            </p>
            <p className="tabular mt-4 text-sm text-fg-subtle">
              Минимальный заказ — {formatPrice(MIN_ORDER)}
              {PRICE_STATUS === 'draft' ? <DraftMark /> : null}
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
