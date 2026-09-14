import { Suspense, type ReactNode } from 'react';
import { SITES, type SiteId } from '@/config/sites';
import type { Contacts } from '@/content/types';
import { Header } from './Header';
import { Footer } from './Footer';
import { Metrika } from './Metrika';
import { CookieBar } from './CookieBar';
import { CallbackBar } from '@/components/blocks/CallbackBar';

type SiteShellProps = {
  site: SiteId;
  contacts: Contacts;
  logo: ReactNode;
  footerLogo?: ReactNode;
  children: ReactNode;
  withLicense?: boolean;
  /**
   * Мобильная липкая полоса «Позвонить / Написать / Заявка» внизу экрана.
   * Рендерится здесь, а не на страницах: футер должен знать про неё,
   * чтобы подпись разработчика не пряталась под полосой.
   */
  withCallbackBar?: boolean;
};

/**
 * Общий каркас брендового сайта: тема на обёртке, шапка, футер,
 * счётчик и уведомление о cookie. Страницы отвечают только за контент.
 */
export function SiteShell({
  site,
  contacts,
  logo,
  footerLogo,
  children,
  withLicense = false,
  withCallbackBar = false,
}: SiteShellProps) {
  const config = SITES[site];
  const counterId = process.env[config.ymEnv];
  const phone = contacts.phones[0]?.value ?? null;
  const messenger = contacts.messengers[0] ?? null;

  return (
    <div
      data-theme={config.theme}
      data-accent={config.accent}
      className="flex min-h-dvh flex-col bg-bg text-fg"
    >
      <div className="noise-overlay" aria-hidden="true" />
      <Header site={site} phone={phone} logo={logo} />
      <main className="flex-1">{children}</main>
      <Footer
        site={site}
        contacts={contacts}
        withLicense={withLicense}
        withCallbackBar={withCallbackBar}
        logo={footerLogo ?? logo}
      />
      <Suspense fallback={null}>
        <Metrika counterId={counterId} />
      </Suspense>
      <CookieBar enabled={Boolean(counterId)} />
      {withCallbackBar ? <CallbackBar phone={phone} messenger={messenger} /> : null}
    </div>
  );
}
