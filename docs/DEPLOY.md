# Запуск и деплой

## Локально

```bash
npm install
npm run dev            # http://localhost:3000 — по умолчанию зонтичный сайт
```

Бренд на локальной машине выбирается тремя способами:

| Способ | Как |
|---|---|
| Поддомен | `http://dezgarant.localhost:3000`, `http://remont.localhost:3000` |
| Параметр | `http://localhost:3000/?site=dezgarant` |
| Переключатель | `http://localhost:3000/api/site?to=remont` — запоминает выбор в cookie |

## Проверки

```bash
npm run check          # lint + typecheck + unit-тесты + сборка
npm run test           # только юнит-тесты (node --test)
npm run e2e            # Playwright: три сайта, формы, калькуляторы
```

Playwright использует браузер из образа (`/opt/pw-browsers/chromium-1194`).
`npx playwright install` запускать не нужно; путь можно переопределить
переменной `PW_CHROMIUM`.

## Vercel

Проект `belye-niti` в команде `maxaiassistants-6238s-projects`, привязан
к репозиторию `wakeupitsadream/OOONikitos`.

- push в `main` → production;
- push в любую другую ветку → preview-деплой.

### Домены

Один проект обслуживает три сайта, бренд определяется по заголовку Host
(`next.config.ts`, правила rewrites). В Project → Domains нужно добавить:

| Сайт | Адрес сейчас | Будущий домен |
|---|---|---|
| Белые Нити | `belye-niti.vercel.app` | `belye-niti.ru` |
| ДезГарант | `dezgarant56.vercel.app` | `dezgarant56.ru` |
| Бриллиант Ремонт | `brilliant-remont56.vercel.app` | `brilliant-remont56.ru` |

Порядок правил в `next.config.ts` важен: сначала все хосты, затем `?site=`,
затем cookie, затем зонтичный фолбэк. Собственный домен бренда всегда
выигрывает у cookie другого бренда — это покрыто юнит-тестом.

Для боевых доменов (после покупки): apex → `A 76.76.21.21`,
`www` → `CNAME cname.vercel-dns-0.com`, `www` редиректит на apex.
Точные значения берите из карточки домена в Dashboard.

### Переменные окружения

Полный список — `.env.example`. Заполняются в Project → Settings →
Environment Variables, в репозиторий не попадают.

Минимум для работы заявок: `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`.
Без них форма не ломается: заявка не уходит, посетителю показывается
телефон. На preview стоит задать `LEAD_DRY_RUN=1` — формы будут отвечать
успехом без реальной отправки.

`NEXT_PUBLIC_URL_<SITE>` задаёт canonical и абсолютные ссылки между
брендами. Пока не задан, используется `*.vercel.app` из `config/sites.ts`.

`NEXT_PUBLIC_YM_<SITE>` — номер счётчика Яндекс.Метрики. Без него счётчик
не подключается и cookie-уведомление не показывается.

### Индексация

`robots.txt` и `sitemap.xml` формируются отдельно для каждого сайта.
Индексация разрешена только когда `VERCEL_ENV === 'production'`; на preview
все страницы закрыты.

## Перед боевым запуском

- [ ] Открыть `https://fp.rospotrebnadzor.ru/licen/?record_uuid=79d1374a-5a63-11f1-9a50-40f2e9218cba`
      с российского адреса и убедиться, что открывается карточка ООО «Белые Нити».
- [ ] Заменить черновые цены (`content/*/prices.ts`, `PRICE_STATUS`) прайсом владельца.
- [ ] Закрыть слоты `TODO_OWNER` из `docs/CONTENT-INPUTS.md`.
- [ ] Уведомление в Роскомнадзор об обработке персональных данных.
- [ ] Решить вопрос локализации данных: у Vercel нет региона в РФ,
      приём заявок для 152-ФЗ переносится на российский хостинг либо риск
      фиксируется письменно.
- [ ] Vercel Hobby запрещает коммерческое использование — перейти на Pro
      либо на российский хостинг.
- [ ] Перевести репозиторий в private.
