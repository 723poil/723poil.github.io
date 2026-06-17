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

    assert.equal(createTag('<script>A&B "quoted"</script>'), '<span class="tag">&lt;script&gt;A&amp;B &quot;quoted&quot;&lt;/script&gt;</span>');
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
});
