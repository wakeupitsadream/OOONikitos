import { test, expect, type Page } from '@playwright/test';

/**
 * Сквозные проверки трёх сайтов. Бренд выбирается параметром ?site=,
 * как на preview-деплое: так одна сборка проверяется целиком.
 */

const SITES = [
  { id: 'belye-niti', name: 'Белые Нити', home: '/', theme: 'dark' },
  { id: 'dezgarant', name: 'ДезГарант', home: '/', theme: 'light' },
  { id: 'remont', name: 'Бриллиант Ремонт', home: '/', theme: 'dark' },
] as const;

/** Яркость из строки вида «rgb(10, 10, 10)» — грубо, для проверки темы. */
function luminance(color: string): number {
  const parts = color.match(/\d+(\.\d+)?/g);
  if (!parts || parts.length < 3) return Number.NaN;
  const [r, g, b] = parts.slice(0, 3).map(Number);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function url(path: string, site: string): string {
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}site=${site}`;
}

/** Собирает ошибки консоли и страницы за время теста. */
function watchErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  return errors;
}

for (const site of SITES) {
  test.describe(`Сайт ${site.name}`, () => {
    test('главная открывается, есть один H1 и нет ошибок в консоли', async ({ page }) => {
      const errors = watchErrors(page);
      const response = await page.goto(url(site.home, site.id), { waitUntil: 'load' });
      expect(response?.status()).toBe(200);

      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
      await expect(h1).not.toBeEmpty();

      await expect(page.locator('footer')).toContainText('maxim-batutin.ru');
      expect(errors, `ошибки в консоли: ${errors.join(' | ')}`).toHaveLength(0);
    });

    test('нет горизонтальной прокрутки', async ({ page }) => {
      await page.goto(url(site.home, site.id), { waitUntil: 'load' });
      // прокручиваем страницу целиком: часть блоков появляется по мере показа
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 40));
        }
        window.scrollTo(0, 0);
      });
      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
    });

    test('все внутренние ссылки отвечают 200', async ({ page, request }) => {
      await page.goto(url(site.home, site.id), { waitUntil: 'load' });
      const hrefs = await page.evaluate(() =>
        [...document.querySelectorAll('a[href^="/"]')]
          .map((a) => a.getAttribute('href') ?? '')
          .filter((href) => href.startsWith('/') && !href.startsWith('//')),
      );
      const unique = [...new Set(hrefs)].filter((href) => !href.startsWith('/api/'));
      expect(unique.length).toBeGreaterThan(0);

      for (const href of unique) {
        const [path, hash] = href.split('#');
        if (!path) continue;
        const response = await request.get(url(path, site.id));
        expect(response.status(), `${href} (${hash ?? ''})`).toBe(200);
      }
    });

    test('изображения загрузились', async ({ page }) => {
      await page.goto(url(site.home, site.id), { waitUntil: 'load' });
      const broken = await page.evaluate(
        () => [...document.images].filter((img) => !img.complete || img.naturalWidth === 0).length,
      );
      expect(broken).toBe(0);
    });
  });
}

test.describe('Мобильное меню', () => {
  // На телефоне: шторка должна быть в пределах экрана и закрываться по ссылке.
  // Ловит регрессию, когда panel позиционируется относительно шапки
  // с backdrop-filter и уезжает за верхнюю кромку.
  for (const site of SITES) {
    test(`${site.name}: шторка открывается в пределах экрана`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'mobile', 'только мобильный проект');
      await page.goto(url(site.home, site.id), { waitUntil: 'load' });

      await page.getByRole('button', { name: 'Открыть меню' }).click();
      const panel = page.getByRole('dialog', { name: 'Меню сайта' });
      await expect(panel).toBeVisible();

      const viewport = page.viewportSize();
      const box = await panel.boundingBox();
      expect(box, 'шторка должна иметь размеры').not.toBeNull();
      expect(box!.y, 'верх шторки не выше экрана').toBeGreaterThanOrEqual(0);
      expect(box!.y + box!.height, 'низ шторки не ниже экрана').toBeLessThanOrEqual(
        (viewport?.height ?? 0) + 1,
      );

      // Шторка живёт в портале — тема сайта должна сохраняться и там
      const panelBg = await panel.evaluate((el) => getComputedStyle(el).backgroundColor);
      const brightness = luminance(panelBg);
      expect(Number.isNaN(brightness), `не разобран цвет ${panelBg}`).toBe(false);
      if (site.theme === 'dark') {
        expect(brightness, `тёмная тема, а фон шторки ${panelBg}`).toBeLessThan(90);
      } else {
        expect(brightness, `светлая тема, а фон шторки ${panelBg}`).toBeGreaterThan(180);
      }

      // Первый пункт меню кликается и уводит на свою страницу
      const first = panel.getByRole('link').first();
      const href = await first.getAttribute('href');
      await first.click();
      await expect(panel).toBeHidden();
      if (href && href.startsWith('/') && !href.startsWith('/#')) {
        await expect(page).toHaveURL(new RegExp(href.replace(/[/]/g, '\\/')));
      }
    });
  }
});

test.describe('Липкая полоса связи', () => {
  // Полоса fixed внизу экрана: она не должна закрывать подпись в футере
  // и не должна рисовать пустые ячейки, когда мессенджера у бренда нет.
  for (const site of SITES.filter((item) => item.id !== 'belye-niti')) {
    test(`${site.name}: полоса не закрывает футер и без пустых ячеек`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'mobile', 'только мобильный проект');
      await page.goto(url(site.home, site.id), { waitUntil: 'load' });

      const bar = page.locator('[data-callback-bar]');
      await expect(bar).toBeVisible();
      const cells = bar.locator('.grid > *');
      const links = bar.locator('.grid > a');
      expect(await cells.count(), 'все ячейки полосы — ссылки').toBe(await links.count());
      expect(await links.count()).toBeGreaterThanOrEqual(2);

      // Подпись разработчика в самом низу футера должна быть кликабельна,
      // то есть в её центре сверху лежит она сама, а не полоса.
      const signature = page.locator('footer a[href*="maxim-batutin.ru"]');
      await signature.scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(150);
      const covered = await signature.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        const top = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
        return !(top === el || el.contains(top));
      });
      expect(covered, 'подпись в футере перекрыта липкой полосой').toBe(false);
    });
  }
});

test.describe('Форма заявки', () => {
  test('пустая форма показывает ошибки по-русски', async ({ page }) => {
    await page.goto(url('/', 'dezgarant'), { waitUntil: 'load' });
    const form = page.locator('form[data-ready="true"]').filter({ hasText: 'Оставьте заявку' }).first();
    await form.scrollIntoViewIfNeeded();
    await form.getByRole('button', { name: /Отправить заявку/ }).click();

    await expect(form.getByText('Как к вам обращаться?')).toBeVisible();
    await expect(form.getByText(/Укажите телефон/)).toBeVisible();
    await expect(form.getByText(/Нужно согласие/)).toBeVisible();
  });

  test('валидная заявка доходит до экрана успеха', async ({ page }) => {
    await page.goto(url('/', 'dezgarant'), { waitUntil: 'load' });
    const form = page.locator('form[data-ready="true"]').filter({ hasText: 'Оставьте заявку' }).first();
    await form.scrollIntoViewIfNeeded();

    await form.getByLabel('Как вас зовут').fill('Иван');
    await form.getByLabel('Телефон').fill('+7 909 613-29-37');
    await form.getByRole('checkbox').check();
    await form.getByRole('button', { name: /Отправить заявку/ }).click();

    await expect(page.getByText('Заявка принята')).toBeVisible({ timeout: 15_000 });
  });
});

test.describe('Диагностика ДезГаранта', () => {
  test('расчёт меняется при смене входных данных', async ({ page }) => {
    await page.goto(url('/', 'dezgarant'), { waitUntil: 'load' });
    const block = page.locator('#raschet');
    await block.scrollIntoViewIfNeeded();
    // Ближайший выезд считается в эффекте — значит компонент уже гидрирован
    await expect(block.getByText(/Ближайший выезд/)).toBeVisible();

    const price = block.locator('p.display-lg').first();
    const initial = (await price.textContent()) ?? '';
    expect(initial).toMatch(/\d/);

    // 4-комнатная квартира дороже 2-комнатной
    await block.getByText('4-комнатная и больше').click();
    await expect(price).not.toHaveText(initial);
  });

  test('клопы считаются курсом из двух обработок', async ({ page }) => {
    await page.goto(url('/', 'dezgarant'), { waitUntil: 'load' });
    const block = page.locator('#raschet');
    await block.scrollIntoViewIfNeeded();
    await expect(block.getByText(/Ближайший выезд/)).toBeVisible();
    await block.getByRole('button', { name: 'Клопы', exact: true }).click();
    await expect(block.getByText(/контрольный визит — всё уже в цене/)).toBeVisible();
  });
});

test.describe('Роутинг по брендам', () => {
  test('разные бренды отдают разный контент на одном хосте', async ({ page }) => {
    await page.goto(url('/', 'dezgarant'), { waitUntil: 'load' });
    const dezTitle = await page.title();

    await page.goto(url('/', 'remont'), { waitUntil: 'load' });
    const remontTitle = await page.title();

    expect(dezTitle).not.toBe(remontTitle);
  });

  test('переключатель бренда запоминает выбор в cookie', async ({ page, context }) => {
    await page.goto('/api/site?to=remont', { waitUntil: 'load' });
    const cookies = await context.cookies();
    const siteCookie = cookies.find((cookie) => cookie.name === 'site');
    expect(siteCookie?.value).toBe('remont');
  });
});
