import Link from 'next/link';
import { Phone } from 'lucide-react';
import { SITES, type SiteId } from '@/config/sites';
import { formatPhone, telHref } from '@/lib/phone';
import { Container } from '@/components/ui/Container';
import { MobileNav } from './MobileNav';

type HeaderProps = {
  site: SiteId;
  /** Основной телефон в шапке, если он есть у направления. */
  phone?: string | null;
  /** Логотип бренда — передаётся сайтом, чтобы шапка не знала про графику. */
  logo: React.ReactNode;
};

export function Header({ site, phone, logo }: HeaderProps) {
  const config = SITES[site];
  const nav = config.nav;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4 md:h-20">
        <Link href="/" className="shrink-0" aria-label={`${config.shortName} — на главную`}>
          {logo}
        </Link>

        <nav aria-label="Основная навигация" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[0.9375rem] font-medium text-fg-muted transition-colors hover:text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {phone ? (
            <a
              href={telHref(phone)}
              data-ym="phone_click"
              className="hidden items-center gap-2 font-display text-[1.0625rem] font-extrabold tracking-tight transition-colors hover:text-accent-ink md:flex"
            >
              <Phone className="size-4 text-accent-ink" aria-hidden="true" />
              {formatPhone(phone)}
            </a>
          ) : null}
          <MobileNav site={site} nav={nav} phone={phone ?? null} />
        </div>
      </Container>
    </header>
  );
}
