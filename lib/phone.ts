/**
 * Нормализует российский телефон к виду +7XXXXXXXXXX.
 * Возвращает null, если номер не похож на российский мобильный/городской.
 */
export function normalizePhone(input: string | null | undefined): string | null {
  if (!input) return null;
  const digits = input.replace(/\D/g, '');
  let national = digits;
  if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) {
    national = digits.slice(1);
  } else if (digits.length === 10) {
    national = digits;
  } else {
    return null;
  }
  if (national.length !== 10) return null;
  if (national.startsWith('0') || national.startsWith('1')) return null;
  return `+7${national}`;
}

/** +79096132937 → «+7 909 613-29-37» */
export function formatPhone(input: string): string {
  const normalized = normalizePhone(input);
  if (!normalized) return input;
  const d = normalized.slice(2);
  return `+7 ${d.slice(0, 3)} ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8, 10)}`;
}

/** Ссылка для атрибута href: tel:+79096132937 */
export function telHref(input: string): string {
  const normalized = normalizePhone(input);
  return `tel:${normalized ?? input.replace(/[^\d+]/g, '')}`;
}
