import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { PrivacyPolicy } from '@/components/blocks/PrivacyPolicy';

export const metadata: Metadata = pageMetadata({
  site: 'belye-niti',
  path: '/politika',
  title: 'Политика конфиденциальности — ООО «Белые Нити»',
  description:
    'Как ООО «Белые Нити» обрабатывает персональные данные из формы заявки: какие данные собираются, зачем, кому передаются, сколько хранятся и как отозвать согласие.',
  noindex: true,
});

export default function UmbrellaPolicyPage() {
  return <PrivacyPolicy site="belye-niti" />;
}
