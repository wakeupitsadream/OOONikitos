'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Check, Phone } from 'lucide-react';
import type { SiteId } from '@/config/sites';
import { formatPhone, telHref } from '@/lib/phone';
import { Button } from '@/components/ui/Button';
import { Checkbox, Input, Textarea } from '@/components/ui/Field';

type LeadFormProps = {
  site: SiteId;
  /** Телефон для запасного сценария, если заявка не ушла. */
  fallbackPhone?: string | null;
  /** Предзаполненная услуга (из калькулятора или страницы услуги). */
  service?: string;
  /** Скрытые детали расчёта, уходящие вместе с заявкой. */
  details?: string;
  title?: string;
  lead?: string;
  submitLabel?: string;
  /** Поле «что нужно» вместо выбранной услуги — для зонтичного сайта. */
  withTask?: boolean;
  className?: string;
};

type Status = 'idle' | 'sending' | 'done' | 'error';

export function LeadForm({
  site,
  fallbackPhone,
  service,
  details,
  title = 'Оставьте заявку',
  lead = 'Перезвоним и уточним детали. Это бесплатно и ни к чему не обязывает.',
  submitLabel = 'Отправить заявку',
  withTask = false,
  className = '',
}: LeadFormProps) {
  const openedAt = useRef<number>(0);
  const formRef = useRef<HTMLFormElement>(null);

  // Момент открытия формы: слишком быстрая отправка — признак бота.
  // Здесь же помечаем форму готовой: до гидрации обработчик отправки не навешен.
  useEffect(() => {
    openedAt.current = Date.now();
    formRef.current?.setAttribute('data-ready', 'true');
  }, []);
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [values, setValues] = useState({ name: '', phone: '', task: '', hp: '' });

  const update = (field: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = event.target.value;
    setValues((prev) => ({ ...prev, [field]: next }));
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;

    const form = event.currentTarget;
    const consent = (form.elements.namedItem('consent') as HTMLInputElement | null)?.checked ?? false;

    const nextErrors: Record<string, string> = {};
    if (values.name.trim().length < 2) nextErrors.name = 'Как к вам обращаться?';
    if (values.phone.replace(/\D/g, '').length < 10) {
      nextErrors.phone = 'Укажите телефон в формате +7 999 123-45-67';
    }
    if (!consent) nextErrors.consent = 'Нужно согласие на обработку персональных данных';
    setErrors(nextErrors);
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      // noValidate отключает браузерный переход к полю — делаем его сами,
      // иначе на телефоне кнопка внизу «ничего не делает»: ошибки выше экрана.
      const field = form.elements.namedItem(firstInvalid);
      if (field instanceof HTMLElement) field.focus();
      return;
    }

    setStatus('sending');
    const taskText = withTask ? values.task.trim() : '';
    const payload = {
      site,
      name: values.name.trim(),
      phone: values.phone.trim(),
      service: service ?? (taskText ? taskText.slice(0, 120) : undefined),
      details: [details, taskText && withTask ? `Задача: ${taskText}` : '']
        .filter(Boolean)
        .join('\n')
        .slice(0, 2000),
      page: typeof window !== 'undefined' ? window.location.pathname : '/',
      consent: true,
      hp: values.hp,
      // 0 — «метки нет»: сервер не считает это подозрением. Подставлять Date.now()
      // нельзя: тогда любая отправка выглядела бы мгновенной.
      t: openedAt.current,
    };

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({ ok: false }))) as {
        ok?: boolean;
        error?: string;
        errors?: Record<string, string>;
      };
      if (response.ok && data.ok) {
        setStatus('done');
        if (typeof window !== 'undefined' && typeof window.ym === 'function') {
          const id = Number(document.documentElement.dataset.ym ?? 0);
          if (id) window.ym(id, 'reachGoal', 'lead_submit');
        }
        return;
      }
      if (data.errors) setErrors(data.errors);
      // Сервер объясняет отказ по-русски (лимит, сбой доставки) — показываем его слова
      setFormError(typeof data.error === 'string' && data.error ? data.error : null);
      setStatus('error');
    } catch {
      setFormError(null);
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div
        className={`rounded-[var(--radius-md)] border border-accent bg-surface p-7 text-center ${className}`}
        role="status"
      >
        <span className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-accent text-accent-fg">
          <Check className="size-7" aria-hidden="true" />
        </span>
        <p className="display-md">Заявка принята</p>
        <p className="lead mt-2">Перезвоним в рабочее время и уточним детали.</p>
        {fallbackPhone ? (
          <p className="mt-4 text-sm text-fg-subtle">
            Срочно? Звоните:{' '}
            <a href={telHref(fallbackPhone)} className="font-semibold text-accent-ink">
              {formatPhone(fallbackPhone)}
            </a>
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      // ym-*: Вебвизор Метрики не записывает ввод и содержимое формы — здесь персональные данные
      className={`ym-hide-content ym-disable-keys rounded-[var(--radius-md)] border border-border bg-surface p-6 md:p-7 ${className}`}
    >
      <p className="display-md">{title}</p>
      <p className="mt-2 text-[0.9375rem] text-fg-muted">{lead}</p>

      <div className="mt-6 space-y-4">
        <Input
          id="lead-name"
          name="name"
          label="Как вас зовут"
          autoComplete="name"
          placeholder="Иван"
          value={values.name}
          onChange={update('name')}
          error={errors.name}
          required
        />
        <Input
          id="lead-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          label="Телефон"
          autoComplete="tel"
          placeholder="+7 999 123-45-67"
          value={values.phone}
          onChange={update('phone')}
          error={errors.phone}
          required
        />
        {withTask ? (
          <Textarea
            id="lead-task"
            name="task"
            label="Что нужно сделать"
            placeholder="Опишите задачу: объект, площадь, сроки"
            value={values.task}
            onChange={update('task')}
            error={errors.details}
          />
        ) : null}

        {/* Ловушка для ботов: поле скрыто и не должно заполняться */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="lead-company">Не заполняйте это поле</label>
          <input
            id="lead-company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.hp}
            onChange={update('hp')}
          />
        </div>

        <Checkbox
          id="lead-consent"
          name="consent"
          error={errors.consent}
          label={
            <>
              Согласен на обработку персональных данных и принимаю{' '}
              <Link href="/politika" className="underline underline-offset-4 hover:text-accent-ink">
                политику конфиденциальности
              </Link>
            </>
          }
        />
      </div>

      <Button type="submit" size="lg" block className="mt-6" disabled={status === 'sending'}>
        {status === 'sending' ? 'Отправляем…' : submitLabel}
      </Button>

      {status === 'error' ? (
        <p role="alert" className="mt-4 text-sm text-[var(--danger)]">
          {formError ?? 'Заявка не отправилась.'}{' '}
          {fallbackPhone ? (
            <>
              Позвоните нам:{' '}
              <a href={telHref(fallbackPhone)} className="font-semibold underline underline-offset-4">
                {formatPhone(fallbackPhone)}
              </a>
            </>
          ) : (
            'Попробуйте ещё раз через минуту.'
          )}
        </p>
      ) : null}

      {fallbackPhone && status !== 'error' ? (
        <p className="mt-4 flex items-center justify-center gap-2 text-sm text-fg-subtle">
          <Phone className="size-4" aria-hidden="true" />
          Или позвоните:{' '}
          <a href={telHref(fallbackPhone)} data-ym="phone_click" className="font-semibold text-accent-ink">
            {formatPhone(fallbackPhone)}
          </a>
        </p>
      ) : null}
    </form>
  );
}
