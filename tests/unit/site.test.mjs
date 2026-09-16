import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeHost, resolveSiteByHost, resolveSite, isKnownHost } from '../helpers/loader.mjs';

test('normalizeHost убирает порт, www и регистр', () => {
  assert.equal(normalizeHost('WWW.Dezgarant56.RU:3000'), 'dezgarant56.ru');
  assert.equal(normalizeHost('belye-niti.ru'), 'belye-niti.ru');
  assert.equal(normalizeHost(''), '');
  assert.equal(normalizeHost(null), '');
  assert.equal(normalizeHost(undefined), '');
});

test('resolveSiteByHost определяет бренд по собственному домену', () => {
  assert.equal(resolveSiteByHost('dezgarant56.ru'), 'dezgarant');
  assert.equal(resolveSiteByHost('www.dezgarant56.vercel.app'), 'dezgarant');
  assert.equal(resolveSiteByHost('brilliant-remont56.ru'), 'remont');
  // Адрес самого проекта — общий демо-хост, а не бренд: на нём работают ?site= и cookie
  assert.equal(resolveSiteByHost('belye-niti.vercel.app'), null);
  assert.equal(resolveSiteByHost('belye-niti.ru'), 'belye-niti');
});

test('resolveSiteByHost поддерживает поддомены разработки', () => {
  assert.equal(resolveSiteByHost('dezgarant.localhost:3000'), 'dezgarant');
  assert.equal(resolveSiteByHost('remont.localhost'), 'remont');
});

test('resolveSiteByHost возвращает null для неизвестных хостов', () => {
  assert.equal(resolveSiteByHost('belye-niti-git-feature.vercel.app'), null);
  assert.equal(resolveSiteByHost('localhost:3000'), null);
  assert.equal(resolveSiteByHost('example.com'), null);
  assert.equal(resolveSiteByHost(''), null);
});

test('isKnownHost отличает боевой домен от preview', () => {
  assert.equal(isKnownHost('dezgarant56.ru'), true);
  assert.equal(isKnownHost('belye-niti-git-feature.vercel.app'), false);
});

test('resolveSite: хост имеет приоритет над query и cookie', () => {
  assert.equal(
    resolveSite({ host: 'brilliant-remont56.ru', querySite: 'dezgarant', cookieSite: 'dezgarant' }),
    'remont',
  );
});

test('resolveSite: на неизвестном хосте query важнее cookie', () => {
  assert.equal(
    resolveSite({ host: 'preview.vercel.app', querySite: 'remont', cookieSite: 'dezgarant' }),
    'remont',
  );
});

test('resolveSite: cookie работает, когда нет ни хоста, ни query', () => {
  assert.equal(resolveSite({ host: 'preview.vercel.app', cookieSite: 'dezgarant' }), 'dezgarant');
});

test('resolveSite: мусор в query и cookie игнорируется', () => {
  assert.equal(
    resolveSite({ host: 'preview.vercel.app', querySite: '../etc', cookieSite: 'нет' }),
    'belye-niti',
  );
  assert.equal(resolveSite({}), 'belye-niti');
});
