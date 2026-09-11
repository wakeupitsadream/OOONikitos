import type { WorkRate } from '@/lib/calc/remont';

/**
 * Расценки «Бриллиант Ремонт» за м² стен.
 *
 * ВНИМАНИЕ: все ставки помечены draft. Поштучных расценок на штукатурку,
 * шпаклёвку, покраску и обои по Оренбургу разведка не получила
 * (docs/research/market-remont.json, лимит поиска) — значения выведены
 * из общих ставок отделки 2 490–3 490 ₽/м² пола и подлежат замене
 * прайсом владельца. Правится только этот файл.
 */
export const PRICE_STATUS: 'draft' | 'confirmed' = 'draft';

/** Минимальная сумма заказа, ₽. TODO_OWNER: подтвердить. */
export const MIN_ORDER = 15000;

export const WORK_RATES: WorkRate[] = [
  {
    id: 'shtukaturka',
    label: 'Штукатурка стен',
    pricePerM2: 500,
    m2PerDay: 35,
    dryingDays: 2,
    status: 'draft',
  },
  {
    id: 'shpaklevka',
    label: 'Шпаклёвка под покраску',
    pricePerM2: 350,
    m2PerDay: 40,
    dryingDays: 1,
    status: 'draft',
  },
  {
    id: 'pokraska',
    label: 'Покраска стен',
    pricePerM2: 250,
    m2PerDay: 50,
    dryingDays: 1,
    status: 'draft',
  },
  {
    id: 'oboi',
    label: 'Поклейка обоев',
    pricePerM2: 300,
    m2PerDay: 45,
    dryingDays: 0,
    status: 'draft',
  },
];

/** Типовые комнаты для быстрого заполнения калькулятора. */
export const ROOM_PRESETS = [
  { id: 'room-small', label: 'Комната 12 м²', length: 4, width: 3, height: 2.7, windows: 1, doors: 1 },
  { id: 'room-medium', label: 'Комната 18 м²', length: 5, width: 3.6, height: 2.7, windows: 1, doors: 1 },
  { id: 'room-large', label: 'Комната 25 м²', length: 5, width: 5, height: 2.7, windows: 2, doors: 1 },
  { id: 'kitchen', label: 'Кухня 10 м²', length: 3.5, width: 2.9, height: 2.7, windows: 1, doors: 1 },
  { id: 'hall', label: 'Прихожая 6 м²', length: 3, width: 2, height: 2.7, windows: 0, doors: 3 },
  { id: 'bath', label: 'Санузел 4 м²', length: 2, width: 2, height: 2.7, windows: 0, doors: 1 },
];
