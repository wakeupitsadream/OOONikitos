import type { Metadata } from 'next';
import { SiteShell } from '@/components/layout/SiteShell';
import { LogoRemont } from '@/components/brand/LogoRemont';
import { REMONT_CONTACTS } from '@/content/remont/contacts';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  site: 'remont',
  title: 'Бриллиант Ремонт — штукатурка и отделка стен в Оренбурге',
  description:
    'Штукатурка, шпаклёвка, покраска и обои в Оренбурге. Ровные стены под обои, понятные сроки, фиксированная смета в договоре. Расчёт стоимости онлайн.',
});

export default function RemontLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteShell
      site="remont"
      contacts={REMONT_CONTACTS}
      logo={<LogoRemont variant="full" className="h-9 md:h-10" />}
      footerLogo={<LogoRemont variant="full" className="h-11" />}
      withCallbackBar
    >
      {children}
    </SiteShell>
  );
}
