import type { Metadata } from 'next';
import { SiteShell } from '@/components/layout/SiteShell';
import { LogoBelyeNiti } from '@/components/brand/LogoBelyeNiti';
import { UMBRELLA_CONTACTS } from '@/content/umbrella/contacts';
import { pageMetadata } from '@/lib/seo';
import { COMPANY } from '@/content/company';

export const metadata: Metadata = pageMetadata({
  site: 'belye-niti',
  title: `${COMPANY.shortLegalName} — ремонт и санитарная безопасность в Оренбурге`,
  description:
    'Создаём, ремонтируем, защищаем. Строительство, ремонт и отделка — «Бриллиант Ремонт». Дезинфекция, дезинсекция и дератизация по лицензии Роспотребнадзора — «ДезГарант».',
});

export default function BelyeNitiLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteShell
      site="belye-niti"
      contacts={UMBRELLA_CONTACTS}
      logo={<LogoBelyeNiti variant="full" className="h-9 md:h-10" />}
      footerLogo={<LogoBelyeNiti variant="full" withSlogan className="h-11" />}
      withLicense
    >
      {children}
    </SiteShell>
  );
}
