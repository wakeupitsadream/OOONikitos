import Link from 'next/link';
import { COMPANY, DEVELOPER, LICENSE } from '@/content/company';
import { SITES, type SiteId } from '@/config/sites';
import { siteUrl } from '@/lib/site';
import { formatPhone, telHref } from '@/lib/phone';
import type { Contacts } from '@/content/types';
import { Container } from '@/components/ui/Container';

type FooterProps = {
  site: SiteId;
  contacts: Contacts;
  /** Показывать строку лицензии — только там, где речь о санитарных услугах. */
  withLicense?: boolean;
  /** На странице есть мобильная липкая полоса — снизу нужен запас под неё. */
  withCallbackBar?: boolean;
  logo?: React.ReactNode;
};

const CROSS_LINKS: Record<SiteId, SiteId[]> = {
  'belye-niti': ['dezgarant', 'remont'],
  dezgarant: ['belye-niti', 'remont'],
  remont: ['belye-niti', 'dezgarant'],
};

export function Footer({
  site,
  contacts,
  withLicense = false,
  withCallbackBar = false,
  logo,
}: FooterProps) {
  const config = SITES[site];
  const year = 2026;
  // Полоса связи высотой ~4rem закрывает низ страницы на мобильном:
  // добавляем её высоту к нижнему отступу, чтобы подпись оставалась видимой.
  const padding = withCallbackBar
    ? 'pt-12 pb-28 md:pt-16 md:pb-32 lg:pb-16'
    : 'py-12 md:py-16';

  return (
    <footer className={`border-t border-border bg-bg-deep ${padding}`}>
      <Container>
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            {logo ? <div className="mb-4">{logo}</div> : null}
            <p className="text-sm text-fg-muted">
              {config.id === 'belye-niti' ? COMPANY.lead : `${config.shortName} — направление ${COMPANY.shortLegalName}.`}
            </p>
            <p className="mt-4 text-sm text-fg-subtle">
              {COMPANY.shortLegalName}
              <br />
              ИНН {COMPANY.inn} · ОГРН {COMPANY.ogrn}
            </p>
          </div>

          <div>
            <p className="eyebrow mb-3 text-fg-subtle">Контакты</p>
            <ul className="space-y-2 text-sm">
              {contacts.phones.map((phone) => (
                <li key={phone.value}>
                  <a
                    href={telHref(phone.value)}
                    data-ym="phone_click"
                    className="font-display font-extrabold transition-colors hover:text-accent-ink"
                  >
                    {formatPhone(phone.value)}
                  </a>
                  {phone.label ? <span className="block text-fg-subtle">{phone.label}</span> : null}
                </li>
              ))}
              {contacts.email ? (
                <li>
                  <a href={`mailto:${contacts.email}`} className="transition-colors hover:text-accent-ink">
                    {contacts.email}
                  </a>
                </li>
              ) : null}
              {contacts.hours ? <li className="text-fg-muted">{contacts.hours}</li> : null}
              <li className="text-fg-muted">{contacts.areaServed}</li>
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-3 text-fg-subtle">Компания</p>
            <ul className="space-y-2 text-sm">
              {CROSS_LINKS[site].map((target) => (
                <li key={target}>
                  <a href={siteUrl(target)} className="transition-colors hover:text-accent-ink">
                    {SITES[target].shortName}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/politika" className="transition-colors hover:text-accent-ink">
                  Политика конфиденциальности
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {withLicense ? (
          <p className="mt-10 border-t border-border pt-6 text-sm text-fg-subtle">
            Лицензия на деятельность по дезинфекции, дезинсекции и дератизации:{' '}
            <span className="whitespace-nowrap">ЕРУЛ № {LICENSE.erul}</span>. Выдана{' '}
            {LICENSE.issuedAtLabel}. Лицензирующий орган — {LICENSE.authority}.{' '}
            <a
              href={LICENSE.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-ym="license_check_click"
              className="underline underline-offset-4 transition-colors hover:text-accent-ink"
            >
              Проверить в реестре
            </a>
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-2 border-t border-border pt-6 text-sm text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {COMPANY.shortLegalName}
          </p>
          <p>
            {DEVELOPER.label} —{' '}
            <a
              href={DEVELOPER.url}
              target="_blank"
              rel="noopener"
              className="underline underline-offset-4 transition-colors hover:text-accent-ink"
            >
              {DEVELOPER.name}
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
