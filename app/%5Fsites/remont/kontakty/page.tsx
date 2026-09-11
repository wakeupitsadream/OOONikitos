import type { Metadata } from 'next';
import { MapPin, MessageCircle, Phone } from 'lucide-react';
import { COMPANY } from '@/content/company';
import { REMONT_CONTACTS, REMONT_MESSENGER, REMONT_PHONE } from '@/content/remont/contacts';
import { pageMetadata, jsonLdScript } from '@/lib/seo';
import { siteOrigin } from '@/lib/site';
import { formatPhone, telHref } from '@/lib/phone';
import { Section, SectionHead } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { CoverageMap } from '@/components/blocks/CoverageMap';
import { LeadForm } from '@/components/blocks/LeadForm';
import { CallbackBar } from '@/components/blocks/CallbackBar';

export const metadata: Metadata = pageMetadata({
  site: 'remont',
  path: '/kontakty',
  title: 'Контакты «Бриллиант Ремонт» — Оренбург и область',
  description:
    'Телефон +7 951 037-70-08 и мессенджер MAX. Отделка стен в Оренбурге и Оренбургской области. Замер бесплатный, смета фиксируется договором. ООО «Белые Нити».',
});

export default function RemontContactsPage() {
  const origin = siteOrigin('remont');

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Контакты «Бриллиант Ремонт»',
      url: `${origin}/kontakty`,
      about: { '@id': `${origin}#business` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: origin },
        { '@type': 'ListItem', position: 2, name: 'Контакты', item: `${origin}/kontakty` },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />

      <Section>
        <Reveal>
          <SectionHead
            as="h1"
            eyebrow="Контакты"
            title="Позвоните или напишите — ответим по делу"
            lead="Расскажите, что за объект и что нужно сделать. Если по телефону видно, что задача не наша, скажем сразу и не будем звать на замер."
          />
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {REMONT_PHONE ? (
            <Reveal>
              <Card className="h-full">
                <Phone className="size-5 text-accent-ink" aria-hidden="true" />
                <p className="eyebrow mt-4 text-fg-subtle">Телефон</p>
                <a
                  href={telHref(REMONT_PHONE)}
                  data-ym="phone_click"
                  className="mt-2 block font-display text-2xl font-black tracking-tight transition-colors hover:text-accent-ink"
                >
                  {formatPhone(REMONT_PHONE)}
                </a>
                <p className="mt-3 text-[0.9375rem] text-fg-muted">
                  Звонок — самый быстрый способ: сразу назовём, что нужно для расчёта.
                </p>
              </Card>
            </Reveal>
          ) : null}

          {REMONT_MESSENGER ? (
            <Reveal delay={80}>
              <Card className="h-full">
                <MessageCircle className="size-5 text-accent-ink" aria-hidden="true" />
                <p className="eyebrow mt-4 text-fg-subtle">Мессенджер</p>
                <p className="mt-2 font-display text-2xl font-black tracking-tight">MAX</p>
                <p className="mt-3 text-[0.9375rem] text-fg-muted">
                  Удобно прислать фото стен и планировку — по ним уже видно объём работы.
                </p>
                <Button
                  href={REMONT_MESSENGER.url}
                  variant="outline"
                  className="mt-5"
                >
                  {REMONT_MESSENGER.label}
                </Button>
              </Card>
            </Reveal>
          ) : null}
        </div>

        {/* Офис и часы работы владелец не подтвердил (TODO_OWNER) — не показываем. */}
        <Reveal delay={140}>
          <p className="mt-8 max-w-2xl text-sm text-fg-subtle">
            {COMPANY.shortLegalName} · ИНН {COMPANY.inn} · ОГРН {COMPANY.ogrn}. Работаем с
            физическими и юридическими лицами: договор, смета, акты выполненных работ.
          </p>
        </Reveal>
      </Section>

      <Section tone="deep">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHead
              eyebrow="Зона выезда"
              title={REMONT_CONTACTS.areaServed}
              lead="Работаем в городе и выезжаем по области. Выезд за пределы Оренбурга считается отдельно и называется до замера — сюрпризов в смете быть не должно."
            />
            <p className="mt-6 flex items-center gap-2 text-[0.9375rem] text-fg-muted">
              <MapPin className="size-4 shrink-0 text-accent-ink" aria-hidden="true" />
              {COMPANY.city}, {COMPANY.region}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <div className="rounded-[var(--radius-md)] border border-border bg-surface p-6">
              <CoverageMap />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="zayavka">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHead
              eyebrow="Заявка"
              title="Оставьте заявку на замер"
              lead="Перезвоним, уточним детали и согласуем время. Замер бесплатный."
            />
          </Reveal>
          <Reveal delay={80}>
            <LeadForm
              site="remont"
              fallbackPhone={REMONT_PHONE}
              withTask
              title="Заявка на замер"
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
