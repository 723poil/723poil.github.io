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
    assert.match(html, /운영에서 반복되는 문제를 구조적으로 줄이는/);
    assert.match(html, /백엔드 개발자입니다/);
  });

  it('home page uses reference-style primary section titles without small helper labels', () => {
    const html = readFileSync(join(root, 'index.html'), 'utf8');

    assert.match(html, /<h2 class="section-title">ABOUT ME<\/h2>/);
    assert.match(html, /<h2 class="section-title">SKILLS<\/h2>/);
    assert.match(html, /<h2 class="section-title">PROJECTS<\/h2>/);
    assert.match(html, /<h2 class="section-title">CAREER<\/h2>/);

    assert.doesNotMatch(html, /section-index/);
    assert.doesNotMatch(html, /terminal-label/);
    assert.doesNotMatch(html, /class="lead"/);
    assert.doesNotMatch(html, /class="section-lead"/);
  });

  it('home page shows requested about me profile details', () => {
    const html = readFileSync(join(root, 'index.html'), 'utf8');

    assert.match(html, /이름/);
    assert.match(html, /이상협/);
    assert.match(html, /leetkdguq73@naver\.com/);
    assert.match(html, /학력/);
    assert.match(html, /경북대학교\(컴퓨터학부\)/);
  });

  it('home page shows clearer career details', () => {
    const html = readFileSync(join(root, 'index.html'), 'utf8');

    assert.match(html, /2026 - 현재 · 씨앤에이아이/);
    assert.match(html, /백엔드 개발자/);
    assert.match(html, /Toss·PayPal 결제 안정성 구조/);
    assert.match(html, /구독 결제/);
    assert.match(html, /2023 - 2026 · 샵체인/);
    assert.match(html, /풀스택 개발자/);
    assert.match(html, /PG 결제 내역 자동 대조/);
    assert.match(html, /정산 대행 플랫폼/);
  });
});
