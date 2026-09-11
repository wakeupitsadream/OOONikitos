import { ShieldCheck, ExternalLink } from 'lucide-react';
import { COMPANY, LICENSE } from '@/content/company';
import { LICENSE_POINTS, type LicensePoint } from '@/content/dezgarant/license';
import { Button } from '@/components/ui/Button';
import { Diamond } from '@/components/ui/Diamond';
import { CopyNumber } from './CopyNumber';

type LicenseBlockProps = {
  /** compact — вариант для зонтичного сайта, full — для ДезГаранта. */
  variant?: 'compact' | 'full';
  points?: LicensePoint[];
  className?: string;
};

/**
 * Блок лицензии: номер, реквизиты и кнопка проверки в реестре.
 * Номер всегда виден текстом и копируется — на случай, если реестр недоступен.
 */
export function LicenseBlock({ variant = 'compact', points, className = '' }: LicenseBlockProps) {
  const list = points ?? LICENSE_POINTS;

  return (
    <div className={className}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
        <div className="min-w-0">
          <Diamond variant="accent" size="lg">
            <ShieldCheck aria-hidden="true" />
          </Diamond>
          <p className="eyebrow mt-5 text-accent-ink">Лицензированная деятельность</p>
          <h2 className="display-lg mt-2">Лицензия Роспотребнадзора</h2>

          <p className="lead mt-5">
            Оказываем услуги по дезинфекции, дезинсекции и дератизации в соответствии с требованиями
            законодательства. Проверить лицензию можно за минуту — в открытом реестре.
          </p>

          <dl className="mt-7 space-y-3 text-[0.9375rem]">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <dt className="text-fg-subtle">Номер в реестре ЕРУЛ</dt>
              <dd className="min-w-0 font-display text-base font-extrabold sm:text-lg">
                <CopyNumber value={LICENSE.erul} />
              </dd>
            </div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <dt className="text-fg-subtle">Регистрационный номер</dt>
              <dd className="tabular font-semibold">{LICENSE.registryNumber}</dd>
            </div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <dt className="text-fg-subtle">Выдана</dt>
              <dd className="font-semibold">{LICENSE.issuedAtLabel}</dd>
            </div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <dt className="text-fg-subtle">Кем выдана</dt>
              <dd className="font-semibold">{LICENSE.authority}</dd>
            </div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <dt className="text-fg-subtle">Статус</dt>
              <dd className="font-semibold text-[var(--ok)]">{LICENSE.status}</dd>
            </div>
            {variant === 'full' ? (
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <dt className="text-fg-subtle">Лицензиат</dt>
                <dd className="font-semibold">
                  {COMPANY.shortLegalName}, ИНН {COMPANY.inn}
                </dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button href={LICENSE.verifyUrl} size="lg" external>
              Проверить лицензию
              <ExternalLink className="size-4" aria-hidden="true" />
            </Button>
          </div>

          <p className="mt-4 text-sm text-fg-subtle">
            Кнопка открывает карточку реестровой записи на сайте Роспотребнадзора. Если реестр
            временно недоступен, откройте{' '}
            <a
              href={LICENSE.registryHome}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              fp.rospotrebnadzor.ru/licen
            </a>{' '}
            и введите номер вручную.
          </p>
        </div>

        <ul className="min-w-0 space-y-5">
          {list.map((point) => (
            <li key={point.title} className="border-l-2 border-accent pl-5">
              <p className="font-display text-lg font-extrabold leading-snug">{point.title}</p>
              <p className="mt-2 text-[0.9375rem] text-fg-muted">{point.text}</p>
              <p className="mt-2 text-xs text-fg-subtle">{point.source}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
