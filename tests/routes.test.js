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

    assert.match(html, /<h3>씨앤에이아이<\/h3>/);
    assert.match(html, /2026\.04 - 현재 · 백엔드 개발자/);
    assert.match(html, /백엔드 개발자/);
    assert.match(html, /Toss·PayPal 결제 안정성 구조/);
    assert.match(html, /구독 결제/);
    assert.match(html, /<h3>샵체인<\/h3>/);
    assert.match(html, /2024\.01 - 2026\.03 · 풀스택 개발자/);
    assert.match(html, /풀스택 개발자/);
    assert.match(html, /2023\.06 - 2024\.01 · 인턴/);
    assert.match(html, /인턴/);
    assert.match(html, /PG 결제 내역 자동 대조/);
    assert.match(html, /정산 대행 플랫폼/);
  });

  it('home page groups multiple projects inside each company career card', () => {
    const html = readFileSync(join(root, 'index.html'), 'utf8');

    assert.match(html, /class="career-timeline site-shell"/);
    assert.match(html, /class="company-icon"/);
    assert.match(html, /class="career-period"/);
    assert.match(html, /class="project-period"/);
    assert.match(html, /class="company-summary"/);
    assert.match(html, /class="career-projects"/);
    assert.match(html, /class="career-project"/);
    assert.match(html, /2024\.12 - 2025\.02/);
    assert.match(html, /2025\.08 - 2025\.12/);
    assert.match(html, /2025\.01 - 2025\.04/);
    assert.match(html, /2024\.10 - 2024\.11/);
    assert.match(html, /2023\.06 - 2024\.01/);
    assert.match(html, /구독 결제 및 실패 보상 처리/);
    assert.match(html, /POS·KIOSK 네이버페이 결제/);
    assert.match(html, /모니터링 및 로그 조회 환경/);
    assert.match(html, /서비스 운영 및 개발 업무 참여/);
  });
});
