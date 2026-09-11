import type { Metadata, Viewport } from 'next';
import { Montserrat, Onest } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const onest = Onest({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-onest',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ООО «Белые Нити»',
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
};

/**
 * На preview-хостах бренд выбирается параметром ?site=. Переходы по ссылкам
 * этот параметр не несут, поэтому сразу копируем выбор в cookie — до гидрации
 * и до того, как Next начнёт подгружать соседние страницы.
 */
const SITE_COOKIE_SCRIPT = `(function(){try{
var m=/[?&]site=(belye-niti|dezgarant|remont)(&|$)/.exec(location.search);
if(m&&document.cookie.indexOf('site='+m[1])===-1){
document.cookie='site='+m[1]+';path=/;max-age=2592000;samesite=lax';}
}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${montserrat.variable} ${onest.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SITE_COOKIE_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
