import type { Metadata } from 'next';
import { SiteShell } from '@/components/layout/SiteShell';
import { LogoDezgarant } from '@/components/brand/LogoDezgarant';
import { DEZGARANT_CONTACTS } from '@/content/dezgarant/contacts';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  site: 'dezgarant',
  title: 'ДезГарант — дезинфекция, дезинсекция, дератизация в Оренбурге',
  description:
    'Уничтожение насекомых и грызунов в Оренбурге с гарантией. Лицензия Роспотребнадзора ЕРУЛ Л064-00111-56/05167787. Договор и акты для проверок. Работаем с физическими и юридическими лицами.',
});

export default function DezgarantLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteShell
      site="dezgarant"
      contacts={DEZGARANT_CONTACTS}
      logo={<LogoDezgarant variant="full" className="h-9 md:h-10" />}
      footerLogo={<LogoDezgarant variant="full" withSlogan className="h-11" />}
      withLicense
    >
      {children}
    </SiteShell>
  );
}
