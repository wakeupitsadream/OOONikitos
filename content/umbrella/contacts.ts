import type { Contacts } from '@/content/types';

/**
 * Контакты зонтичного сайта. Отдельного номера у ООО нет —
 * показываем оба номера направлений (данные с визиток).
 */
export const UMBRELLA_CONTACTS: Contacts = {
  phones: [
    { value: '+79096132937', label: 'ДезГарант — обработка объектов' },
    { value: '+79510377008', label: 'Бриллиант Ремонт — ремонт и отделка' },
  ],
  email: null, // TODO_OWNER: почта для заявок
  messengers: [
    { kind: 'max', url: 'https://web.max.ru/-72942117352109', label: 'MAX — Бриллиант Ремонт' },
  ],
  address: null, // TODO_OWNER: фактический офис
  hours: null, // TODO_OWNER: часы работы
  areaServed: 'Оренбург и Оренбургская область',
};
