import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { PrivacyPolicy } from '@/components/blocks/PrivacyPolicy';

export const metadata: Metadata = pageMetadata({
  site: 'dezgarant',
  path: '/politika',
  title: 'Политика конфиденциальности — ДезГарант',
  description:
    'Как ДезГарант обрабатывает персональные данные из формы заявки: какие данные собираются, зачем, кому передаются, сколько хранятся и как отозвать согласие.',
  noindex: true,
});

export default function DezgarantPolicyPage() {
  return <PrivacyPolicy site="dezgarant" />;
}
