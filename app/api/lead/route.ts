import { NextResponse } from 'next/server';

import { looksLikeBot, validateLead, type Lead } from '@/lib/lead';
import { sendLeadToEmail } from '@/lib/mail';
import { checkRateLimit } from '@/lib/ratelimit';
import { sendLeadToTelegram, type DeliveryResult } from '@/lib/telegram';

/**
 * Приём заявок (§8 плана).
 * В логах — только сайт, канал и причина отказа: имя, телефон, адрес и текст
 * комментария не пишутся никогда.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'no-store' } as const;

const RATE_LIMIT_ERROR =
  'Слишком много заявок с одного адреса. Подождите несколько минут или позвоните нам.';
const DELIVERY_ERROR = 'Не удалось отправить заявку. Позвоните нам — мы на связи.';
const BAD_JSON_ERROR = 'Не удалось прочитать заявку. Обновите страницу и попробуйте снова.';

/** IP из x-forwarded-for: на Vercel заголовок перезаписывается платформой. */
function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const first = forwarded?.split(',')[0]?.trim();
  if (first) return first;
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

function outcome(settled: PromiseSettledResult<DeliveryResult>): DeliveryResult {
  return settled.status === 'fulfilled' ? settled.value : { ok: false, reason: 'exception' };
}

async function deliver(lead: Lead): Promise<boolean> {
  const [telegram, mail] = await Promise.allSettled([
    sendLeadToTelegram(lead, lead.site),
    sendLeadToEmail(lead, lead.site),
  ]);

  const telegramResult = outcome(telegram);
  const mailResult = outcome(mail);

  if (!telegramResult.ok) {
    console.error('[lead] telegram не доставил', { site: lead.site, reason: telegramResult.reason });
  }
  if (!mailResult.ok) {
    console.error('[lead] почта не доставила', { site: lead.site, reason: mailResult.reason });
  }

  return telegramResult.ok || mailResult.ok;
}

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, errors: { form: BAD_JSON_ERROR } },
      { status: 400, headers: NO_STORE },
    );
  }

  // Ловушки проверяем до валидации: бот получает «успех» без подсказок.
  if (looksLikeBot(raw)) {
    return NextResponse.json({ ok: true }, { headers: NO_STORE });
  }

  const parsed = validateLead(raw);
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, errors: parsed.errors },
      { status: 400, headers: NO_STORE },
    );
  }

  const lead = parsed.data;

  const limit = checkRateLimit(clientIp(request));
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: RATE_LIMIT_ERROR },
      {
        status: 429,
        headers: { ...NO_STORE, 'Retry-After': String(limit.retryAfterSec) },
      },
    );
  }

  // Preview и e2e работают без секретов.
  if (process.env.LEAD_DRY_RUN === '1') {
    return NextResponse.json({ ok: true }, { headers: NO_STORE });
  }

  const delivered = await deliver(lead);
  if (!delivered) {
    return NextResponse.json(
      { ok: false, error: DELIVERY_ERROR },
      { status: 502, headers: NO_STORE },
    );
  }

  return NextResponse.json({ ok: true }, { headers: NO_STORE });
}
