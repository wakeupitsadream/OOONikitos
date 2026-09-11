# CLAUDE.md — правила проекта «Белые Нити»

## Что это
Три сайта ООО «Белые Нити» (Оренбург) в одном Next.js-проекте: зонтичный `belye-niti`, «ДезГарант» (`dezgarant`, дезинфекция/дезинсекция/дератизация, лицензия Роспотребнадзора) и «Бриллиант Ремонт» (`remont`, штукатурка и отделка). Полный план сборки — `docs/PLAN.md`, читать целиком до первой строки кода. Входные данные и незакрытые слоты — `docs/CONTENT-INPUTS.md`. Исходники бренда — `docs/brand/`. Результаты разведки (реестр лицензий, нормативка, два рынка Оренбурга) — `docs/research/*.json`.

## Ветка и деплой
- Работать в ветке `claude/belye-niti-websites-w42jwl`, коммитить по фазам §13 плана, пушить после каждой фазы — Vercel делает preview-деплой на каждый push.
- В `main` не пушить: production = `main`, PR только после приёмки владельцем.
- Vercel-проект `belye-niti` в команде `maxaiassistants-6238s-projects`. Секреты — только в Environment Variables Vercel, никогда в репо, коммитах и чате. Список env — §11 плана и `docs/CONTENT-INPUTS.md`.

## Команды
`npm run dev` / `build` / `start` / `lint` / `typecheck` / `test` (`node --test tests/unit`) / `e2e` (Playwright) / `check` (lint + typecheck + test + build). Коммит — только после зелёного `npm run check`.

## Жёсткие правила
1. Русский язык везде: UI, ошибки валидации, тексты, `alt`. Типографика через `lib/typograf.ts` («ёлочки», длинное тире, неразрывные пробелы перед ₽, м², %), склонения через `plural()`.
2. Не выдумывать реквизиты, цены, гарантии, адреса, сроки. Данные только из `content/*`; черновые цены из `docs/research` помечаются `status: 'draft'` и рендерятся с пометкой «уточняется»; слоты без данных — `TODO_OWNER`, соответствующая секция не рендерится.
3. Шрифты: Montserrat (дисплей, 800/900) + Onest (текст) через `next/font/google`, `subsets: ['cyrillic','latin']`. Inter/Roboto/системные запрещены. Эмодзи в UI запрещены — только SVG.
4. Айдентика: красно-бирюзовый ромб — знак ООО и ДезГаранта; чёрный + золото с гранёным бриллиантом — Бриллиант Ремонт (см. `docs/brand/cards/`). Темы: `belye-niti` тёмная, `dezgarant` светлая, `remont` тёмная. Токены — §3.1 плана.
5. Роутинг по Host → внутренние маршруты `/_sites/<site>/...`: вариант A — `rewrites()` в `next.config.ts` с условиями `has` (host, затем query/cookie `site`, затем fallback на зонтик), вариант B — `proxy.ts` (§1.1 плана). Публичные URL чистые; на preview-хостах сайт выбирается через `?site=` и cookie.
6. Заявки: `POST /api/lead` → Telegram + SMTP, схема zod общая для клиента и сервера, honeypot + минимальное время + лимит по IP; `LEAD_DRY_RUN=1` для e2e и preview без секретов; в логах никаких персональных данных.
7. Лицензия: ЕРУЛ № Л064-00111-56/05167787, рег. № 56.01.03.003.Л.000008.05.26, выдана 28.05.2026 Управлением Роспотребнадзора по Оренбургской области. Ссылка для кнопки «Проверить лицензию» — `https://fp.rospotrebnadzor.ru/licen/?record_uuid=79d1374a-5a63-11f1-9a50-40f2e9218cba` (хранить в `content/company.ts`). Юридические формулировки — только из Приложения B п. 2 плана и `docs/research/law.json`; фразу «уголовная ответственность за доход без лицензии» не использовать.
8. Не публиковать: выписку из реестра, адрес места осуществления деятельности из лицензии, юридический адрес в футере (только в политике конфиденциальности).
9. Playwright использует браузер из `/opt/pw-browsers`; `playwright install` не запускать.
10. В футере каждого сайта обязательная подпись: `Дизайн и разработка — <a href="https://maxim-batutin.ru" target="_blank" rel="noopener">maxim-batutin.ru</a>`.
11. Дизайн без признаков ИИ-шаблона (§3.6 плана): без фиолетовых градиентов, глассморфизма, «Наша миссия», стоковых улыбок, идеальной симметрии. Фото людей — только реальные от владельца.

## Порядок работ
Фазы §13 `docs/PLAN.md`: bootstrap → дизайн-система → три сайта параллельно (worktree-изоляция) → заявки, аналитика, юридика → адверсариальное ревью до «сухого» состояния → деплой и приёмка. Критерии готовности каждой фазы и чек-лист верификации (§12) — там же.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Известные особенности

- Папки сайтов называются `app/%5Fsites/<site>` — это экранированное подчёркивание.
  Без экранирования Next считает папку приватной и маршруты не создаются.
  В командах путь берите в кавычки: `ls 'app/%5Fsites/dezgarant'`.
- `next dev` и `next build` генерируют разные имена этих маршрутов, из-за чего
  сгенерированный `.next/types/validator.ts` конфликтует со `.next/dev/types`.
  Поэтому `npm run typecheck` сначала удаляет `.next/dev/types`.
- Playwright в образе старше пакета `@playwright/test`, поэтому путь к браузеру
  задан явно в `playwright.config.ts` (переопределяется переменной `PW_CHROMIUM`).
