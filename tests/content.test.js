import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { projectCategories, projects } from '../data/projects.js';
import { recordCategories, records } from '../data/records.js';

describe('project content', () => {
  it('starts with expected project categories', () => {
    assert.deepEqual(projectCategories, ['All', 'Payment', 'Settlement', 'Ops', 'Android', 'Documentation']);
  });

  it('contains all resume-derived projects', () => {
    assert.equal(projects.length, 8);
  });

  it('has the expected featured projects', () => {
    const featuredSlugs = projects
      .filter((project) => project.featured)
      .map((project) => project.slug)
      .sort();

    assert.deepEqual(featuredSlugs, ['payment-reliability', 'pg-reconciliation', 'settlement-platform']);
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
  it('starts with expected record categories', () => {
    assert.deepEqual(recordCategories, ['All', 'Work Logs', 'Learning Notes', 'Retrospectives']);
  });

  it('contains one record for each non-All category', () => {
    const countsByCategory = records.reduce((counts, record) => {
      counts[record.category] = (counts[record.category] ?? 0) + 1;
      return counts;
    }, {});

    assert.equal(records.length, 3);
    assert.deepEqual(countsByCategory, {
      'Learning Notes': 1,
      Retrospectives: 1,
      'Work Logs': 1,
    });
  });

  it('uses stable unique slugs', () => {
    const slugs = records.map((record) => record.slug);
    assert.equal(new Set(slugs).size, slugs.length);
  });

  it('links at least one record to a featured project', () => {
    assert.ok(records.some((record) => record.relatedProject === 'pg-reconciliation'));
  });
});
