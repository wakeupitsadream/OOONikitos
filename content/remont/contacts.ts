import type { Contacts } from '@/content/types';

/** Контакты «Бриллиант Ремонт». Телефон и MAX — с визитки. */
export const REMONT_CONTACTS: Contacts = {
  phones: [{ value: '+79510377008' }],
  email: null, // TODO_OWNER: почта для дублей заявок
  messengers: [
    { kind: 'max', url: 'https://web.max.ru/-72942117352109', label: 'Написать в MAX' },
  ],
  address: null, // TODO_OWNER: фактический офис, если показываем
  hours: null, // TODO_OWNER: часы работы
  areaServed: 'Оренбург и Оренбургская область',
};

export const REMONT_PHONE = REMONT_CONTACTS.phones[0]?.value ?? null;
export const REMONT_MESSENGER = REMONT_CONTACTS.messengers[0] ?? null;
