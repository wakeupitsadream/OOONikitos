import type { SiteId } from '@/config/sites';

/**
 * Направления ООО «Белые Нити» для зонтичного сайта.
 * Новое направление добавляется сюда — и сразу появляется в схеме компании.
 */
export type Direction = {
  site: SiteId;
  name: string;
  tagline: string;
  description: string;
  /** Услуги чипами — короткие формулировки. */
  services: string[];
  /** Факт-строка: то, что отличает направление. */
  fact: string;
  cta: string;
};

export const DIRECTIONS: Direction[] = [
  {
    site: 'remont',
    name: 'Бриллиант Ремонт',
    tagline: 'Строительство • ремонт • отделка',
    description:
      'Выводим стены под обои и покраску, доводим отделку до состояния, в котором мебель встаёт без щелей. Смета фиксируется договором.',
    services: ['Штукатурка стен', 'Шпаклёвка под покраску', 'Покраска', 'Поклейка обоев'],
    fact: 'Смета в договоре, срок считается от площади',
    cta: 'Мне нужен ремонт',
  },
  {
    site: 'dezgarant',
    name: 'ДезГарант',
    tagline: 'Дезинфекция • дезинсекция • дератизация',
    description:
      'Выводим насекомых и грызунов, убираем плесень и запахи. Работаем по лицензии Роспотребнадзора, с договором и актами для проверок.',
    services: ['Тараканы и клопы', 'Грызуны', 'Клещи на участке', 'Плесень и запахи'],
    fact: 'Лицензия ЕРУЛ, договор и акт для проверки',
    cta: 'Мне нужна обработка объекта',
  },
];

/** Сценарии, где оба направления работают на одном объекте. */
export const COMBINED_SCENARIOS = [
  {
    title: 'Ремонт и обработка перед заселением',
    text: 'Сначала выводим насекомых, потом делаем отделку — иначе свежие обои вскрывают сразу после заселения. Порядок работ согласуем один раз, с одним подрядчиком.',
  },
  {
    title: 'Обработка помещения после ремонта',
    text: 'Строительная пыль, сырость и запахи держатся в помещении неделями. Дезинфекция и озонирование снимают их до того, как вы завезёте мебель.',
  },
  {
    title: 'Коммерческий объект: отделка и договор на дератизацию',
    text: 'Для кафе, магазина или склада отделка и санитарный договор нужны одновременно. Мы закрываем оба вопроса как одно юридическое лицо, с общим комплектом документов.',
  },
];

/** Быстрый подбор направления на зонтичном сайте. */
export const ROUTER_OPTIONS = [
  {
    id: 'flat',
    label: 'Квартира',
    tasks: [
      { label: 'Выровнять стены под обои', site: 'remont' as SiteId, href: '/uslugi/shtukaturka' },
      { label: 'Покрасить или поклеить обои', site: 'remont' as SiteId, href: '/uslugi/oboi' },
      { label: 'Вывести тараканов или клопов', site: 'dezgarant' as SiteId, href: '/uslugi/klopy' },
      { label: 'Убрать плесень или запах', site: 'dezgarant' as SiteId, href: '/uslugi/plesen' },
    ],
  },
  {
    id: 'house',
    label: 'Частный дом',
    tasks: [
      { label: 'Отделка стен', site: 'remont' as SiteId, href: '/uslugi/shtukaturka' },
      { label: 'Обработка участка от клещей', site: 'dezgarant' as SiteId, href: '/uslugi/kleshchi' },
      { label: 'Мыши и крысы', site: 'dezgarant' as SiteId, href: '/uslugi/gryzuny' },
      { label: 'Осы и шершни', site: 'dezgarant' as SiteId, href: '/uslugi/osy-shershni' },
    ],
  },
  {
    id: 'business',
    label: 'Бизнес',
    tasks: [
      { label: 'Отделка помещения', site: 'remont' as SiteId, href: '/uslugi' },
      { label: 'Договор на дератизацию', site: 'dezgarant' as SiteId, href: '/biznesu' },
      { label: 'Документы для Роспотребнадзора', site: 'dezgarant' as SiteId, href: '/biznesu' },
      { label: 'Дезинфекция помещений', site: 'dezgarant' as SiteId, href: '/uslugi/dezinfekciya' },
    ],
  },
];
