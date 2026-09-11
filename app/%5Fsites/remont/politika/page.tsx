import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { PrivacyPolicy } from '@/components/blocks/PrivacyPolicy';

export const metadata: Metadata = pageMetadata({
  site: 'remont',
  path: '/politika',
  title: 'Политика конфиденциальности — Бриллиант Ремонт',
  description:
    'Как «Бриллиант Ремонт» обрабатывает персональные данные из формы заявки: какие данные собираются, зачем, кому передаются, сколько хранятся и как отозвать согласие.',
  noindex: true,
});

export default function RemontPolicyPage() {
  return <PrivacyPolicy site="remont" />;
}
