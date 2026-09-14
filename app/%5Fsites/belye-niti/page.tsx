import { ArrowRight } from 'lucide-react';
import { COMPANY } from '@/content/company';
import { COMBINED_SCENARIOS, DIRECTIONS } from '@/content/umbrella/directions';
import { UMBRELLA_CONTACTS } from '@/content/umbrella/contacts';
import { siteUrl } from '@/lib/site';
import { SITES } from '@/config/sites';
import { jsonLdScript } from '@/lib/seo';
import { formatPhone, telHref } from '@/lib/phone';
import { Section, SectionHead } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Diamond } from '@/components/ui/Diamond';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { HeroSplit } from '@/components/blocks/HeroSplit';
import { TaskRouter } from '@/components/blocks/TaskRouter';
import { LicenseBlock } from '@/components/blocks/LicenseBlock';
import { LeadForm } from '@/components/blocks/LeadForm';
import { siteOrigin } from '@/lib/site';

function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY.shortLegalName,
    legalName: COMPANY.legalName,
    url: siteOrigin('belye-niti'),
    taxID: COMPANY.inn,
    identifier: [
      { '@type': 'PropertyValue', name: 'ИНН', value: COMPANY.inn },
      { '@type': 'PropertyValue', name: 'ОГРН', value: COMPANY.ogrn },
    ],
    areaServed: { '@type': 'AdministrativeArea', name: COMPANY.region },
    slogan: COMPANY.slogan,
    telephone: UMBRELLA_CONTACTS.phones.map((phone) => phone.value),
    subOrganization: DIRECTIONS.map((direction) => ({
      '@type': 'Organization',
      name: direction.name,
      url: siteOrigin(direction.site),
    })),
  };
}

export default function UmbrellaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(organizationJsonLd())}
      />

      <HeroSplit />

      {/* Структура компании */}
      <Section id="struktura" tone="deep">
        <Reveal>
          <SectionHead
            eyebrow="Структура компании"
            title="Одно юридическое лицо, два профессиональных направления"
            lead="Договор, ответственность и документы — от ООО «Белые Нити». Система готова к новым направлениям: они просто добавляются в неё."
          />
        </Reveal>

        <Reveal delay={80} className="mt-10">
          <div className="relative">
            <Card className="mx-auto max-w-md text-center" clipped>
              <p className="eyebrow text-accent-ink">Головная компания</p>
              <p className="display-md mt-2">{COMPANY.shortLegalName}</p>
              <p className="mt-2 text-sm text-fg-subtle">
                ИНН {COMPANY.inn} · ОГРН {COMPANY.ogrn}
              </p>
            </Card>

            {/* «Нити» к направлениям */}
            <div
              className="mx-auto hidden h-12 w-px bg-border-strong md:block"
              aria-hidden="true"
            />

            <div className="mt-6 grid gap-4 md:mt-0 md:grid-cols-2 md:gap-6">
              {DIRECTIONS.map((direction) => (
                <Card key={direction.site} href={siteUrl(direction.site)} clipped>
                  <p className="eyebrow text-fg-subtle">{direction.tagline}</p>
                  <h3 className="display-md mt-2">{direction.name}</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {direction.services.map((service) => (
                      <li
                        key={service}
                        className="rounded-[var(--radius-xs)] bg-surface-2 px-2.5 py-1 text-sm text-fg-muted"
                      >
                        {service}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-sm text-fg-subtle">{direction.fact}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-display font-extrabold text-accent-ink">
                    Перейти на сайт
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </Card>
              ))}
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Подбор направления */}
      <Section id="podbor">
        <Reveal>
          <SectionHead
            eyebrow="Не знаете, к кому обратиться"
            title="Выберите объект и задачу"
            lead="Покажем нужную услугу нужного направления — без звонков и угадывания."
          />
        </Reveal>
        <Reveal delay={80} className="mt-8">
          <TaskRouter />
        </Reveal>
      </Section>

      {/* Направления подробно */}
      <Section id="napravleniya" tone="deep">
        <Reveal>
          <SectionHead
            eyebrow="Направления"
            title="Чем занимаемся"
            lead="Каждое направление — свой сайт с ценами, услугами и расчётом стоимости."
          />
        </Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {DIRECTIONS.map((direction, index) => (
            <Reveal key={direction.site} delay={index * 90}>
              <Card className="flex h-full flex-col">
                <p className="eyebrow text-accent-ink">{direction.tagline}</p>
                <p className="display-lg mt-3">{direction.name}</p>
                <p className="lead mt-4 flex-1">{direction.description}</p>
                <p className="mt-6 text-sm font-semibold">{direction.fact}</p>
                <Button href={siteUrl(direction.site)} className="mt-6 self-start" size="lg">
                  {direction.cta}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Лицензия */}
      <Section id="licenziya">
        <Reveal>
          <LicenseBlock variant="full" />
        </Reveal>
      </Section>

      {/* Один подрядчик на объект */}
      <Section id="odin-podryadchik" tone="deep">
        <Reveal>
          <SectionHead
            eyebrow="Один подрядчик"
            title="Когда оба направления работают на одном объекте"
            lead="Ремонт и санитарная обработка часто нужны подряд. У нас это один договор и одна ответственность."
          />
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {COMBINED_SCENARIOS.map((scenario, index) => (
            <Reveal key={scenario.title} delay={index * 80}>
              <Card className="h-full">
                <Diamond variant="split" size="md" />
                <p className="mt-4 font-display text-lg font-extrabold leading-snug">
                  {scenario.title}
                </p>
                <p className="mt-2 text-[0.9375rem] text-fg-muted">{scenario.text}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Контакты и форма */}
      <Section id="kontakty">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHead
              eyebrow="Контакты"
              title="Опишите задачу — подскажем, к кому из направлений"
              lead="Если не уверены, ремонт это или обработка, просто расскажите, что происходит. Разберёмся и передадим нужному специалисту."
            />

            <div className="mt-8 space-y-5">
              {UMBRELLA_CONTACTS.phones.map((phone) => (
                <div key={phone.value}>
                  <a
                    href={telHref(phone.value)}
                    data-ym="phone_click"
                    className="font-display text-2xl font-extrabold transition-colors hover:text-accent-ink"
                  >
                    {formatPhone(phone.value)}
                  </a>
                  {phone.label ? (
                    <p className="mt-0.5 text-sm text-fg-subtle">{phone.label}</p>
                  ) : null}
                </div>
              ))}

              {UMBRELLA_CONTACTS.messengers.length > 0 ? (
                <div className="flex flex-wrap gap-3 pt-2">
                  {UMBRELLA_CONTACTS.messengers.map((messenger) => (
                    <Button
                      key={messenger.url}
                      href={messenger.url}
                      variant="secondary"
                      external
                    >
                      {messenger.label}
                    </Button>
                  ))}
                </div>
              ) : null}

              <p className="pt-2 text-sm text-fg-subtle">{UMBRELLA_CONTACTS.areaServed}</p>

              <div className="flex flex-wrap gap-3 pt-2">
                {DIRECTIONS.map((direction) => (
                  <Button key={direction.site} href={siteUrl(direction.site)} variant="outline">
                    {SITES[direction.site].shortName}
                  </Button>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={90} id="zayavka">
            <LeadForm
              site="belye-niti"
              withTask
              fallbackPhone={UMBRELLA_CONTACTS.phones[0]?.value ?? null}
              title="Не знаете, к кому обратиться?"
              lead="Опишите задачу — перезвоним и подскажем, какое направление нужно."
              submitLabel="Отправить заявку"
            />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
