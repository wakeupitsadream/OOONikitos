/** Неразрывный пробел: между числом и словом/единицей. */
const NBSP = ' ';
/** Тонкий неразрывный пробел: разделитель разрядов. */
const NNBSP = ' ';

/**
 * Русские склонения: plural(5, 'объект', 'объекта', 'объектов') → 'объектов'.
 */
export function plural(count: number, one: string, few: string, many: string): string {
  const abs = Math.abs(Math.trunc(count));
  const mod100 = abs % 100;
  if (mod100 >= 11 && mod100 <= 14) return many;
  const mod10 = abs % 10;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

/** «5 объектов» — число со склонённым словом через неразрывный пробел. */
export function pluralize(count: number, one: string, few: string, many: string): string {
  return `${formatNumber(count)}${NBSP}${plural(count, one, few, many)}`;
}

/** 12500 → «12 500» (тонкий неразрывный пробел между разрядами). */
export function formatNumber(value: number): string {
  const sign = value < 0 ? '-' : '';
  const digits = Math.abs(Math.trunc(value)).toString();
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, NNBSP);
  return `${sign}${grouped}`;
}

/** 2500 → «2 500 ₽» с неразрывным пробелом перед знаком рубля. */
export function formatPrice(value: number): string {
  return `${formatNumber(value)}${NBSP}₽`;
}

/** «от 2 500 ₽» */
export function formatPriceFrom(value: number): string {
  return `от${NBSP}${formatPrice(value)}`;
}
