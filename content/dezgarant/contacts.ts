import type { Contacts } from '@/content/types';

/** Контакты ДезГаранта. Телефон — с визитки, остальное ждём от владельца. */
export const DEZGARANT_CONTACTS: Contacts = {
  phones: [{ value: '+79096132937' }],
  email: null, // TODO_OWNER: почта для дублей заявок
  messengers: [], // TODO_OWNER: WhatsApp / Telegram / MAX
  address: null, // TODO_OWNER: фактический офис, если показываем
  hours: null, // TODO_OWNER: часы работы
  areaServed: 'Оренбург и Оренбургская область',
};

/** Основной телефон для шапки и кнопок. */
export const DEZGARANT_PHONE = DEZGARANT_CONTACTS.phones[0]?.value ?? null;
