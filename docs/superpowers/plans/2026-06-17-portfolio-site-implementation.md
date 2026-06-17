# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static GitHub Pages portfolio site with a clear backend-developer identity, full project catalog, featured case studies, Records archive, and concise About page.

**Architecture:** Use a no-build static site so GitHub Pages can serve the repository directly. Store project and record content in ES modules under `data/`, render repeated UI with lightweight browser modules under `assets/`, and verify content/routes with Node's built-in test runner.

**Tech Stack:** HTML, CSS, vanilla JavaScript ES modules, Node.js built-in `node:test`, GitHub Pages static hosting.

---

## File Structure

- Create: `package.json` - test and local preview scripts.
- Modify: `.gitignore` - keep local runtime artifacts ignored.
- Create: `assets/styles.css` - global responsive styling, layout, cards, buttons, filters.
- Create: `assets/main.js` - shared navigation, footer year, utility rendering helpers.
- Create: `assets/projects-page.js` - render project catalog and category filters.
- Create: `assets/project-detail.js` - render one project case study from a slug.
- Create: `assets/records-page.js` - render records list and category filters.
- Create: `data/projects.js` - structured project content extracted from the resume.
- Create: `data/records.js` - initial record entries and categories.
- Create: `index.html` - homepage with identity, strengths, featured projects, recent records.
- Create: `projects/index.html` - full project catalog.
- Create: `projects/pg-reconciliation/index.html` - featured project detail route.
- Create: `projects/settlement-platform/index.html` - featured project detail route.
- Create: `projects/payment-reliability/index.html` - featured project detail route.
- Create: `records/index.html` - records archive.
- Create: `about/index.html` - concise resume summary.
- Create: `tests/content.test.js` - validate project and record data.
- Create: `tests/routes.test.js` - validate required static routes and script/style links.

## Task 1: Project Scaffold And Verification Harness

**Files:**
- Create: `package.json`
- Modify: `.gitignore`
- Create: `tests/routes.test.js`

- [ ] **Step 1: Write failing route test**

Create `tests/routes.test.js`:

```js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;

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
      assert.equal(existsSync(join(root, route)), true);
    });
  }

  it('home page loads shared stylesheet and module script', () => {
    const html = readFileSync(join(root, 'index.html'), 'utf8');
    assert.match(html, /assets\/styles\.css/);
    assert.match(html, /type="module"/);
  });
});
```

- [ ] **Step 2: Add test script**

Create `package.json`:

```json
{
  "name": "723poil-portfolio",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test",
    "preview": "python3 -m http.server 4173"
  }
}
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test`

Expected: FAIL because required HTML routes do not exist yet.

- [ ] **Step 4: Keep generated artifacts ignored**

Ensure `.gitignore` contains:

```gitignore
.superpowers/
tmp/
node_modules/
.DS_Store
```

- [ ] **Step 5: Commit scaffold**

Run:

```bash
git add package.json .gitignore tests/routes.test.js
git commit -m "test: add static route verification"
```

## Task 2: Content Data Model

**Files:**
- Create: `data/projects.js`
- Create: `data/records.js`
- Create: `tests/content.test.js`

- [ ] **Step 1: Write failing content tests**

Create `tests/content.test.js`:

```js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { projects } from '../data/projects.js';
import { records } from '../data/records.js';

describe('project content', () => {
  it('contains all resume-derived projects', () => {
    assert.equal(projects.length, 8);
  });

  it('has exactly three featured projects', () => {
    assert.equal(projects.filter((project) => project.featured).length, 3);
  });

  it('uses stable unique slugs', () => {
    const slugs = projects.map((project) => project.slug);
    assert.equal(new Set(slugs).size, slugs.length);
    assert.ok(slugs.includes('pg-reconciliation'));
    assert.ok(slugs.includes('settlement-platform'));
    assert.ok(slugs.includes('payment-reliability'));
  });

  it('featured projects have case study sections', () => {
    for (const project of projects.filter((item) => item.featured)) {
      assert.ok(project.problem.length > 20);
      assert.ok(project.approach.length > 20);
      assert.ok(project.implementation.length > 20);
      assert.ok(project.result.length > 20);
    }
  });
});

describe('record content', () => {
  it('starts with three record categories', () => {
    const categories = new Set(records.map((record) => record.category));
    assert.deepEqual([...categories].sort(), ['Learning Notes', 'Retrospectives', 'Work Logs']);
  });

  it('links at least one record to a featured project', () => {
    assert.ok(records.some((record) => record.relatedProject === 'pg-reconciliation'));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`

Expected: FAIL because `data/projects.js` and `data/records.js` do not exist.

- [ ] **Step 3: Create project data**

Create `data/projects.js`:

```js
export const projectCategories = ['All', 'Payment', 'Settlement', 'Ops', 'Android', 'Documentation'];

export const projects = [
  {
    slug: 'pg-reconciliation',
    title: 'PG 결제 내역 자동 대조',
    company: '샵체인',
    period: '2024.12 - 2025.02',
    role: '풀스택 개발자',
    featured: true,
    categories: ['Payment', 'Settlement', 'Ops'],
    technologies: ['NestJS', 'Vue3', 'MySQL', 'Scheduler'],
    summary: 'PG사 결제 내역과 내부 결제 데이터를 자동 대조해 정산 검증 시간을 줄인 운영 자동화 프로젝트입니다.',
    metric: '조회 60초 이상 → 10초 이내, 검증 1시간~1일 → 30분 이내',
    problem: '운영 담당자가 결제 내역을 느리게 조회하고 엑셀로 수기 대조해야 해서 정산 검증 시간이 길고 오류 가능성이 있었습니다.',
    approach: '정산 검증용 데이터를 별도로 적재하고, PG 결제 내역 파일과 내부 결제 내역을 1:1로 비교하는 흐름을 만들었습니다.',
    implementation: 'NestJS Scheduler로 검증 데이터를 생성하고 Vue3 관리자 화면에서 파일 업로드와 대조 결과 확인 흐름을 제공했습니다.',
    result: '결제 내역 조회 시간은 60초 이상에서 10초 이내로 줄었고, 정산 검증 업무는 1시간~1일에서 30분 이내로 단축됐습니다.',
  },
  {
    slug: 'settlement-platform',
    title: '정산 대행 플랫폼',
    company: '샵체인',
    period: '2025.08 - 2025.12',
    role: '풀스택 개발자',
    featured: true,
    categories: ['Settlement', 'Payment'],
    technologies: ['NestJS', 'Vue3', 'MySQL'],
    summary: '고객사별 정산 방식과 수수료 정책을 반영한 B2B 정산 대행 플랫폼입니다.',
    metric: '월 매출 약 5천만 원 규모 운영',
    problem: '고객사마다 정산 기준, 수수료율, 지급 기준이 달라 설정 변경 이후에도 과거 정산 기준을 안정적으로 보존해야 했습니다.',
    approach: '정산 생성 시점의 수수료율과 매장 설정을 스냅샷으로 저장하고, 검증은 집계 데이터를 활용하도록 구조를 나눴습니다.',
    implementation: '정산 도메인 모델과 MySQL 스키마를 설계하고, NestJS API와 Vue3 관리자 화면으로 운영 기능을 구현했습니다.',
    result: '설정 변경 이후에도 과거 정산 기준을 유지하며 월 매출 약 5천만 원 규모의 정산 대행 서비스를 운영할 수 있었습니다.',
  },
  {
    slug: 'payment-reliability',
    title: 'Toss·PayPal 결제 안정성 구조',
    company: '씨앤에이아이',
    period: '2026.04 - 2026.05',
    role: '백엔드 개발자',
    featured: true,
    categories: ['Payment'],
    technologies: ['NestJS', 'PostgreSQL', 'Redis'],
    summary: '단건 결제와 정기구독 결제에서 중복 승인과 내부 처리 실패를 제어한 결제 백엔드 구조입니다.',
    metric: 'Redis Lock, 멱등키, 실패 보상 처리',
    problem: 'PG 승인 요청이 중복되거나 승인 이후 내부 처리에 실패하면 결제 데이터 불일치가 생길 수 있었습니다.',
    approach: '단건 결제와 정기구독 결제 흐름을 분리하고, 주문 단위 멱등키와 Redis Lock으로 중복 처리를 제어했습니다.',
    implementation: 'PG 승인, 내부 주문 처리, 실패 보상 단계를 분리하고 내부 처리 실패 시 PG 취소 API를 호출하도록 구성했습니다.',
    result: '중복 결제와 결제 데이터 불일치 가능성을 줄이고 결제 실패 상황을 보상 처리할 수 있는 기반을 만들었습니다.',
  },
  {
    slug: 'dreampay',
    title: '비사업자 결제 서비스 드림페이',
    company: '샵체인',
    period: '2025.05 - 2025.07',
    role: '백엔드 개발자',
    featured: false,
    categories: ['Payment'],
    technologies: ['NestJS', 'MySQL', 'Popbill'],
    summary: '비사업자 대상 PG 결제, 결제 한도, 현금영수증 발급 흐름을 구축한 서비스입니다.',
    metric: '월 매출 약 2~4천만 원 규모 운영 기반',
  },
  {
    slug: 'naverpay-pos-kiosk',
    title: 'POS·KIOSK 네이버페이 결제 프로세스',
    company: '샵체인',
    period: '2025.01 - 2025.04',
    role: '풀스택 개발자',
    featured: false,
    categories: ['Payment', 'Android'],
    technologies: ['PHP', 'Java(Android)'],
    summary: '기존 결제 기능에 영향이 적도록 네이버페이 진입점과 반환점을 연결한 결제 수단 확장 프로젝트입니다.',
    metric: '기존 신용카드·현금 결제 영향 최소화',
  },
  {
    slug: 'delivery-pos-integration',
    title: '외부 배달앱 주문 POS 연동',
    company: '샵체인',
    period: '2024.03 - 2024.06',
    role: '풀스택 개발자',
    featured: false,
    categories: ['Android', 'Ops'],
    technologies: ['PHP', 'Java(Android)'],
    summary: '푸드테크 주문 중계 서비스와 POS 앱을 연동해 외부 배달 주문을 내부 주문·매출 구조로 통합했습니다.',
    metric: '테스트 매장 실제 주문 수신·처리 검증',
  },
  {
    slug: 'monitoring-logs',
    title: '모니터링 및 로그 조회 환경',
    company: '샵체인',
    period: '2024.10 - 2024.11',
    role: '인프라/운영 담당자',
    featured: false,
    categories: ['Ops'],
    technologies: ['Grafana', 'Prometheus', 'Loki', 'Promtail', 'node_exporter'],
    summary: '서버 메트릭과 로그를 한 곳에서 확인할 수 있도록 운영 관측 환경을 구축했습니다.',
    metric: '로그 탐색 20분 내외 → 5분 내외',
  },
  {
    slug: 'domain-knowledge-base',
    title: 'AI 기반 도메인 지식베이스',
    company: '샵체인',
    period: '2026.01 - 2026.02',
    role: 'AX 담당자',
    featured: false,
    categories: ['Documentation', 'Ops'],
    technologies: ['Codex', 'Obsidian', 'Markdown'],
    summary: '주문·결제·정산 도메인 지식과 개발 문서를 AI 개발 컨텍스트로 활용할 수 있게 구조화했습니다.',
    metric: '반복 질의 중심 업무를 문서 기반 확인 구조로 전환',
  },
];
```

- [ ] **Step 4: Create records data**

Create `data/records.js`:

```js
export const recordCategories = ['All', 'Work Logs', 'Learning Notes', 'Retrospectives'];

export const records = [
  {
    slug: 'pg-reconciliation-data-flow',
    title: '정산 검증 자동화를 만들며 줄인 것들',
    date: '2026-06-17',
    category: 'Work Logs',
    tags: ['Settlement', 'Batch', 'Operations'],
    summary: '수기 대조를 줄이기 위해 검증 데이터를 분리하고 PG 파일 대조 흐름을 만든 과정을 정리합니다.',
    relatedProject: 'pg-reconciliation',
  },
  {
    slug: 'redis-lock-idempotency-payment',
    title: 'Redis Lock과 멱등키를 결제에 적용하기',
    date: '2026-06-17',
    category: 'Learning Notes',
    tags: ['Payment', 'Redis', 'Idempotency'],
    summary: '중복 결제 요청을 제어할 때 Lock과 멱등키가 각각 맡는 역할을 정리합니다.',
    relatedProject: 'payment-reliability',
  },
  {
    slug: 'documentation-as-operating-system',
    title: '운영 문서를 지식베이스로 바꾸며 배운 것',
    date: '2026-06-17',
    category: 'Retrospectives',
    tags: ['Documentation', 'Knowledge Base', 'Operations'],
    summary: '반복 질의를 줄이기 위해 도메인 문서를 연결 가능한 지식베이스로 바꾼 경험을 회고합니다.',
    relatedProject: 'domain-knowledge-base',
  },
];
```

- [ ] **Step 5: Run tests to verify content passes and routes still fail**

Run: `npm test`

Expected: content tests PASS, route tests still FAIL until HTML files are added.

- [ ] **Step 6: Commit data model**

Run:

```bash
git add data/projects.js data/records.js tests/content.test.js
git commit -m "feat: add portfolio content data"
```

## Task 3: Shared Styling And Browser Helpers

**Files:**
- Create: `assets/styles.css`
- Create: `assets/main.js`

- [ ] **Step 1: Create global CSS**

Create `assets/styles.css`:

```css
:root {
  color-scheme: light;
  --bg: #fbfbf8;
  --panel: #ffffff;
  --ink: #151515;
  --muted: #666b73;
  --line: #deded8;
  --accent: #0b6bcb;
  --accent-soft: #e8f2ff;
  --green-soft: #edf7f0;
  --yellow-soft: #fff6db;
  --radius: 8px;
  --shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  line-height: 1.65;
}

a {
  color: inherit;
  text-decoration: none;
}

.site-shell {
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(251, 251, 248, 0.88);
  border-bottom: 1px solid var(--line);
  backdrop-filter: blur(16px);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 68px;
  gap: 24px;
}

.brand {
  font-weight: 800;
  letter-spacing: 0;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 18px;
  color: var(--muted);
  font-size: 0.95rem;
}

.nav-links a[aria-current="page"],
.nav-links a:hover {
  color: var(--ink);
}

.hero {
  padding: 92px 0 56px;
}

.eyebrow {
  margin: 0 0 14px;
  color: var(--accent);
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
}

.hero h1,
.page-title {
  max-width: 860px;
  margin: 0;
  font-size: clamp(2.4rem, 5vw, 4.8rem);
  line-height: 1.08;
  letter-spacing: 0;
}

.lead {
  max-width: 720px;
  margin: 22px 0 0;
  color: var(--muted);
  font-size: 1.15rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid var(--ink);
  border-radius: var(--radius);
  background: var(--ink);
  color: white;
  font-weight: 700;
}

.button.secondary {
  background: transparent;
  color: var(--ink);
}

.section {
  padding: 56px 0;
  border-top: 1px solid var(--line);
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.section-heading h2 {
  margin: 0;
  font-size: 1.6rem;
}

.grid {
  display: grid;
  gap: 18px;
}

.grid.three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.grid.two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.card {
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--panel);
  padding: 22px;
  box-shadow: var(--shadow);
}

.card.compact {
  box-shadow: none;
}

.card h3 {
  margin: 0 0 10px;
  font-size: 1.1rem;
}

.card p {
  margin: 0;
  color: var(--muted);
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.tag {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 10px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #fff;
  color: var(--muted);
  font-size: 0.84rem;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 24px 0;
}

.filter-button {
  min-height: 36px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #fff;
  color: var(--muted);
  padding: 0 12px;
  cursor: pointer;
}

.filter-button[aria-pressed="true"] {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--accent);
}

.case-study {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(240px, 1fr);
  gap: 28px;
}

.case-section {
  margin-top: 28px;
}

.case-section h2 {
  margin: 0 0 8px;
}

.site-footer {
  border-top: 1px solid var(--line);
  color: var(--muted);
  padding: 36px 0;
}

@media (max-width: 760px) {
  .site-shell {
    width: min(100% - 28px, 1120px);
  }

  .nav {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
    padding: 14px 0;
  }

  .nav-links {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .hero {
    padding: 60px 0 40px;
  }

  .grid.three,
  .grid.two,
  .case-study {
    grid-template-columns: 1fr;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
```

- [ ] **Step 2: Create shared JavaScript helpers**

Create `assets/main.js`:

```js
export function byId(id) {
  return document.getElementById(id);
}

export function createTag(label) {
  return `<span class="tag">${label}</span>`;
}

export function renderProjectCard(project, { detailed = false } = {}) {
  const href = project.featured ? `/projects/${project.slug}/` : '/projects/';
  const tags = [...project.categories, ...project.technologies.slice(0, 3)].map(createTag).join('');
  const metric = project.metric ? `<p><strong>${project.metric}</strong></p>` : '';

  return `
    <article class="card">
      <h3><a href="${href}">${project.title}</a></h3>
      <p>${project.summary}</p>
      ${detailed ? metric : ''}
      <div class="meta">${tags}</div>
    </article>
  `;
}

export function renderRecordCard(record) {
  const tags = record.tags.map(createTag).join('');

  return `
    <article class="card compact">
      <p class="eyebrow">${record.category} · ${record.date}</p>
      <h3>${record.title}</h3>
      <p>${record.summary}</p>
      <div class="meta">${tags}</div>
    </article>
  `;
}

export function setupFooterYear() {
  const target = byId('year');
  if (target) target.textContent = String(new Date().getFullYear());
}

setupFooterYear();
```

- [ ] **Step 3: Run tests**

Run: `npm test`

Expected: route tests still FAIL because HTML routes are not created yet; content tests remain PASS.

- [ ] **Step 4: Commit shared assets**

Run:

```bash
git add assets/styles.css assets/main.js
git commit -m "feat: add shared site assets"
```

## Task 4: Home Page

**Files:**
- Create: `index.html`
- Modify: `tests/routes.test.js`

- [ ] **Step 1: Extend route test for homepage anchors**

Add this test to `tests/routes.test.js`:

```js
it('home page exposes key content regions', () => {
  const html = readFileSync(join(root, 'index.html'), 'utf8');
  assert.match(html, /id="strengths"/);
  assert.match(html, /id="featured-projects"/);
  assert.match(html, /id="recent-records"/);
});
```

- [ ] **Step 2: Create home page**

Create `index.html`:

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>723poil | Backend Developer</title>
    <meta name="description" content="운영에서 반복되는 문제를 구조적으로 줄이는 백엔드 개발자 이상협의 포트폴리오입니다.">
    <link rel="stylesheet" href="/assets/styles.css">
  </head>
  <body>
    <header class="site-header">
      <div class="site-shell nav">
        <a class="brand" href="/">723poil</a>
        <nav class="nav-links" aria-label="Primary navigation">
          <a href="/" aria-current="page">Home</a>
          <a href="/projects/">Projects</a>
          <a href="/records/">Records</a>
          <a href="/about/">About</a>
        </nav>
      </div>
    </header>

    <main>
      <section class="site-shell hero">
        <p class="eyebrow">Backend Developer</p>
        <h1>운영에서 반복되는 문제를 구조적으로 줄이는 백엔드 개발자</h1>
        <p class="lead">결제·정산·배치 시스템 경험을 바탕으로 데이터 정합성과 운영 효율을 개선합니다.</p>
        <div class="actions">
          <a class="button" href="/projects/">프로젝트 보기</a>
          <a class="button secondary" href="/records/">기록 보기</a>
        </div>
      </section>

      <section class="site-shell section" id="strengths">
        <div class="section-heading">
          <h2>Focus</h2>
        </div>
        <div class="grid three">
          <article class="card compact">
            <h3>결제·정산 도메인</h3>
            <p>PG 결제, 정산 기준, 수수료 정책, 현금영수증, 구독 결제 흐름을 다룹니다.</p>
          </article>
          <article class="card compact">
            <h3>운영 효율 개선</h3>
            <p>수기 검증과 반복 질의를 줄이고 운영자가 빠르게 확인할 수 있는 구조를 만듭니다.</p>
          </article>
          <article class="card compact">
            <h3>데이터 정합성 및 안정성</h3>
            <p>스냅샷, 집계, 멱등키, 보상 처리로 금전 데이터의 불일치 가능성을 줄입니다.</p>
          </article>
        </div>
      </section>

      <section class="site-shell section" id="featured-projects">
        <div class="section-heading">
          <h2>Featured Projects</h2>
          <a href="/projects/">전체 프로젝트 보기</a>
        </div>
        <div class="grid three" id="featured-project-list"></div>
      </section>

      <section class="site-shell section" id="recent-records">
        <div class="section-heading">
          <h2>Recent Records</h2>
          <a href="/records/">전체 기록 보기</a>
        </div>
        <div class="grid three" id="recent-record-list"></div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="site-shell">© <span id="year"></span> 723poil</div>
    </footer>

    <script type="module">
      import { projects } from '/data/projects.js';
      import { records } from '/data/records.js';
      import { byId, renderProjectCard, renderRecordCard } from '/assets/main.js';

      byId('featured-project-list').innerHTML = projects
        .filter((project) => project.featured)
        .map((project) => renderProjectCard(project, { detailed: true }))
        .join('');

      byId('recent-record-list').innerHTML = records
        .slice(0, 3)
        .map(renderRecordCard)
        .join('');
    </script>
  </body>
</html>
```

- [ ] **Step 3: Run tests**

Run: `npm test`

Expected: home content tests PASS; route tests still FAIL for missing Projects, Records, About, and detail routes.

- [ ] **Step 4: Commit home page**

Run:

```bash
git add index.html tests/routes.test.js
git commit -m "feat: add portfolio home page"
```

## Task 5: Projects Catalog And Detail Pages

**Files:**
- Create: `assets/projects-page.js`
- Create: `assets/project-detail.js`
- Create: `projects/index.html`
- Create: `projects/pg-reconciliation/index.html`
- Create: `projects/settlement-platform/index.html`
- Create: `projects/payment-reliability/index.html`

- [ ] **Step 1: Create project catalog renderer**

Create `assets/projects-page.js`:

```js
import { projects, projectCategories } from '/data/projects.js';
import { byId, renderProjectCard } from '/assets/main.js';

const filters = byId('project-filters');
const list = byId('project-list');

let activeCategory = 'All';

function renderFilters() {
  filters.innerHTML = projectCategories
    .map((category) => `
      <button class="filter-button" type="button" aria-pressed="${category === activeCategory}" data-category="${category}">
        ${category}
      </button>
    `)
    .join('');
}

function renderProjects() {
  const visible = activeCategory === 'All'
    ? projects
    : projects.filter((project) => project.categories.includes(activeCategory));

  list.innerHTML = visible.map((project) => renderProjectCard(project, { detailed: true })).join('');
}

filters.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-category]');
  if (!button) return;
  activeCategory = button.dataset.category;
  renderFilters();
  renderProjects();
});

renderFilters();
renderProjects();
```

- [ ] **Step 2: Create project detail renderer**

Create `assets/project-detail.js`:

```js
import { projects } from '/data/projects.js';
import { records } from '/data/records.js';
import { byId, createTag, renderRecordCard } from '/assets/main.js';

const slug = document.body.dataset.projectSlug;
const project = projects.find((item) => item.slug === slug);

if (!project) {
  byId('project-detail').innerHTML = '<p class="lead">프로젝트를 찾을 수 없습니다.</p>';
} else {
  document.title = `${project.title} | 723poil`;
  const relatedRecords = records.filter((record) => record.relatedProject === project.slug);
  byId('project-detail').innerHTML = `
    <section class="hero">
      <p class="eyebrow">${project.company} · ${project.period}</p>
      <h1 class="page-title">${project.title}</h1>
      <p class="lead">${project.summary}</p>
      <div class="meta">
        ${project.categories.map(createTag).join('')}
        ${project.technologies.map(createTag).join('')}
      </div>
    </section>
    <section class="section case-study">
      <div>
        <div class="case-section">
          <h2>Problem</h2>
          <p>${project.problem}</p>
        </div>
        <div class="case-section">
          <h2>Approach</h2>
          <p>${project.approach}</p>
        </div>
        <div class="case-section">
          <h2>Implementation</h2>
          <p>${project.implementation}</p>
        </div>
        <div class="case-section">
          <h2>Result</h2>
          <p>${project.result}</p>
        </div>
      </div>
      <aside class="card compact">
        <h3>Role</h3>
        <p>${project.role}</p>
        <h3>Metric</h3>
        <p>${project.metric}</p>
      </aside>
    </section>
    <section class="section">
      <div class="section-heading">
        <h2>Related Records</h2>
        <a href="/records/">전체 기록 보기</a>
      </div>
      <div class="grid two">
        ${
          relatedRecords.length
            ? relatedRecords.map(renderRecordCard).join('')
            : '<article class="card compact"><p>아직 연결된 기록이 없습니다.</p></article>'
        }
      </div>
    </section>
  `;
}
```

- [ ] **Step 3: Create Projects page**

Create `projects/index.html`:

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Projects | 723poil</title>
    <meta name="description" content="결제, 정산, 운영 개선 프로젝트를 정리한 포트폴리오입니다.">
    <link rel="stylesheet" href="/assets/styles.css">
  </head>
  <body>
    <header class="site-header">
      <div class="site-shell nav">
        <a class="brand" href="/">723poil</a>
        <nav class="nav-links" aria-label="Primary navigation">
          <a href="/">Home</a>
          <a href="/projects/" aria-current="page">Projects</a>
          <a href="/records/">Records</a>
          <a href="/about/">About</a>
        </nav>
      </div>
    </header>
    <main class="site-shell">
      <section class="hero">
        <p class="eyebrow">Project Catalog</p>
        <h1 class="page-title">결과뿐 아니라 구조와 맥락을 함께 정리합니다.</h1>
        <p class="lead">대표 프로젝트는 사례 연구로 깊게 보고, 나머지 프로젝트는 전체 목록에서 도메인별로 훑어볼 수 있습니다.</p>
      </section>
      <section class="section">
        <div class="filters" id="project-filters" aria-label="Project filters"></div>
        <div class="grid two" id="project-list"></div>
      </section>
    </main>
    <footer class="site-footer">
      <div class="site-shell">© <span id="year"></span> 723poil</div>
    </footer>
    <script type="module" src="/assets/projects-page.js"></script>
  </body>
</html>
```

- [ ] **Step 4: Create project detail HTML routes**

Create `projects/pg-reconciliation/index.html` with this document:

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Project | 723poil</title>
    <meta name="description" content="프로젝트 사례 연구 상세 페이지입니다.">
    <link rel="stylesheet" href="/assets/styles.css">
  </head>
  <body data-project-slug="pg-reconciliation">
    <header class="site-header">
      <div class="site-shell nav">
        <a class="brand" href="/">723poil</a>
        <nav class="nav-links" aria-label="Primary navigation">
          <a href="/">Home</a>
          <a href="/projects/" aria-current="page">Projects</a>
          <a href="/records/">Records</a>
          <a href="/about/">About</a>
        </nav>
      </div>
    </header>
    <main class="site-shell" id="project-detail"></main>
    <footer class="site-footer">
      <div class="site-shell">© <span id="year"></span> 723poil</div>
    </footer>
    <script type="module" src="/assets/project-detail.js"></script>
  </body>
</html>
```

Create `projects/settlement-platform/index.html` with this document:

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Project | 723poil</title>
    <meta name="description" content="프로젝트 사례 연구 상세 페이지입니다.">
    <link rel="stylesheet" href="/assets/styles.css">
  </head>
  <body data-project-slug="settlement-platform">
    <header class="site-header">
      <div class="site-shell nav">
        <a class="brand" href="/">723poil</a>
        <nav class="nav-links" aria-label="Primary navigation">
          <a href="/">Home</a>
          <a href="/projects/" aria-current="page">Projects</a>
          <a href="/records/">Records</a>
          <a href="/about/">About</a>
        </nav>
      </div>
    </header>
    <main class="site-shell" id="project-detail"></main>
    <footer class="site-footer">
      <div class="site-shell">© <span id="year"></span> 723poil</div>
    </footer>
    <script type="module" src="/assets/project-detail.js"></script>
  </body>
</html>
```

Create `projects/payment-reliability/index.html` with this document:

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Project | 723poil</title>
    <meta name="description" content="프로젝트 사례 연구 상세 페이지입니다.">
    <link rel="stylesheet" href="/assets/styles.css">
  </head>
  <body data-project-slug="payment-reliability">
    <header class="site-header">
      <div class="site-shell nav">
        <a class="brand" href="/">723poil</a>
        <nav class="nav-links" aria-label="Primary navigation">
          <a href="/">Home</a>
          <a href="/projects/" aria-current="page">Projects</a>
          <a href="/records/">Records</a>
          <a href="/about/">About</a>
        </nav>
      </div>
    </header>
    <main class="site-shell" id="project-detail"></main>
    <footer class="site-footer">
      <div class="site-shell">© <span id="year"></span> 723poil</div>
    </footer>
    <script type="module" src="/assets/project-detail.js"></script>
  </body>
</html>
```

- [ ] **Step 5: Run tests**

Run: `npm test`

Expected: project routes PASS; routes for Records and About still FAIL.

- [ ] **Step 6: Commit project pages**

Run:

```bash
git add assets/projects-page.js assets/project-detail.js projects
git commit -m "feat: add projects catalog and case studies"
```

## Task 6: Records Page

**Files:**
- Create: `assets/records-page.js`
- Create: `records/index.html`

- [ ] **Step 1: Create records renderer**

Create `assets/records-page.js`:

```js
import { records, recordCategories } from '/data/records.js';
import { byId, renderRecordCard } from '/assets/main.js';

const filters = byId('record-filters');
const list = byId('record-list');

let activeCategory = 'All';

function renderFilters() {
  filters.innerHTML = recordCategories
    .map((category) => `
      <button class="filter-button" type="button" aria-pressed="${category === activeCategory}" data-category="${category}">
        ${category}
      </button>
    `)
    .join('');
}

function renderRecords() {
  const visible = activeCategory === 'All'
    ? records
    : records.filter((record) => record.category === activeCategory);

  list.innerHTML = visible.length
    ? visible.map(renderRecordCard).join('')
    : '<article class="card compact"><p>아직 이 분류의 기록이 없습니다.</p></article>';
}

filters.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-category]');
  if (!button) return;
  activeCategory = button.dataset.category;
  renderFilters();
  renderRecords();
});

renderFilters();
renderRecords();
```

- [ ] **Step 2: Create Records page**

Create `records/index.html`:

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Records | 723poil</title>
    <meta name="description" content="프로젝트 작업일지, 학습 기록, 회고를 정리하는 기록 공간입니다.">
    <link rel="stylesheet" href="/assets/styles.css">
  </head>
  <body>
    <header class="site-header">
      <div class="site-shell nav">
        <a class="brand" href="/">723poil</a>
        <nav class="nav-links" aria-label="Primary navigation">
          <a href="/">Home</a>
          <a href="/projects/">Projects</a>
          <a href="/records/" aria-current="page">Records</a>
          <a href="/about/">About</a>
        </nav>
      </div>
    </header>
    <main class="site-shell">
      <section class="hero">
        <p class="eyebrow">Records</p>
        <h1 class="page-title">작업과 학습의 과정을 따로 쌓습니다.</h1>
        <p class="lead">정제된 포트폴리오 밖에서 구현 과정, 기술 학습, 회고를 기록합니다.</p>
      </section>
      <section class="section">
        <div class="filters" id="record-filters" aria-label="Record filters"></div>
        <div class="grid two" id="record-list"></div>
      </section>
    </main>
    <footer class="site-footer">
      <div class="site-shell">© <span id="year"></span> 723poil</div>
    </footer>
    <script type="module" src="/assets/records-page.js"></script>
  </body>
</html>
```

- [ ] **Step 3: Run tests**

Run: `npm test`

Expected: Records route PASS; About route still FAIL.

- [ ] **Step 4: Commit Records page**

Run:

```bash
git add assets/records-page.js records/index.html
git commit -m "feat: add records archive"
```

## Task 7: About Page And Final Static Routes

**Files:**
- Create: `about/index.html`

- [ ] **Step 1: Create About page**

Create `about/index.html`:

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>About | 723poil</title>
    <meta name="description" content="백엔드 개발자 이상협의 경력, 기술, 자격 정보를 압축한 소개 페이지입니다.">
    <link rel="stylesheet" href="/assets/styles.css">
  </head>
  <body>
    <header class="site-header">
      <div class="site-shell nav">
        <a class="brand" href="/">723poil</a>
        <nav class="nav-links" aria-label="Primary navigation">
          <a href="/">Home</a>
          <a href="/projects/">Projects</a>
          <a href="/records/">Records</a>
          <a href="/about/" aria-current="page">About</a>
        </nav>
      </div>
    </header>
    <main class="site-shell">
      <section class="hero">
        <p class="eyebrow">About</p>
        <h1 class="page-title">결제·정산·운영 문제를 백엔드 구조로 풀어온 개발자입니다.</h1>
        <p class="lead">2년 6개월 이상 결제·정산 도메인을 중심으로 백엔드와 운영 시스템을 개발했습니다.</p>
      </section>
      <section class="section">
        <div class="grid two">
          <article class="card compact">
            <h3>Career</h3>
            <p>씨앤에이아이 백엔드 개발자 · 샵체인 풀스택 개발자</p>
          </article>
          <article class="card compact">
            <h3>Skills</h3>
            <p>NestJS, TypeScript, Vue3, MySQL, PostgreSQL, Redis, Docker, AWS, Grafana, Prometheus</p>
          </article>
          <article class="card compact">
            <h3>Education</h3>
            <p>경북대학교 컴퓨터학부 심화컴퓨터전공 졸업</p>
          </article>
          <article class="card compact">
            <h3>Certifications</h3>
            <p>정보처리기사, SQL 개발자, 데이터분석준전문가</p>
          </article>
        </div>
      </section>
      <section class="section">
        <h2>Contact</h2>
        <p class="lead">leetkdguq73@naver.com</p>
      </section>
    </main>
    <footer class="site-footer">
      <div class="site-shell">© <span id="year"></span> 723poil</div>
    </footer>
    <script type="module" src="/assets/main.js"></script>
  </body>
</html>
```

- [ ] **Step 2: Run full tests**

Run: `npm test`

Expected: PASS. All static routes exist, content data is valid, and home page regions are present.

- [ ] **Step 3: Commit About page**

Run:

```bash
git add about/index.html
git commit -m "feat: add about page"
```

## Task 8: Manual Preview And Visual QA

**Files:**
- Modify only if verification finds a specific issue.

- [ ] **Step 1: Start local static server**

Run: `npm run preview`

Expected: server starts on `http://localhost:4173`.

- [ ] **Step 2: Verify desktop routes**

Open these routes in the browser:

- `http://localhost:4173/`
- `http://localhost:4173/projects/`
- `http://localhost:4173/projects/pg-reconciliation/`
- `http://localhost:4173/records/`
- `http://localhost:4173/about/`

Expected: each route renders nonblank content, navigation works, and no text overlaps.

- [ ] **Step 3: Verify mobile layout**

Use a mobile viewport around 390px wide.

Expected:

- Navigation wraps without overlapping.
- Hero text stays readable.
- Cards stack into one column.
- Filter buttons wrap without horizontal page overflow.

- [ ] **Step 4: Verify filters**

On `/projects/`, click `Payment`, `Settlement`, `Ops`, `Android`, and `Documentation`.

Expected: each filter shows at least one project.

On `/records/`, click `Work Logs`, `Learning Notes`, and `Retrospectives`.

Expected: each filter shows one initial record.

- [ ] **Step 5: Run final tests**

Run: `npm test`

Expected: PASS.

- [ ] **Step 6: Commit visual QA fixes if needed**

If fixes were needed, run:

```bash
git add assets/styles.css index.html projects records about
git commit -m "fix: polish responsive portfolio layout"
```

If no fixes were needed, do not create an empty commit.

## Self-Review

Spec coverage:

- Home identity, strengths, featured projects, and Records preview are covered by Task 4.
- Full Projects catalog and 3 featured case study routes are covered by Task 5.
- Records categories are covered by Task 6.
- About page summary is covered by Task 7.
- Static route and content verification are covered by Tasks 1, 2, 7, and 8.
- Visual verification is covered by Task 8.

Blank-instruction scan:

- The plan contains no blank sections or unresolved fill-in instructions.
- Non-featured projects intentionally begin as summary cards, matching the design spec.

Type consistency:

- Project fields used by renderers match `data/projects.js`: `slug`, `title`, `company`, `period`, `role`, `featured`, `categories`, `technologies`, `summary`, `metric`, `problem`, `approach`, `implementation`, `result`.
- Record fields used by renderers match `data/records.js`: `slug`, `title`, `date`, `category`, `tags`, `summary`, `relatedProject`.
