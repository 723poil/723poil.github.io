import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('shared browser helpers', () => {
  it('can be imported and setup in Node without document', async () => {
    const { createTag, partitionProjectCards, renderEmptyState, renderProjectCard, renderProjectModal, setupFooterYear, toggleProjectTypeSelection } = await import('../assets/main.js');

    assert.equal(typeof createTag, 'function');
    assert.equal(typeof renderEmptyState, 'function');
    assert.equal(typeof renderProjectCard, 'function');
    assert.equal(typeof renderProjectModal, 'function');
    assert.equal(typeof partitionProjectCards, 'function');
    assert.equal(typeof toggleProjectTypeSelection, 'function');
    assert.doesNotThrow(() => setupFooterYear());
  });

  it('escapes tag text', async () => {
    const { createTag } = await import('../assets/main.js');

    assert.equal(
      createTag('<script>A&B "quoted"</script>'),
      '<span class="tag" style="--tag-color: #2f74c0">&lt;script&gt;A&amp;B &quot;quoted&quot;&lt;/script&gt;</span>',
    );
  });

  it('renders registered skill colors from the central registry', async () => {
    const { createTag } = await import('../assets/main.js');

    assert.equal(createTag('NestJS'), '<span class="tag" style="--tag-color: #e0234e">NestJS</span>');
  });

  it('escapes project card text and renders modal actions', async () => {
    const { renderProjectCard } = await import('../assets/main.js');
    const html = renderProjectCard(
      {
        featured: true,
        slug: 'case study/a&b',
        title: 'A&B "<script>"',
        summary: ['Summary <script> "quoted"', 'Second A&B'],
        metric: 'Metric A&B "wins"',
        company: 'Company <script>',
        period: '2026.01',
        type: '회사 <프로젝트>',
        categories: ['Ops <script>'],
        technologies: ['Node "JS"', 'A&B', '<CSS>'],
      },
      { detailed: true },
    );

    assert.match(html, /<button class="button project-detail-button"/);
    assert.match(html, /data-project-detail="case study\/a&amp;b"/);
    assert.match(html, /A&amp;B &quot;&lt;script&gt;&quot;/);
    assert.match(html, /Summary &lt;script&gt; &quot;quoted&quot;/);
    assert.match(html, /Second A&amp;B/);
    assert.match(html, /class="project-summary-list"/);
    assert.doesNotMatch(html, /Metric A&amp;B &quot;wins&quot;/);
    assert.match(html, /Company &lt;script&gt; · 2026.01/);
    assert.match(html, /data-project-type="회사 &lt;프로젝트&gt;"/);
    assert.match(html, /회사 &lt;프로젝트&gt;/);
    assert.doesNotMatch(html, /Ops &lt;script&gt;/);
    assert.match(html, /Node &quot;JS&quot;/);
    assert.match(html, /&lt;CSS&gt;/);
    assert.match(html, /상세보기/);
    assert.doesNotMatch(html, /<script>/);
  });

  it('renders modal project card actions without navigation links', async () => {
    const { renderProjectCard } = await import('../assets/main.js');
    const html = renderProjectCard(
      {
        slug: 'modal-detail',
        title: 'Modal detail',
        summary: 'Summary',
        categories: [],
        technologies: [],
      },
      { detailLabel: 'Open detail' },
    );

    assert.match(html, /<button class="button project-detail-button"/);
    assert.match(html, /data-project-detail="modal-detail"/);
    assert.match(html, /Open detail/);
    assert.doesNotMatch(html, /href="\/projects\/modal-detail\/"/);
  });

  it('renders a star marker only for major project cards', async () => {
    const { renderProjectCard } = await import('../assets/main.js');
    const majorHtml = renderProjectCard({
      majorProject: true,
      slug: 'major-project',
      title: 'Major project',
      summary: 'Summary',
      categories: [],
      technologies: [],
    });
    const regularHtml = renderProjectCard({
      slug: 'regular-project',
      title: 'Regular project',
      summary: 'Summary',
      categories: [],
      technologies: [],
    });

    assert.match(majorHtml, /class="major-project-mark"/);
    assert.match(majorHtml, /aria-label="주요 프로젝트"/);
    assert.match(majorHtml, />★</);
    assert.doesNotMatch(regularHtml, /major-project-mark/);
  });

  it('renders disabled project detail actions when detail content is not ready', async () => {
    const { renderProjectCard } = await import('../assets/main.js');
    const html = renderProjectCard({
      detailReady: false,
      slug: 'future-detail',
      title: 'Future detail',
      summary: 'Summary',
      categories: [],
      technologies: [],
    });

    assert.match(html, /상세 준비 중/);
    assert.match(html, /aria-disabled="true"/);
    assert.doesNotMatch(html, /href="\/projects\/future-detail\/"/);
    assert.doesNotMatch(html, /undefined/);
  });

  it('renders escaped empty states', async () => {
    const { renderEmptyState } = await import('../assets/main.js');
    const html = renderEmptyState('Empty <archive>');

    assert.match(html, /class="empty-state"/);
    assert.match(html, /Empty &lt;archive&gt;/);
    assert.doesNotMatch(html, /<archive>/);
  });

  it('renders markdown content and extracts only level two headings for the table of contents', async () => {
    const { renderMarkdownDocument } = await import('../assets/main.js');
    const result = renderMarkdownDocument(`
# Case Study

Intro with **bold text** and \`inline code\`.

## 문제 정의

- First item
- Second <unsafe> item

### 세부 구현

Nested heading stays in content only.

## 결과

Closing paragraph.
`);

    assert.deepEqual(result.toc, [
      { id: '문제-정의', title: '문제 정의' },
      { id: '결과', title: '결과' },
    ]);
    assert.match(result.html, /<h1 id="case-study">Case Study<\/h1>/);
    assert.match(result.html, /<h2 id="문제-정의">문제 정의<\/h2>/);
    assert.match(result.html, /<h3 id="세부-구현">세부 구현<\/h3>/);
    assert.match(result.html, /<strong>bold text<\/strong>/);
    assert.match(result.html, /<code>inline code<\/code>/);
    assert.match(result.html, /Second &lt;unsafe&gt; item/);
    assert.doesNotMatch(result.html, /<unsafe>/);
  });

  it('deduplicates repeated markdown heading ids', async () => {
    const { renderMarkdownDocument } = await import('../assets/main.js');
    const result = renderMarkdownDocument(`
## 결과
First result.

## 결과
Second result.
`);

    assert.deepEqual(result.toc, [
      { id: '결과', title: '결과' },
      { id: '결과-2', title: '결과' },
    ]);
    assert.match(result.html, /<h2 id="결과">결과<\/h2>/);
    assert.match(result.html, /<h2 id="결과-2">결과<\/h2>/);
  });

  it('keeps project modal body and skill area empty for manual editing', async () => {
    const { renderProjectModal } = await import('../assets/main.js');
    const html = renderProjectModal(
      {
        company: 'Company <One>',
        period: '2026.01',
        title: 'Project <Modal>',
        summary: 'Summary',
        categories: ['Payment'],
        technologies: ['NestJS'],
        role: 'Backend',
        metric: 'Metric',
      },
      {
        problem: 'Problem',
        approach: 'Approach',
        implementation: 'Implementation',
        result: 'Result',
        emptyDetail: 'Detail is empty',
        closeButtonLabel: 'Close',
        role: 'Role',
        metric: 'Metric',
      },
    );

    assert.match(html, /role="dialog"/);
    assert.match(html, /aria-modal="true"/);
    assert.match(html, /aria-label="Close"/);
    assert.match(html, /Project &lt;Modal&gt;/);
    assert.match(html, /Company &lt;One&gt;/);
    assert.match(html, /data-project-detail-toc/);
    assert.match(html, /data-project-detail-body/);
    assert.match(html, /data-project-skill-list/);
    assert.doesNotMatch(html, /Summary/);
    assert.doesNotMatch(html, /NestJS/);
    assert.doesNotMatch(html, /Detail is empty/);
    assert.doesNotMatch(html, /Role/);
    assert.doesNotMatch(html, /Metric/);
    assert.doesNotMatch(html, /<Modal>/);
  });

  it('renders markdown-backed project modal detail content with a level two table of contents', async () => {
    const { renderProjectModalDetail } = await import('../assets/main.js');
    const html = renderProjectModalDetail(
      {
        categories: ['Payment'],
        technologies: ['NestJS'],
        role: 'Backend <Dev>',
        metric: '10초 이내',
        links: [{ label: 'Repo <Link>', url: 'https://example.com?a=1&b=2' }],
      },
      `
## 문제
수기 대조가 오래 걸렸습니다.

### 제외되는 제목
목차에는 들어가지 않습니다.

## 결과
검증 시간이 줄었습니다.
`,
      {
        role: '담당',
        skills: '스킬',
        links: '관련 링크',
        emptyDetail: '상세 내용 없음',
      },
    );

    assert.match(html, /class="modal-toc"/);
    assert.match(html, /href="#문제"/);
    assert.match(html, /href="#결과"/);
    assert.doesNotMatch(html, /제외되는 제목<\/a>/);
    assert.match(html, /class="markdown-body"/);
    assert.match(html, /<h2 id="문제">문제<\/h2>/);
    assert.match(html, /Backend &lt;Dev&gt;/);
    assert.match(html, /스킬/);
    assert.match(html, /NestJS/);
    assert.match(html, /관련 링크/);
    assert.match(html, /Repo &lt;Link&gt;/);
    assert.match(html, /href="https:\/\/example\.com\?a=1&amp;b=2"/);
    assert.match(html, /rel="noopener noreferrer"/);
    assert.doesNotMatch(html, /Payment/);
    assert.doesNotMatch(html, /10초 이내/);
    assert.doesNotMatch(html, /<Dev>/);
  });

  it('shows the first two featured-first home projects before a type filter is selected', async () => {
    const { partitionProjectCards } = await import('../assets/main.js');
    const result = partitionProjectCards([
      { title: 'Company featured', type: '회사 프로젝트', featured: true },
      { title: 'Team featured', type: '팀 프로젝트', featured: true },
      { title: 'Ops featured', type: '회사 프로젝트', featured: true },
      { title: 'Team project', type: '팀 프로젝트', featured: false },
      { title: 'Company archive', type: '회사 프로젝트', featured: false },
    ]);

    assert.deepEqual(result.primaryItems.map((project) => project.title), ['Company featured', 'Team featured']);
    assert.deepEqual(result.secondaryItems.map((project) => project.title), ['Ops featured', 'Team project', 'Company archive']);
  });

  it('shows the first two filtered projects above the more button regardless of featured state', async () => {
    const { partitionProjectCards } = await import('../assets/main.js');
    const result = partitionProjectCards(
      [
        { title: 'Company featured', type: '회사 프로젝트', featured: true },
        { title: 'Company one', type: '회사 프로젝트', featured: false },
        { title: 'Company two', type: '회사 프로젝트', featured: false },
        { title: 'Team project', type: '팀 프로젝트', featured: false },
        { title: 'Company three', type: '회사 프로젝트', featured: false },
      ],
      '회사 프로젝트',
    );

    assert.deepEqual(result.primaryItems.map((project) => project.title), ['Company featured', 'Company one']);
    assert.deepEqual(result.secondaryItems.map((project) => project.title), ['Company two', 'Company three']);
  });

  it('combines multiple selected project type filters before splitting the first two cards', async () => {
    const { partitionProjectCards } = await import('../assets/main.js');
    const result = partitionProjectCards(
      [
        { title: 'Company featured', type: '회사 프로젝트', featured: true },
        { title: 'Company one', type: '회사 프로젝트', featured: false },
        { title: 'Team project', type: '팀 프로젝트', featured: false },
        { title: 'Company two', type: '회사 프로젝트', featured: false },
      ],
      new Set(['회사 프로젝트', '팀 프로젝트']),
    );

    assert.deepEqual(result.primaryItems.map((project) => project.title), ['Company featured', 'Company one']);
    assert.deepEqual(result.secondaryItems.map((project) => project.title), ['Team project', 'Company two']);
  });

  it('filters home projects to explicitly marked major project items', async () => {
    const { partitionProjectCards } = await import('../assets/main.js');
    const result = partitionProjectCards(
      [
        { title: 'Company featured', type: '회사 프로젝트', featured: true, majorProject: false },
        { title: 'Company one', type: '회사 프로젝트', featured: false },
        { title: 'Team major', type: '팀 프로젝트', featured: false, majorProject: true },
        { title: 'Team project', type: '팀 프로젝트', featured: false },
      ],
      '주요 프로젝트',
    );

    assert.deepEqual(result.primaryItems.map((project) => project.title), ['Team major']);
    assert.deepEqual(result.secondaryItems.map((project) => project.title), []);
  });

  it('toggles project type selection off when clicking the same filter again', async () => {
    const { toggleProjectTypeSelection } = await import('../assets/main.js');
    const selectedTypes = new Set(['회사 프로젝트']);

    toggleProjectTypeSelection(selectedTypes, '회사 프로젝트');
    assert.deepEqual([...selectedTypes], []);

    toggleProjectTypeSelection(selectedTypes, '팀 프로젝트');
    assert.deepEqual([...selectedTypes], ['팀 프로젝트']);
  });

  it('renders career skills in one card and projects as compact timeline rows', async () => {
    const { renderCareerTimeline } = await import('../assets/main.js');
    const html = renderCareerTimeline(
      [
        {
          company: 'Company',
          period: '2026.01 - 재직중',
          role: 'Backend',
          summary: 'Company summary',
          logo: { src: '/logo.png', alt: 'logo' },
          skillGroups: [
            { title: 'Frameworks & Language', skills: ['NestJS', 'TypeScript'] },
            { title: 'Database', skills: ['MySQL'] },
          ],
          projects: [
            {
              title: 'Project one',
              period: '2024년 하반기 - 2025년 상반기',
              summary: 'One line summary',
              points: ['Hidden detail point'],
            },
            {
              title: 'Project two',
              period: '2025년 하반기',
              summary: 'Two line summary',
            },
            {
              title: 'Project three',
              period: '2025년 상반기',
              summary: 'Three line summary',
            },
            {
              title: 'Project four',
              period: '2024년 하반기',
              summary: 'Four line summary',
            },
            {
              title: 'Project five',
              period: '2024년 상반기',
              summary: 'Five line summary',
            },
          ],
        },
      ],
      {
        skillMoreLabel: 'More skills',
        skillLessLabel: 'Less skills',
        projectMoreLabel: 'More work',
        projectLessLabel: 'Less work',
      },
    );

    assert.match(html, /class="career-skill-card is-collapsed"/);
    assert.match(html, /class="career-skill-row"/);
    assert.match(html, /data-career-skill-toggle/);
    assert.match(html, /aria-expanded="false"/);
    assert.match(html, /More skills/);
    assert.match(html, /Less skills/);
    assert.match(html, /class="career-projects is-collapsed"/);
    assert.match(html, /class="career-project-row"/);
    assert.match(html, /2024년 하반기 - 2025년 상반기/);
    assert.match(html, /class="career-project-copy"/);
    assert.match(html, /<strong>Project one<\/strong>/);
    assert.match(html, /One line summary/);
    assert.match(html, /<strong>Project five<\/strong>/);
    assert.match(html, /data-career-project-toggle/);
    assert.match(html, /More work/);
    assert.match(html, /Less work/);
    assert.doesNotMatch(html, /career-skill-section/);
    assert.doesNotMatch(html, /career-project"/);
    assert.doesNotMatch(html, /Hidden detail point/);
  });
});
