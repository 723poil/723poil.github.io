# Portfolio Site Design

## Context

This repository is the GitHub Pages site for 723poil. The site should work as a personal portfolio first, while also leaving room for ongoing records about work, learning, and retrospectives.

The current repository is almost empty, with only a README. The design can therefore define the initial information architecture without adapting to an existing frontend structure.

The resume provided during planning should be treated as source material, not copied directly. The site should extract the strongest identity, representative projects, and reusable content patterns from it.

## Direction

The site will use a case-study portfolio structure.

The home page should introduce the person clearly, show a small set of representative projects, and provide paths into the full project list and records. It should not show the navigation structure as a grid of page boxes.

Core identity:

> 운영에서 반복되는 문제를 구조적으로 줄이는 백엔드 개발자

Supporting description:

> 결제·정산·배치 시스템 경험을 바탕으로 데이터 정합성과 운영 효율을 개선합니다.

Primary strength areas:

- 결제·정산 도메인
- 운영 효율 개선
- 데이터 정합성 및 안정성

## Navigation

Top-level navigation:

- Home
- Projects
- Records
- About

The navigation should stay compact. The page body should lead with portfolio content rather than explaining the site map.

## Home Page

The home page is the main portfolio entry.

Recommended flow:

1. Hero identity
2. Short supporting description
3. Three strength areas
4. Featured projects, limited to 2-3 items
5. Small preview of recent Records entries
6. Contact or About entry point

The page should feel selective and editorial. It should not try to include every resume item.

Initial featured project candidates:

- PG 결제 내역 자동 대조
- 정산 대행 플랫폼
- Toss·PayPal 결제 안정성 구조

## Projects Page

The Projects page should show the full project set, including projects that are not featured on the home page.

Initial project list from the resume:

- Toss·PayPal 단건·정기구독 결제 시스템
- 월 매출 약 5천만 원 규모 정산 대행 플랫폼
- 정산 검증 자동화 및 PG사 결제 내역 대조 기능
- 비사업자 결제 서비스 드림페이
- POS·KIOSK 네이버페이 결제 프로세스
- 외부 배달앱 주문 매출 통합 POS 연동
- Grafana·Prometheus·Loki 모니터링 및 로그 조회 환경
- AI 기반 도메인 지식베이스

Suggested filters:

- All
- Payment
- Settlement
- Ops
- Android
- Documentation

Featured projects should link to richer detail pages. Non-featured projects can begin as concise summary cards and later expand into full case studies.

## Project Detail

Representative project detail pages should use a consistent case-study structure:

1. Summary: project goal, role, period, technologies
2. Problem: operational or technical problem being solved
3. Approach: design choices and why they were chosen
4. Implementation: key backend, data, batch, or integration structure
5. Result: measurable outcomes where available
6. Related Records: optional links to work logs or learning notes

The resume already contains strong result-oriented material, such as:

- 결제 내역 조회 시간 60초 이상에서 10초 이내로 단축
- 정산 검증 업무 1시간~1일에서 30분 이내로 단축
- 로그 탐색 시간 평균 20분 내외에서 5분 내외로 단축
- 월 매출 약 5천만 원 규모 정산 대행 플랫폼 운영
- 월 매출 약 2~4천만 원 규모 비사업자 결제 서비스 운영 기반 구축

These should be rewritten into site copy rather than pasted verbatim.

## Records Page

Records is a separate menu, not mixed directly into the portfolio home. It should act as a record archive for work and learning.

Initial categories:

- Work Logs: project work notes and implementation process
- Learning Notes: technical and domain learning
- Retrospectives: reflections on work, operations, and process

Records should start simple. Tags and search can be added later when enough content exists.

The home page can show a quiet preview of recent Records entries, but Records should remain its own space.

## About Page

The About page should summarize the resume without duplicating it.

Recommended sections:

- Short profile
- Career timeline
- Skills
- Certifications
- Education
- Contact

Detailed project explanations should live in Projects, not About.

## Content Model

The site can begin with static content files or structured local data. A later implementation plan should choose the concrete framework and data format.

Recommended content entities:

- Project
  - title
  - summary
  - role
  - period
  - company
  - categories
  - technologies
  - featured
  - problem
  - approach
  - implementation
  - result
  - relatedRecords
- Record
  - title
  - date
  - category
  - tags
  - summary
  - body
  - relatedProject

## Error And Empty States

The first version can avoid complex runtime error handling if the site is statically generated. Still, the design should account for:

- Empty Records state before enough writing exists
- Project cards without full detail pages yet
- Missing related Records on project detail pages
- Unknown filter states on Projects and Records

Fallback copy should be quiet and direct.

## Testing And Verification

The implementation should verify:

- The GitHub Pages build succeeds
- Home renders correctly on mobile and desktop
- Navigation paths work
- Project filters do not hide all content unexpectedly
- Featured projects link to valid pages
- Records categories render with empty and populated states
- Text does not overflow cards, buttons, or narrow mobile containers

Visual verification should include screenshots for desktop and mobile before considering the site ready.

## Open Decisions For Implementation

- Frontend stack and routing approach
- Exact visual style
- Whether project and record content will be Markdown, JSON, or framework-native content collections
- Which 2-3 projects become the initial featured set
- Which Records entries should exist at launch
