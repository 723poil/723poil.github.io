import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

const isFile = (path) => existsSync(path) && statSync(path).isFile();

const requiredRoutes = [
  'index.html',
];

const removedRoutes = [
  'projects/index.html',
  'projects/pg-reconciliation/index.html',
  'projects/settlement-platform/index.html',
  'projects/payment-reliability/index.html',
  'projects/recycling-guide-app/index.html',
  'records/index.html',
  'about/index.html',
];

describe('static routes', () => {
  for (const route of requiredRoutes) {
    it(`${route} exists`, () => {
      assert.ok(isFile(join(root, route)), `${route} should exist`);
    });
  }

  for (const route of removedRoutes) {
    it(`${route} is not kept as a secondary page`, () => {
      assert.equal(existsSync(join(root, route)), false, `${route} should not exist`);
    });
  }

  it('home page loads shared stylesheet and module script', () => {
    const homePath = join(root, 'index.html');
    assert.ok(isFile(homePath), 'index.html should exist');

    const html = readFileSync(homePath, 'utf8');
    assert.match(html, /<link\b(?=[^>]*\brel=["']stylesheet["'])(?=[^>]*\bhref=["']assets\/styles\.css(?:\?[^"']*)?["'])[^>]*>/);
    assert.match(html, /<script\b[^>]*\btype=["']module["']/);
  });

  it('home page exposes key content regions', () => {
    const html = readFileSync(join(root, 'index.html'), 'utf8');
    assert.match(html, /id="about-snapshot"/);
    assert.match(html, /id="core-skills"/);
    assert.match(html, /id="featured-projects"/);
    assert.match(html, /id="experience"/);
    assert.doesNotMatch(html, /id="project-archive-preview"/);
    assert.doesNotMatch(html, /id="recent-records"/);
  });

  it('home page uses one-page portfolio navigation instead of separate page links', () => {
    const html = readFileSync(join(root, 'index.html'), 'utf8');

    assert.match(html, /id="site-nav"/);
    assert.match(html, /data-section-link/);
    assert.doesNotMatch(html, /<a href="\/projects\/"/);
    assert.doesNotMatch(html, /<a href="\/records\/"/);
    assert.doesNotMatch(html, /<a href="\/about\/"/);
    assert.doesNotMatch(html, /<h2 class="section-title">RECORDS<\/h2>/);
    assert.doesNotMatch(html, /records\.js/);
    assert.match(html, /IntersectionObserver/);
  });

  it('home page imports display data instead of hardcoding portfolio copy', () => {
    const html = readFileSync(join(root, 'index.html'), 'utf8');

    assert.match(html, /\/data\/profile\.js/);
    assert.match(html, /\/data\/home\.js/);
    assert.match(html, /\/data\/career\.js/);
    assert.doesNotMatch(html, /이상협/);
    assert.doesNotMatch(html, /leetkdguq73@naver\.com/);
    assert.doesNotMatch(html, /경북대학교/);
    assert.doesNotMatch(html, /씨앤에이아이/);
    assert.doesNotMatch(html, /샵체인/);
    assert.doesNotMatch(html, /NestJS/);
    assert.doesNotMatch(html, /PROJECTS/);
  });

  it('home page exposes render mount points for data-driven content', () => {
    const html = readFileSync(join(root, 'index.html'), 'utf8');

    assert.match(html, /id="brand-link"/);
    assert.match(html, /id="hero-content"/);
    assert.match(html, /id="about-title"/);
    assert.match(html, /id="about-list"/);
    assert.match(html, /id="skills-title"/);
    assert.match(html, /id="skill-list"/);
    assert.match(html, /id="projects-title"/);
    assert.match(html, /id="project-type-filters"/);
    assert.match(html, /class="grid two project-grid site-shell" id="featured-project-list"/);
    assert.match(html, /id="additional-projects"/);
    assert.match(html, /class="grid two project-grid" id="additional-project-list"/);
    assert.match(html, /id="project-more-button"/);
    assert.doesNotMatch(html, /id="archive-title"/);
    assert.doesNotMatch(html, /id="archive-project-list"/);
    assert.match(html, /id="career-title"/);
    assert.match(html, /id="career-list"/);
    assert.match(html, /id="project-modal"/);
  });

  it('starts the home project filter on major projects', () => {
    const html = readFileSync(join(root, 'index.html'), 'utf8');

    assert.match(html, /const activeProjectTypes = new Set\(\[majorProjectFilter\]\);/);
  });

  it('project modal keeps scrolling inside the markdown body only', () => {
    const css = readFileSync(join(root, 'assets/styles.css'), 'utf8');

    assert.match(css, /\[hidden\]\s*\{[^}]*display:\s*none\s*!important;/s);
    assert.match(css, /\.project-modal-panel\s*\{[^}]*display:\s*grid;[^}]*overflow:\s*hidden;/s);
    assert.match(css, /\.project-modal-body\s*\{[^}]*align-items:\s*start;[^}]*min-height:\s*0;[^}]*overflow:\s*hidden;/s);
    assert.match(css, /\.markdown-body\s*\{[^}]*max-height:\s*100%;[^}]*overflow-y:\s*auto;/s);
  });

  it('busts cache when loading project detail markdown', () => {
    const html = readFileSync(join(root, 'index.html'), 'utf8');

    assert.match(html, /const cacheKey = Date\.now\(\)\.toString\(\);/);
    assert.match(html, /project-details\/\$\{encodeURIComponent\(slug\)\}\.md\?v=\$\{cacheKey\}/);
  });

  it('home page uses company logo images in the career timeline', () => {
    const html = readFileSync(join(root, 'index.html'), 'utf8');

    assert.ok(isFile(join(root, 'assets/logos/shopchain.png')));
    assert.ok(isFile(join(root, 'assets/logos/cnai.png')));
    assert.doesNotMatch(html, /<div class="company-icon" aria-hidden="true">(CA|SC)<\/div>/);
  });

  it('home page does not import secondary page scripts', () => {
    const html = readFileSync(join(root, 'index.html'), 'utf8');

    assert.doesNotMatch(html, /about-page\.js/);
    assert.doesNotMatch(html, /projects-page\.js/);
    assert.doesNotMatch(html, /records-page\.js/);
    assert.doesNotMatch(html, /project-detail\.js/);
  });
});
