import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('shared browser helpers', () => {
  it('can be imported and setup in Node without document', async () => {
    const { createTag, renderEmptyState, renderProjectCard, renderProjectModal, renderRecordCard, setupFooterYear } = await import('../assets/main.js');

    assert.equal(typeof createTag, 'function');
    assert.equal(typeof renderEmptyState, 'function');
    assert.equal(typeof renderProjectCard, 'function');
    assert.equal(typeof renderProjectModal, 'function');
    assert.equal(typeof renderRecordCard, 'function');
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

  it('escapes project card text and encodes featured slugs', async () => {
    const { renderProjectCard } = await import('../assets/main.js');
    const html = renderProjectCard(
      {
        featured: true,
        slug: 'case study/a&b',
        title: 'A&B "<script>"',
        summary: 'Summary <script> "quoted"',
        metric: 'Metric A&B "wins"',
        company: 'Company <script>',
        period: '2026.01',
        type: '회사 <프로젝트>',
        categories: ['Ops <script>'],
        technologies: ['Node "JS"', 'A&B', '<CSS>'],
      },
      { detailed: true },
    );

    assert.match(html, /href="\/projects\/case%20study%2Fa%26b\/"/);
    assert.match(html, /A&amp;B &quot;&lt;script&gt;&quot;/);
    assert.match(html, /Summary &lt;script&gt; &quot;quoted&quot;/);
    assert.match(html, /Metric A&amp;B &quot;wins&quot;/);
    assert.match(html, /Company &lt;script&gt; · 2026.01/);
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
      { actionMode: 'modal', detailLabel: 'Open detail' },
    );

    assert.match(html, /<button class="button project-detail-button"/);
    assert.match(html, /data-project-detail="modal-detail"/);
    assert.match(html, /Open detail/);
    assert.doesNotMatch(html, /href="\/projects\/modal-detail\/"/);
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

  it('escapes record card text', async () => {
    const { renderRecordCard } = await import('../assets/main.js');
    const html = renderRecordCard({
      category: 'Work & Logs',
      date: '2026 "Q2"',
      title: 'Record <script>',
      summary: 'A&B summary',
      tags: ['Tag "one"', '<two>'],
    });

    assert.match(html, /Work &amp; Logs · 2026 &quot;Q2&quot;/);
    assert.match(html, /Record &lt;script&gt;/);
    assert.match(html, /A&amp;B summary/);
    assert.match(html, /Tag &quot;one&quot;/);
    assert.match(html, /&lt;two&gt;/);
    assert.doesNotMatch(html, /<script>/);
  });

  it('renders project detail pages with the portfolio section design', async () => {
    const { renderProjectDetailPage } = await import('../assets/main.js');
    const html = renderProjectDetailPage(
      {
        company: 'A&B <Company>',
        period: '2026 "Q2"',
        title: 'Project <Title>',
        summary: 'Summary & intro',
        categories: ['Payment'],
        technologies: ['NestJS'],
        problem: 'Problem text',
        approach: 'Approach text',
        implementation: 'Implementation text',
        result: 'Result text',
        role: 'Backend',
        metric: 'Fast',
      },
      [],
      {
        problem: 'Problem',
        approach: 'Approach',
        implementation: 'Implementation',
        result: 'Result',
        role: 'Role',
        metric: 'Metric',
        records: 'Records',
        allRecords: 'All records',
        emptyRecords: 'No records',
      },
    );

    assert.match(html, /class="hero project-detail-hero"/);
    assert.match(html, /class="hero-copy"/);
    assert.match(html, /class="section section-white"/);
    assert.match(html, /class="case-study site-shell"/);
    assert.match(html, /class="section section-gray"/);
    assert.match(html, /Project &lt;Title&gt;/);
    assert.match(html, /A&amp;B &lt;Company&gt;/);
    assert.doesNotMatch(html, /<Company>/);
  });

  it('renders an empty state for project detail pages without case study content', async () => {
    const { renderProjectDetailPage } = await import('../assets/main.js');
    const html = renderProjectDetailPage(
      {
        company: 'Company',
        period: '2026.01',
        title: 'Project',
        summary: 'Summary',
        categories: [],
        technologies: [],
        role: 'Backend',
        metric: 'Metric',
      },
      [],
      {
        problem: 'Problem',
        approach: 'Approach',
        implementation: 'Implementation',
        result: 'Result',
        emptyDetail: 'Detail is empty',
        role: 'Role',
        metric: 'Metric',
        records: 'Records',
        allRecords: 'All records',
        emptyRecords: 'No records',
      },
    );

    assert.match(html, /Detail is empty/);
    assert.doesNotMatch(html, /undefined/);
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
    assert.match(html, /data-project-detail-body/);
    assert.match(html, /data-project-skill-list/);
    assert.doesNotMatch(html, /Summary/);
    assert.doesNotMatch(html, /NestJS/);
    assert.doesNotMatch(html, /Detail is empty/);
    assert.doesNotMatch(html, /Role/);
    assert.doesNotMatch(html, /Metric/);
    assert.doesNotMatch(html, /<Modal>/);
  });

  it('renders career skills in one card and projects as compact timeline rows', async () => {
    const { renderCareerTimeline } = await import('../assets/main.js');
    const html = renderCareerTimeline([
      {
        company: 'Company',
        period: '2026.01 - 현재',
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
            period: '2026.01',
            summary: 'One line summary',
            points: ['Hidden detail point'],
          },
        ],
      },
    ]);

    assert.match(html, /class="career-skill-card"/);
    assert.match(html, /class="career-skill-row"/);
    assert.match(html, /class="career-project-row"/);
    assert.match(html, /class="career-project-copy"/);
    assert.match(html, /<strong>Project one<\/strong>/);
    assert.match(html, /One line summary/);
    assert.doesNotMatch(html, /career-skill-section/);
    assert.doesNotMatch(html, /career-project"/);
    assert.doesNotMatch(html, /Hidden detail point/);
  });
});
