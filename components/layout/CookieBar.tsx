'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const STORAGE_KEY = 'cookie-notice-accepted';

/**
 * Уведомление о cookie. Показывается только там, где подключена Метрика,
 * и только если посетитель ещё не закрыл его.
 */
export function CookieBar({ enabled }: { enabled: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    // Кадр задержки: React не любит синхронный setState в теле эффекта,
    // а пользователю эта миллисекунда незаметна.
    const frame = requestAnimationFrame(() => {
      try {
        if (window.localStorage.getItem(STORAGE_KEY) !== '1') setVisible(true);
      } catch {
        // Приватный режим — просто не показываем уведомление
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [enabled]);

  if (!enabled || !visible) return null;

  const accept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Не критично: уведомление просто появится снова
    }
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Уведомление об использовании cookie"
      // До lg внизу лежит полоса связи (~3.6rem + безопасная зона) — плашка встаёт над ней
      className="fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] z-[55] rounded-[var(--radius-md)] border border-border bg-surface p-4 shadow-[var(--shadow)] sm:inset-x-auto sm:right-4 sm:max-w-sm lg:bottom-4"
    >
      <p className="text-sm text-fg-muted">
        Мы используем cookie и сервис веб-аналитики, чтобы сайт работал корректно. Подробности —
        в{' '}
        <Link href="/politika" className="underline underline-offset-4 hover:text-accent-ink">
          политике конфиденциальности
        </Link>
        .
      </p>
      <Button onClick={accept} size="md" className="mt-3 w-full sm:w-auto">
        Понятно
      </Button>
    </div>
  );
}
