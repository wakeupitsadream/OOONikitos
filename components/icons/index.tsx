import type { ReactNode, SVGProps } from 'react';

/**
 * Собственные глифы 24×24, stroke 1.75, скруглённые концы — единый вес
 * со всей графикой проекта. Эмодзи в интерфейсе запрещены, вместо них эти иконки.
 * По умолчанию иконка декоративная (aria-hidden); для самостоятельной
 * иконки передайте aria-hidden={false} и role="img" с aria-label.
 */

export type IconProps = SVGProps<SVGSVGElement>;

function Glyph({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Вредители и услуги ДезГаранта                                       */
/* ------------------------------------------------------------------ */

/** Таракан: овальное тело, надкрылья, усы и шесть ног. */
export function IconCockroach(props: IconProps) {
  return (
    <Glyph {...props}>
      <ellipse cx="12" cy="6.3" rx="2.2" ry="1.7" />
      <ellipse cx="12" cy="13.6" rx="4" ry="6.2" />
      <path d="M12 8.6v10.4" />
      <path d="M10.6 5.2C9.4 3.9 8 3 6.4 2.6M13.4 5.2c1.2-1.3 2.6-2.2 4.2-2.6" />
      <path d="M8.3 10 4.6 7.6M8 13.6H3.9M8.4 17.1 5.2 19.8" />
      <path d="m15.7 10 3.7-2.4M16 13.6h4.1M15.6 17.1l3.2 2.7" />
    </Glyph>
  );
}

/** Клоп: плоское широкое тело, щиток, короткие усы, шесть ног. */
export function IconBedbug(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M9.6 7.6 10.9 5.3h2.2l1.3 2.3" />
      <ellipse cx="12" cy="13" rx="5.2" ry="5.6" />
      <path d="M7 11.6h10M12 7.6v3.9" />
      <path d="M10.9 5.3 8.6 2.9M13.1 5.3l2.3-2.4" />
      <path d="M6.9 9.6 3.6 8M6.8 13.2H2.9M7.3 16.6l-3 2.2" />
      <path d="m17.1 9.6 3.3-1.6M17.2 13.2h3.9M16.7 16.6l3 2.2" />
    </Glyph>
  );
}

/** Муравей: три сегмента тела, коленчатые усики, шесть ног. */
export function IconAnt(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="5.4" r="1.9" />
      <ellipse cx="12" cy="10.6" rx="1.9" ry="2.3" />
      <ellipse cx="12" cy="17.3" rx="3.4" ry="4" />
      <path d="M12 7.3v1M12 12.9v.4" />
      <path d="M10.6 4.2 8.9 2.6 7.4 3.4M13.4 4.2l1.7-1.6 1.5.8" />
      <path d="M10.2 9.2 6.4 7.4M10.1 11.4 6 12M10.6 13.2l-3 2.6" />
      <path d="m13.8 9.2 3.8-1.8M13.9 11.4l4.1.6M13.4 13.2l3 2.6" />
    </Glyph>
  );
}

/** Крыса: тело, острая морда, ухо, лапы и длинный хвост. */
export function IconRodent(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M2 15.6 6.8 12c2.2-1.4 5.2-1.2 7.4.4 2.4 1.7 3.6 4.2 2.8 6-.5 1.1-1.8 1.6-3.4 1.6H6c-2.6 0-4-1.8-4-4.4Z" />
      <circle cx="9.6" cy="10.4" r="2.1" />
      <path d="M4.8 15.4h.01" />
      <path d="M2.6 16.6 1 17.6M2.6 14.6 1.1 13.8" />
      <path d="M16.8 17.4c2.8 0 4.8-2 4.4-4.6-.2-1.6-1.6-2.2-2.4-1.2" />
      <path d="M7.4 20v1.6M12.6 20v1.6" />
    </Glyph>
  );
}

/** Оса: полосатое брюшко с жалом, грудь, крылья, усики. */
export function IconWasp(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="4.9" r="1.9" />
      <ellipse cx="12" cy="9.1" rx="2.4" ry="2.5" />
      <path d="M12 11.6c3 .6 3.6 3.4 2.6 6-.6 1.6-1.8 2.8-2.6 3.6-.8-.8-2-2-2.6-3.6-1-2.6-.4-5.4 2.6-6Z" />
      <path d="M9.7 14.7h4.6M10.4 17.6h3.2" />
      <path d="M10 8.1C7 5.7 4.4 6.1 4.9 8.5c.4 1.9 3 2 5.1 1.1M14 8.1c3-2.4 5.6-2 5.1.4-.4 1.9-3 2-5.1 1.1" />
      <path d="M10.8 3.5 9.2 1.9M13.2 3.5l1.6-1.6" />
    </Glyph>
  );
}

/** Клещ: округлое тело со щитком и восемь ног. */
export function IconTick(props: IconProps) {
  return (
    <Glyph {...props}>
      <ellipse cx="12" cy="14.1" rx="5.4" ry="6" />
      <path d="M10.6 8.4 11 6.5h2l.4 1.9" />
      <path d="M11 6.5 10.2 4.8M13 6.5l.8-1.7" />
      <path d="M9.2 11.6a3 3 0 0 1 5.6 0" />
      <path d="M7.1 10.5 3.4 8.3M6.7 12.7 2.6 11.7M6.8 15 2.7 15.9M7.6 17.1l-3.4 2.3" />
      <path d="m16.9 10.5 3.7-2.2M17.3 12.7l4.1-1M17.2 15l4.1.9M16.4 17.1l3.4 2.3" />
    </Glyph>
  );
}

/** Плесень: колонии на поверхности, ворс и споры. */
export function IconMold(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M2.6 20.4h18.8" />
      <path d="M4.4 20.4a3.9 3.9 0 0 1 7.8 0" />
      <path d="M11.6 20.4a2.8 2.8 0 0 1 5.6 0" />
      <path d="M16.6 20.4a2.2 2.2 0 0 1 4.4 0" />
      <path d="M6.3 16.1 5.2 13.4M8.3 15.2v-3M10.3 16.1l1.1-2.7M14.4 17.6l-.6-2.3M17.8 18.1l.7-2.2" />
      <path d="M5.1 11.6h.01M8.3 10.5h.01M11.7 11.6h.01M13.6 13.6h.01M18.7 14.5h.01" />
    </Glyph>
  );
}

/** Вирус: ядро с короной отростков. */
export function IconVirus(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 7V4.2M12 17v2.8M7 12H4.2M17 12h2.8M8.5 8.5 6.5 6.5M15.5 8.5l2-2M8.5 15.5l-2 2M15.5 15.5l2 2" />
      <circle cx="12" cy="3.4" r="1" />
      <circle cx="12" cy="20.6" r="1" />
      <circle cx="3.4" cy="12" r="1" />
      <circle cx="20.6" cy="12" r="1" />
      <path d="M10.4 11.2h.01M13.4 13.4h.01" />
    </Glyph>
  );
}

/** Генератор тумана: бак с распылителем и облако аэрозоля. */
export function IconFogger(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="5.6" y="10" width="9.8" height="11" rx="1.8" />
      <path d="M5.6 13.8h9.8" />
      <path d="M9 10V7.6h3.2V10" />
      <rect x="8.4" y="5" width="4.4" height="2.6" rx="0.8" />
      <path d="M15.4 6.2c1.7-.6 2.9 0 3.3 1.5M16.6 9.8c2.1 0 3.1 1 2.9 2.5" />
      <path d="M20.8 4.6h.01M21.6 8.2h.01M20.6 11.8h.01M17.4 3.2h.01" />
    </Glyph>
  );
}

/** Блоха: сжатое с боков тело, щетинки и мощная прыжковая нога. */
export function IconFlea(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M6.8 18.6c-1.6-3.8.4-8.4 4.6-10.2 3.8-1.6 7.2-.2 7.6 3.2.4 3.8-3 7.4-7.4 8-2.4.4-4.2 0-4.8-1Z" />
      <path d="m6.9 18.8-2.4 2.4" />
      <path d="M8.4 10.4 6.8 8.6" />
      <path d="m14.8 17.4 3.2 3.8 3.2-2.8" />
      <path d="M10.4 19.6 9.6 22M12.8 19.2l.6 2.6" />
    </Glyph>
  );
}

/** После пожара: пламя и дым. */
export function IconSmoke(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M12 21.2c2.8 0 4.4-1.8 4.4-4.1 0-2.9-3-4.3-2.5-7.3-1.9 1.2-3.1 2.8-3 4.5-.7-.5-1.1-1.2-1.2-2-1.3 1.2-2.1 3-2.1 4.8 0 2.3 1.6 4.1 4.4 4.1Z" />
      <path d="M7.4 8.2c2-1 2-2.6.2-3.6M12 6.6c2-1 2-2.6.2-3.6M16.6 8.2c2-1 2-2.6.2-3.6" />
    </Glyph>
  );
}

/** После затопления: капля над волной. */
export function IconWaterDrop(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M12 3s-5 5.6-5 9.4a5 5 0 0 0 10 0C17 8.6 12 3 12 3Z" />
      <path d="M2.8 20.2c1.5-1.2 3-1.2 4.6 0s3.1 1.2 4.6 0 3-1.2 4.6 0 3.1 1.2 4.6 0" />
    </Glyph>
  );
}

/** Устранение запаха: расходящиеся волны. */
export function IconOdor(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M5.4 21.2h13.2" />
      <path d="M8.4 18.6c-2-2-.4-3.4-.4-4.6s-1.6-2.6.4-4.6" />
      <path d="M12 19c-2.2-2.4-.4-4-.4-5.4s-1.8-3 .4-5.4" />
      <path d="M15.6 18.6c2-2 .4-3.4.4-4.6s1.6-2.6-.4-4.6" />
    </Glyph>
  );
}

/* ------------------------------------------------------------------ */
/* Работы «Бриллиант Ремонт»                                           */
/* ------------------------------------------------------------------ */

/** Инструмент штукатура: полотно, шейки и ручка — вид сбоку. */
export function IconTrowel(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M2.6 17h16.6l2.2 2.6H4.8Z" />
      <path d="M8.4 17v-1.8M15.4 17v-1.8" />
      <rect x="6.8" y="12.2" width="10.4" height="3" rx="1.5" />
    </Glyph>
  );
}

/** Малярный валик: шубка, рамка и ручка. */
export function IconRoller(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="3.4" y="3.6" width="12.2" height="4.9" rx="1.6" />
      <path d="M15.6 6h3.4v5.5h-7v3.6" />
      <rect x="10.4" y="15.1" width="3.2" height="5.9" rx="1.2" />
    </Glyph>
  );
}

/** Правило-уровень: корпус, глазок с пузырьком, риски. */
export function IconLevel(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="2" y="8.6" width="20" height="6.8" rx="1.4" />
      <rect x="9" y="10.6" width="6" height="2.8" rx="1.4" />
      <path d="M12.6 12h.01" />
      <path d="M5.5 10.6v2.8M18.5 10.6v2.8" />
    </Glyph>
  );
}

/** Плитка: уложенное поле и элемент, который кладут. */
export function IconTile(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="2.5" y="9.4" width="19" height="11.6" rx="1.3" />
      <path d="M12 9.4V21M2.5 15.2h19" />
      <rect x="13.6" y="3" width="7.4" height="5.2" rx="1" />
    </Glyph>
  );
}

/** Ведро краски с подтёком. */
export function IconPaintBucket(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M4.6 8.4h12.8l-1.2 11.6c-.1.9-.8 1.5-1.7 1.5H7.5c-.9 0-1.6-.6-1.7-1.5Z" />
      <path d="M5.1 11.4h11.8" />
      <path d="M6.4 8.4c0-3.8 9.2-3.8 9.2 0" />
      <path d="M19.8 12.8s-1.5 1.8-1.5 2.6a1.5 1.5 0 0 0 3 0c0-.8-1.5-2.6-1.5-2.6Z" />
    </Glyph>
  );
}

/** Стена в кирпичной перевязке. */
export function IconWall(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="1.3" />
      <path d="M2.5 9.7h19M2.5 14.3h19" />
      <path d="M9 5v4.7M15.5 5v4.7" />
      <path d="M5.8 9.7v4.6M12.2 9.7v4.6M18.6 9.7v4.6" />
      <path d="M9 14.3V19M15.5 14.3V19" />
    </Glyph>
  );
}

/** Рулетка: мерная лента с рисками — замер объекта. */
export function IconRuler(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M20.8 15.2a2.2 2.2 0 0 1 0 3.2l-2.4 2.4a2.2 2.2 0 0 1-3.2 0L3.2 8.8a2.2 2.2 0 0 1 0-3.2l2.4-2.4a2.2 2.2 0 0 1 3.2 0Z" />
      <path d="m8.2 6.4-2 2M11.2 9.4l-2 2M14.2 12.4l-2 2M17.2 15.4l-2 2" />
    </Glyph>
  );
}

/** Гранёный камень: площадка, корона и павильон. */
export function IconDiamondFacet(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M6.4 3h11.2L22 9.2 12 21.4 2 9.2Z" />
      <path d="M2 9.2h20" />
      <path d="M9.1 3 7 9.2M14.9 3l2.1 6.2" />
      <path d="M7 9.2 12 21.4M17 9.2 12 21.4M12 9.2v12.2" />
    </Glyph>
  );
}

/* ------------------------------------------------------------------ */
/* Общие                                                               */
/* ------------------------------------------------------------------ */

/** Щит — знак лицензии и гарантии. */
export function IconShield(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M12 21.4c4.5-1.9 7-5.7 7-10.1V6.2L12 3.2 5 6.2v5.1c0 4.4 2.5 8.2 7 10.1Z" />
    </Glyph>
  );
}

/** Договор или акт: лист с загнутым углом и подписью. */
export function IconDocument(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M14 2.8H6a1.6 1.6 0 0 0-1.6 1.6v15.2A1.6 1.6 0 0 0 6 21.2h11a1.6 1.6 0 0 0 1.6-1.6V7.4Z" />
      <path d="M14 2.8v4.6h4.6" />
      <path d="M7.6 11.4h6.8M7.6 14.2h5" />
      <path d="M7.6 18c1-1.2 2-.6 3 .4 1-1 2 .4 3.8-.4" />
    </Glyph>
  );
}

/** График работ: календарь с отметкой. */
export function IconCalendarCheck(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9.8h18M8 3v3.6M16 3v3.6" />
      <path d="m8.6 15.2 2.4 2.4 4.8-4.8" />
    </Glyph>
  );
}

/** Телефонная трубка. */
export function IconPhone(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M6.6 3.2h3l1.6 4-2 1.2a12.5 12.5 0 0 0 6.4 6.4l1.2-2 4 1.6v3a2 2 0 0 1-2.2 2A18.6 18.6 0 0 1 4.6 5.4a2 2 0 0 1 2-2.2Z" />
    </Glyph>
  );
}

/** Часы: время выезда и сроки. */
export function IconClock(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7.2V12l3.2 2" />
    </Glyph>
  );
}

/* ------------------------------------------------------------------ */
/* Выбор глифа по имени из контента                                    */
/* ------------------------------------------------------------------ */

type GlyphComponent = (props: IconProps) => React.ReactElement;

/**
 * Контент хранит имя иконки строкой (файлы services в content), поэтому нужен
 * реестр. Компонент-обёртка держит поиск внутри себя: вызывающий код не
 * создаёт компоненты на лету и остаётся стабильным для React.
 */
const GLYPHS: Record<string, GlyphComponent> = {
  IconCockroach,
  IconBedbug,
  IconAnt,
  IconRodent,
  IconWasp,
  IconTick,
  IconMold,
  IconVirus,
  IconFogger,
  IconFlea,
  IconSmoke,
  IconWaterDrop,
  IconOdor,
  IconTrowel,
  IconRoller,
  IconLevel,
  IconTile,
  IconPaintBucket,
  IconWall,
  IconRuler,
  IconDiamondFacet,
  IconShield,
  IconDocument,
  IconCalendarCheck,
  IconPhone,
  IconClock,
};

export type ServiceIconProps = IconProps & { name: string };

/** Глиф услуги по имени из контента. Неизвестное имя — ничего не рисуем. */
export function ServiceIcon({ name, ...props }: ServiceIconProps) {
  const Glyph = GLYPHS[name];
  if (!Glyph) return null;
  return <Glyph {...props} />;
}

export function hasGlyph(name: string): boolean {
  return name in GLYPHS;
}
