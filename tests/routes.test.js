import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

const isFile = (path) => existsSync(path) && statSync(path).isFile();

const requiredRoutes = [
  'index.html',
  'projects/index.html',
  'projects/pg-reconciliation/index.html',
  'projects/settlement-platform/index.html',
  'projects/payment-reliability/index.html',
  'records/index.html',
  'about/index.html',
];

describe('static routes', () => {
  for (const route of requiredRoutes) {
    it(`${route} exists`, () => {
      assert.ok(isFile(join(root, route)), `${route} should exist`);
    });
  }

  it('home page loads shared stylesheet and module script', () => {
    const homePath = join(root, 'index.html');
    assert.ok(isFile(homePath), 'index.html should exist');

    const html = readFileSync(homePath, 'utf8');
    assert.match(html, /<link\b(?=[^>]*\brel=["']stylesheet["'])(?=[^>]*\bhref=["']assets\/styles\.css["'])[^>]*>/);
    assert.match(html, /<script\b[^>]*\btype=["']module["']/);
  });

  it('home page exposes key content regions', () => {
    const html = readFileSync(join(root, 'index.html'), 'utf8');
    assert.match(html, /id="about-snapshot"/);
    assert.match(html, /id="core-skills"/);
    assert.match(html, /id="featured-projects"/);
    assert.match(html, /id="project-archive-preview"/);
    assert.match(html, /id="experience"/);
    assert.match(html, /id="recent-records"/);
  });

  it('home page uses a warmer narrative tone', () => {
    const html = readFileSync(join(root, 'index.html'), 'utf8');
    assert.match(html, /안녕하세요/);
    assert.match(html, /이런 일을 해왔습니다/);
    assert.match(html, /기록은 따로 모아두었습니다/);
  });
});
