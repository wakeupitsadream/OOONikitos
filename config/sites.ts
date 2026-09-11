/**
 * Реестр брендов ООО «Белые Нити». Новое направление добавляется одной записью
 * здесь + папкой в app/_sites/ + файлами в content/.
 */
export const SITE_IDS = ['belye-niti', 'dezgarant', 'remont'] as const;

export type SiteId = (typeof SITE_IDS)[number];

export type SiteConfig = {
  id: SiteId;
  /** Полное имя бренда для title и JSON-LD */
  name: string;
  /** Короткое имя для шапки и футера */
  shortName: string;
  slogan: string;
  /** Хосты (без www и порта), по которым сайт отдаётся напрямую */
  hosts: string[];
  /** Переменная окружения с каноническим адресом */
  canonicalEnv: string;
  /** Резервный canonical, пока домены не куплены */
  fallbackCanonical: string;
  theme: 'dark' | 'light';
  accent: 'red' | 'teal' | 'gold';
  /** Переменная окружения с номером счётчика Яндекс.Метрики */
  ymEnv: string;
  /** Переменная окружения с кодом подтверждения Яндекс.Вебмастера */
  verificationEnv: string;
  /** Переменная окружения с chat_id Telegram для заявок этого сайта */
  telegramChatEnv: string;
  /** Переменная окружения с адресом почты для дублей заявок */
  leadEmailEnv: string;
  nav: { href: string; label: string }[];
};

export const SITES: Record<SiteId, SiteConfig> = {
  'belye-niti': {
    id: 'belye-niti',
    name: 'ООО «Белые Нити»',
    shortName: 'Белые Нити',
    slogan: 'Качество. Надёжность. Доверие.',
    hosts: ['belye-niti.ru', 'belye-niti.vercel.app'],
    canonicalEnv: 'NEXT_PUBLIC_URL_BELYE_NITI',
    fallbackCanonical: 'https://belye-niti.vercel.app',
    theme: 'dark',
    accent: 'red',
    ymEnv: 'NEXT_PUBLIC_YM_BELYE_NITI',
    verificationEnv: 'NEXT_PUBLIC_YANDEX_VERIFICATION_BELYE_NITI',
    telegramChatEnv: 'TELEGRAM_CHAT_ID_BELYE_NITI',
    leadEmailEnv: 'LEAD_EMAIL_TO_BELYE_NITI',
    nav: [
      { href: '/#napravleniya', label: 'Направления' },
      { href: '/#licenziya', label: 'Лицензия' },
      { href: '/#kontakty', label: 'Контакты' },
    ],
  },
  dezgarant: {
    id: 'dezgarant',
    name: 'ДезГарант — направление ООО «Белые Нити»',
    shortName: 'ДезГарант',
    slogan: 'Дезинфекция • Гарантия • Чистота',
    hosts: ['dezgarant56.ru', 'dezgarant56.vercel.app'],
    canonicalEnv: 'NEXT_PUBLIC_URL_DEZGARANT',
    fallbackCanonical: 'https://dezgarant56.vercel.app',
    theme: 'light',
    accent: 'teal',
    ymEnv: 'NEXT_PUBLIC_YM_DEZGARANT',
    verificationEnv: 'NEXT_PUBLIC_YANDEX_VERIFICATION_DEZGARANT',
    telegramChatEnv: 'TELEGRAM_CHAT_ID_DEZGARANT',
    leadEmailEnv: 'LEAD_EMAIL_TO_DEZGARANT',
    nav: [
      { href: '/uslugi', label: 'Услуги' },
      { href: '/ceny', label: 'Цены' },
      { href: '/biznesu', label: 'Бизнесу' },
      { href: '/licenziya', label: 'Лицензия' },
      { href: '/kontakty', label: 'Контакты' },
    ],
  },
  remont: {
    id: 'remont',
    name: 'Бриллиант Ремонт — направление ООО «Белые Нити»',
    shortName: 'Бриллиант Ремонт',
    slogan: 'Быстро, ровно, надолго',
    hosts: ['brilliant-remont56.ru', 'brilliant-remont56.vercel.app'],
    canonicalEnv: 'NEXT_PUBLIC_URL_REMONT',
    fallbackCanonical: 'https://brilliant-remont56.vercel.app',
    theme: 'dark',
    accent: 'gold',
    ymEnv: 'NEXT_PUBLIC_YM_REMONT',
    verificationEnv: 'NEXT_PUBLIC_YANDEX_VERIFICATION_REMONT',
    telegramChatEnv: 'TELEGRAM_CHAT_ID_REMONT',
    leadEmailEnv: 'LEAD_EMAIL_TO_REMONT',
    nav: [
      { href: '/uslugi', label: 'Услуги' },
      { href: '/ceny', label: 'Цены' },
      { href: '/portfolio', label: 'Работы' },
      { href: '/etapy', label: 'Этапы' },
      { href: '/kontakty', label: 'Контакты' },
    ],
  },
};

export const DEFAULT_SITE: SiteId = 'belye-niti';

export const SITE_LIST: SiteConfig[] = SITE_IDS.map((id) => SITES[id]);

export function isSiteId(value: string | undefined | null): value is SiteId {
  return !!value && (SITE_IDS as readonly string[]).includes(value);
}
