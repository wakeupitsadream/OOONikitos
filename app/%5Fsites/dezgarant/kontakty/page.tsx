import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, ExternalLink, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { COMPANY, LICENSE } from '@/content/company';
import { DEZGARANT_CONTACTS, DEZGARANT_PHONE } from '@/content/dezgarant/contacts';
import { AREA_CITIES } from '@/content/dezgarant/faq';
import { pageMetadata, jsonLdScript } from '@/lib/seo';
import { siteOrigin } from '@/lib/site';
import { formatPhone, telHref } from '@/lib/phone';
import { Section, SectionHead } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Diamond } from '@/components/ui/Diamond';
import { Reveal } from '@/components/ui/Reveal';
import { CoverageMap } from '@/components/blocks/CoverageMap';
import { LeadForm } from '@/components/blocks/LeadForm';
import { CallbackBar } from '@/components/blocks/CallbackBar';

export const metadata: Metadata = pageMetadata({
  site: 'dezgarant',
  path: '/kontakty',
  title: 'Контакты ДезГаранта — дезинфекция в Оренбурге',
  description:
    'Телефон службы дезинфекции ДезГарант в Оренбурге, зона выезда по Оренбургской области, реквизиты ООО «Белые Нити» и номер лицензии Роспотребнадзора. Заявка на обработку.',
  ogTitle: 'Контакты ДезГаранта',
});

export default function ContactsPage() {
  const origin = siteOrigin('dezgarant');
  const { email, messengers, hours, address, areaServed } = DEZGARANT_CONTACTS;

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: origin },
      { '@type': 'ListItem', position: 2, name: 'Контакты', item: `${origin}/kontakty` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbs)} />

      <Section compact>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHead
              as="h1"
              eyebrow="Контакты"
              title="Связаться с ДезГарантом"
              lead="Расскажите по телефону, что происходит, — назовём ориентир по цене и время выезда. Если удобнее письменно, оставьте заявку: перезвоним и уточним детали."
            />

            {DEZGARANT_PHONE ? (
              <div className="mt-8">
                <p className="eyebrow text-fg-subtle">Телефон</p>
                <a
                  href={telHref(DEZGARANT_PHONE)}
                  data-ym="phone_click"
                  className="mt-2 inline-flex items-center gap-3 font-display text-2xl font-extrabold transition-colors hover:text-accent-ink sm:text-3xl"
                >
                  <Diamond variant="accent" size="md">
                    <Phone aria-hidden="true" />
                  </Diamond>
                  <span className="tabular">{formatPhone(DEZGARANT_PHONE)}</span>
                </a>
                <p className="mt-3 text-sm text-fg-subtle">
                  Работаем с физическими и юридическими лицами. Организациям — договор, журнал учёта
                  и акты для проверки.
                </p>
              </div>
            ) : null}

            {/* Блоки ниже появятся, когда владелец пришлёт данные (TODO_OWNER):
                почта, мессенджеры, часы работы и офис. Пустых заглушек не показываем. */}
            {email || messengers.length > 0 || hours || address ? (
              <ul className="mt-8 space-y-3 text-[0.9375rem]">
                {email ? (
                  <li className="flex items-start gap-3">
                    <Mail className="mt-0.5 size-5 shrink-0 text-accent-ink" aria-hidden="true" />
                    <a href={`mailto:${email}`} className="underline-offset-4 hover:underline">
                      {email}
                    </a>
                  </li>
                ) : null}
                {messengers.map((messenger) => (
                  <li key={messenger.url} className="flex items-start gap-3">
                    <MessageCircle
                      className="mt-0.5 size-5 shrink-0 text-accent-ink"
                      aria-hidden="true"
                    />
                    <a
                      href={messenger.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-ym="messenger_click"
                      className="underline-offset-4 hover:underline"
                    >
                      {messenger.label}
                    </a>
                  </li>
                ))}
                {hours ? (
                  <li className="flex items-start gap-3">
                    <Clock className="mt-0.5 size-5 shrink-0 text-accent-ink" aria-hidden="true" />
                    {hours}
                  </li>
                ) : null}
                {address ? (
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-5 shrink-0 text-accent-ink" aria-hidden="true" />
                    {address}
                  </li>
                ) : null}
              </ul>
            ) : null}
          </Reveal>

          <Reveal delay={80} id="zayavka">
            <LeadForm
              site="dezgarant"
              fallbackPhone={DEZGARANT_PHONE}
              withTask
              title="Оставить заявку"
              lead="Перезвоним, уточним детали и назовём стоимость. Это бесплатно и ни к чему не обязывает."
            />
          </Reveal>
        </div>
      </Section>

      {/* Зона выезда */}
      <Section tone="deep" compact>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHead
              eyebrow="Зона выезда"
              title={areaServed}
              lead="Работаем в городе и выезжаем по области. Стоимость выезда за пределы Оренбурга считается по километражу и называется до выезда, а не по факту."
            />
            <ul className="mt-6 flex flex-wrap gap-2">
              {AREA_CITIES.map((city) => (
                <li
                  key={city}
                  className="flex items-center gap-1.5 rounded-[var(--radius-xs)] bg-surface-2 px-3 py-1.5 text-sm"
                >
                  <MapPin className="size-3.5 text-accent-ink" aria-hidden="true" />
                  {city}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={80}>
            <div className="rounded-[var(--radius-md)] border border-border bg-surface p-6">
              <CoverageMap />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Реквизиты */}
      <Section compact>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHead
              eyebrow="Кто исполнитель"
              title="Реквизиты и лицензия"
              lead="Договор заключает юридическое лицо, а не частный мастер: с него же и спрос при проверке или споре."
            />
          </Reveal>
          <Reveal delay={80}>
            <Card>
              <dl className="space-y-3 text-[0.9375rem]">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <dt className="text-fg-subtle">Исполнитель</dt>
                  <dd className="font-semibold">{COMPANY.legalName}</dd>
                </div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <dt className="text-fg-subtle">ИНН</dt>
                  <dd className="tabular font-semibold">{COMPANY.inn}</dd>
                </div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <dt className="text-fg-subtle">ОГРН</dt>
                  <dd className="tabular font-semibold">{COMPANY.ogrn}</dd>
                </div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <dt className="text-fg-subtle">Лицензия</dt>
                  <dd className="min-w-0 font-semibold">
                    ЕРУЛ № {LICENSE.erul}, выдана {LICENSE.issuedAtLabel} — {LICENSE.authority}
                  </dd>
                </div>
              </dl>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4 text-sm">
                <a
                  href={LICENSE.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ym="license_check_click"
                  className="inline-flex items-center gap-1.5 font-semibold text-accent-ink underline underline-offset-4"
                >
                  Проверить в реестре
                  <ExternalLink className="size-4" aria-hidden="true" />
                </a>
                <Link href="/licenziya" className="text-fg-muted underline underline-offset-4">
                  Подробно о лицензии
                </Link>
              </div>
              <p className="mt-4 text-sm text-fg-subtle">
                Юридический адрес общества указан в{' '}
                <Link href="/politika" className="underline underline-offset-4">
                  политике конфиденциальности
                </Link>
                .
              </p>
            </Card>
          </Reveal>
        </div>
      </Section>

      <CallbackBar
        phone={DEZGARANT_PHONE}
        messenger={DEZGARANT_CONTACTS.messengers[0] ?? null}
        formHref="#zayavka"
      />
    </>
  );
}
