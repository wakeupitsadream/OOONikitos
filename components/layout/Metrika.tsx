'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';

type MetrikaProps = {
  /** Номер счётчика. Пустая строка — компонент не рендерится. */
  counterId: string | undefined;
};

/**
 * Яндекс.Метрика для App Router: скрипт грузится после интерактива,
 * а переходы между маршрутами отправляются вручную — иначе в статистику
 * попадёт только первый просмотр за визит.
 */
export function Metrika({ counterId }: MetrikaProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = counterId ? Number(counterId) : 0;

  useEffect(() => {
    if (!id || typeof window === 'undefined') return;
    document.documentElement.dataset.ym = String(id);
  }, [id]);

  useEffect(() => {
    if (!id || typeof window === 'undefined' || typeof window.ym !== 'function') return;
    const query = searchParams?.toString();
    const url = `${window.location.origin}${pathname}${query ? `?${query}` : ''}`;
    window.ym(id, 'hit', url);
  }, [id, pathname, searchParams]);

  if (!id) return null;

  return (
    <>
      <Script id="ym-init" strategy="afterInteractive">
        {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
ym(${id}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true, defer:true });`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://mc.yandex.ru/watch/${id}`}
          style={{ position: 'absolute', left: '-9999px' }}
          alt=""
        />
      </noscript>
    </>
  );
}
