import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { COMPANY } from '@/content/company';
import { SITES, SITE_IDS } from '@/config/sites';
import { siteUrl } from '@/lib/site';
import { Container } from '@/components/ui/Container';
import { Diamond } from '@/components/ui/Diamond';
import { Button } from '@/components/ui/Button';

/**
 * Корневая 404. Ловит любой несуществующий путь до того, как сработает
 * rewrite на бренд, поэтому тема здесь нейтральная тёмная: какой именно
 * сайт запросил страницу, статически неизвестно.
 */
export default function NotFound() {
  return (
    <div
      data-theme="dark"
      data-accent="red"
      className="grid min-h-dvh place-items-center bg-bg text-fg"
    >
      <Container className="py-16 text-center">
        <Diamond variant="split" size="lg" className="mx-auto" />
        <p className="eyebrow mt-6 text-fg-subtle">Ошибка 404</p>
        <h1 className="display-lg mt-3">Такой страницы нет</h1>
        <p className="lead mx-auto mt-4 max-w-lg">
          Возможно, адрес набран с опечаткой или страницу перенесли. Выберите направление —
          покажем нужный раздел.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/" variant="secondary" size="lg">
            <ArrowLeft className="size-4" aria-hidden="true" />
            На главную
          </Button>
          {SITE_IDS.filter((id) => id !== 'belye-niti').map((id) => (
            <Button key={id} href={siteUrl(id)} size="lg">
              {SITES[id].shortName}
            </Button>
          ))}
        </div>

        <p className="mt-10 text-sm text-fg-subtle">
          {COMPANY.shortLegalName} ·{' '}
          <Link href="/politika" className="underline underline-offset-4">
            Политика конфиденциальности
          </Link>
        </p>
      </Container>
    </div>
  );
}
