import Link from 'next/link';
import { ArrowRight, Home } from 'lucide-react';
import { COMPANY } from '@/content/company';
import { SITES } from '@/config/sites';
import { siteUrl } from '@/lib/site';
import { Container } from '@/components/ui/Container';
import { Diamond } from '@/components/ui/Diamond';
import { Button } from '@/components/ui/Button';

/**
 * 404 для всех трёх сайтов. Страница рендерится вне SiteShell:
 * на этом уровне бренд статически неизвестен, поэтому тема нейтральная
 * тёмная, знак — общий красно-бирюзовый ромб ООО, а к направлениям
 * ведут кросс-ссылки (на preview-хостах — через /api/site).
 */
export default function NotFound() {
  const directions = [
    {
      id: 'dezgarant' as const,
      text: 'Дезинфекция, дезинсекция и дератизация по лицензии Роспотребнадзора.',
    },
    {
      id: 'remont' as const,
      text: 'Штукатурка и отделка: ровные стены, понятные сроки, фиксированная смета.',
    },
  ];

  return (
    <div
      data-theme="dark"
      data-accent="red"
      className="flex min-h-dvh flex-col justify-center bg-bg py-16 text-fg md:py-24"
    >
      <div className="noise-overlay" aria-hidden="true" />
      <Container>
        <div className="max-w-2xl">
          <Diamond variant="split" size="lg" />
          <p className="eyebrow mt-6 text-accent-ink">Ошибка 404</p>
          <h1 className="display-xl mt-3">Страница не найдена</h1>
          <p className="lead mt-5">
            Такого адреса на сайте нет: возможно, в ссылке опечатка или страницу убрали. Сама
            компания на месте — {COMPANY.shortLegalName} работает в Оренбурге и области.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/" size="lg">
              <Home className="size-4" aria-hidden="true" />
              На главную
            </Button>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {directions.map((direction) => (
              <li key={direction.id}>
                <a
                  href={siteUrl(direction.id)}
                  className="group flex h-full flex-col rounded-[var(--radius-md)] border border-border bg-surface p-6 transition-[border-color,transform] duration-200 hover:-translate-y-1 hover:border-accent"
                >
                  <p className="font-display text-lg font-extrabold">{SITES[direction.id].shortName}</p>
                  <p className="mt-2 flex-1 text-[0.9375rem] text-fg-muted">{direction.text}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent-ink">
                    Перейти
                    <ArrowRight
                      className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-sm text-fg-subtle">
            Если вы попали сюда по ссылке с нашего сайта —{' '}
            <Link href="/" className="underline underline-offset-4 hover:text-accent-ink">
              вернитесь на главную
            </Link>{' '}
            и напишите нам в заявке, где она стояла. Поправим.
          </p>
        </div>
      </Container>
    </div>
  );
}
