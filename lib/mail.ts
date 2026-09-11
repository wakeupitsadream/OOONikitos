import { SITES, type SiteId } from '@/config/sites';
import { leadFields, type Lead } from '@/lib/lead';
import type { DeliveryResult } from '@/lib/telegram';

/**
 * Дубль заявки на почту (§8 п. 3 плана). Второй канал на случай,
 * когда Telegram недоступен: заявка не должна теряться молча.
 * nodemailer подключается динамически — без SMTP-настроек он не нужен.
 */

const SMTP_TIMEOUT_MS = 8000;

type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  to: string;
};

function readEnv(name: string): string {
  return (process.env[name] ?? '').trim();
}

/** Полная конфигурация или ничего: половинчатую отправку не пытаемся. */
function smtpConfig(siteId: SiteId): SmtpConfig | null {
  const host = readEnv('SMTP_HOST');
  const user = readEnv('SMTP_USER');
  const pass = readEnv('SMTP_PASS');
  const from = readEnv('LEAD_EMAIL_FROM');
  const to = readEnv(SITES[siteId].leadEmailEnv);
  const port = Number.parseInt(readEnv('SMTP_PORT') || '465', 10);

  if (!host || !user || !pass || !from || !to || !Number.isFinite(port)) return null;
  return { host, port, user, pass, from, to };
}

/** Тема и тело письма. Текстом: почтовые клиенты покажут одинаково. */
export function buildLeadEmail(lead: Lead, siteId: SiteId): { subject: string; text: string } {
  const brand = SITES[siteId].shortName;
  const body = leadFields(lead).map((field) => `${field.label}: ${field.value}`);
  return {
    subject: `Заявка с сайта ${brand}`,
    text: [`Новая заявка — ${brand}`, '', ...body].join('\n'),
  };
}

/** Код ошибки SMTP без персональных данных — его можно писать в лог. */
function errorReason(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const code = (error as { code?: unknown }).code;
    if (typeof code === 'string' && code) return `smtp_${code.toLowerCase()}`;
  }
  return 'smtp_error';
}

/**
 * Отправляет письмо на адрес бренда из SITES[siteId].leadEmailEnv.
 * Нет конфигурации → { ok: false, reason: 'not_configured' }, без исключений.
 */
export async function sendLeadToEmail(lead: Lead, siteId: SiteId): Promise<DeliveryResult> {
  const config = smtpConfig(siteId);
  if (!config) return { ok: false, reason: 'not_configured' };

  try {
    const { createTransport } = await import('nodemailer');
    const transport = createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: { user: config.user, pass: config.pass },
      connectionTimeout: SMTP_TIMEOUT_MS,
      greetingTimeout: SMTP_TIMEOUT_MS,
      socketTimeout: SMTP_TIMEOUT_MS * 2,
    });

    const { subject, text } = buildLeadEmail(lead, siteId);
    await transport.sendMail({ from: config.from, to: config.to, subject, text });
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: errorReason(error) };
  }
}
