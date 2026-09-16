import type { Metadata } from 'next';
import { SiteShell } from '@/components/layout/SiteShell';
import { LogoRemont } from '@/components/brand/LogoRemont';
import { REMONT_CONTACTS } from '@/content/remont/contacts';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  site: 'remont',
  title: 'Бриллиант Ремонт — ремонт квартир под ключ в Оренбурге',
  description:
    'Ремонт квартир и домов под ключ в Оренбурге: штукатурка по трём тарифам с фиксированной ценой за м², откосы, шпаклёвка, перегородки, обои и покраска. Смета в договоре, расчёт онлайн.',
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
