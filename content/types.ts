/** Общие типы контента. Данных нет → null или пустой массив, секция не рендерится. */

export type MessengerKind = 'max' | 'whatsapp' | 'telegram' | 'vk';

export type Messenger = {
  kind: MessengerKind;
  url: string;
  label: string;
};

export type Phone = {
  /** В формате +7XXXXXXXXXX */
  value: string;
  label?: string;
};

export type Contacts = {
  phones: Phone[];
  email: string | null;
  messengers: Messenger[];
  address: string | null;
  hours: string | null;
  areaServed: string;
};

/** Статус цены: confirmed — от владельца, draft — рыночный ориентир. */
export type PriceStatus = 'confirmed' | 'draft';

export type PriceRow = {
  id: string;
  label: string;
  /** Цена «от», в рублях */
  from: number;
  unit: string;
  note?: string;
  status: PriceStatus;
};

export type FaqItem = {
  q: string;
  a: string;
};

export type Step = {
  title: string;
  text: string;
};
