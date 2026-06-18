import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('shared browser helpers', () => {
  it('can be imported and setup in Node without document', async () => {
    const { createTag, renderProjectCard, renderRecordCard, setupFooterYear } = await import('../assets/main.js');

    assert.equal(typeof createTag, 'function');
    assert.equal(typeof renderProjectCard, 'function');
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
        categories: ['Ops <script>'],
        technologies: ['Node "JS"', 'A&B', '<CSS>'],
      },
      { detailed: true },
    );

    assert.match(html, /href="\/projects\/case%20study%2Fa%26b\/"/);
    assert.match(html, /A&amp;B &quot;&lt;script&gt;&quot;/);
    assert.match(html, /Summary &lt;script&gt; &quot;quoted&quot;/);
    assert.match(html, /Metric A&amp;B &quot;wins&quot;/);
    assert.match(html, /Ops &lt;script&gt;/);
    assert.match(html, /Node &quot;JS&quot;/);
    assert.match(html, /&lt;CSS&gt;/);
    assert.doesNotMatch(html, /<script>/);
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
});
