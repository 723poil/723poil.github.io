import { getSkill } from '../data/skills.js';

export function byId(id) {
  if (typeof document === 'undefined') return null;
  return document.getElementById(id);
}

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function renderLineBreakText(lines) {
  return lines.map(escapeHtml).join('<br>');
}

export function createTag(label) {
  const skill = getSkill(label);
  return `<span class="tag" style="--tag-color: ${escapeAttribute(skill.color)}">${escapeHtml(skill.label)}</span>`;
}

export function renderTags(labels) {
  return labels.map(createTag).join('');
}

export function renderProjectCard(project, { detailed = false } = {}) {
  const href = project.featured ? `/projects/${encodeURIComponent(project.slug)}/` : '/projects/';
  const tags = renderTags([...project.categories, ...project.technologies.slice(0, 3)]);
  const metric = project.metric ? `<p><strong>${escapeHtml(project.metric)}</strong></p>` : '';

  return `
    <article class="card project-card">
      <div class="project-card-top">
        <p class="eyebrow">${escapeHtml(project.company)} · ${escapeHtml(project.period)}</p>
      </div>
      <h3><a href="${href}">${escapeHtml(project.title)}</a></h3>
      <p>${escapeHtml(project.summary)}</p>
      ${detailed ? `<div class="metric">${metric}</div>` : ''}
      <div class="meta">${tags}</div>
    </article>
  `;
}

export function renderRecordCard(record) {
  const tags = renderTags(record.tags);

  return `
    <article class="card compact">
      <p class="eyebrow">${escapeHtml(record.category)} · ${escapeHtml(record.date)}</p>
      <h3>${escapeHtml(record.title)}</h3>
      <p>${escapeHtml(record.summary)}</p>
      <div class="meta">${tags}</div>
    </article>
  `;
}

export function renderNavLinks(items) {
  return items
    .map((item) => `<a href="${escapeAttribute(item.href)}" data-section-link>${escapeHtml(item.label)}</a>`)
    .join('');
}

export function renderPageNav(items, currentHref) {
  return items
    .map((item) => {
      const current = item.href === currentHref ? ' aria-current="page"' : '';
      return `<a href="${escapeAttribute(item.href)}"${current}>${escapeHtml(item.label)}</a>`;
    })
    .join('');
}

export function renderHero(hero) {
  const action = hero.action
    ? `
      <div class="actions">
        <a class="button" href="${escapeAttribute(hero.action.href)}">${escapeHtml(hero.action.label)}</a>
      </div>
    `
    : '';

  return `
    <h1>${renderLineBreakText(hero.titleLines)}</h1>
    <p>${renderLineBreakText(hero.bodyLines)}</p>
    ${action}
  `;
}

export function renderSimpleHero(hero) {
  return `<h1 class="page-title">${escapeHtml(hero.title)}</h1>`;
}

export function renderProfileCards(cards) {
  return cards
    .map((card) => {
      const value = card.href
        ? `<a href="${escapeAttribute(card.href)}">${escapeHtml(card.value)}</a>`
        : escapeHtml(card.value);

      return `
        <article class="card compact">
          <h3>${escapeHtml(card.label)}</h3>
          <p>${value}</p>
        </article>
      `;
    })
    .join('');
}

export function renderSkillGroups(groups) {
  return groups
    .map((group) => `
      <article class="skill-row">
        <h3>${escapeHtml(group.title)}</h3>
        <div class="meta">${renderTags(group.skills)}</div>
      </article>
    `)
    .join('');
}

export function renderArchiveProject(project) {
  return `
    <article class="archive-item">
      <span>${escapeHtml(project.period)}</span>
      <strong>${escapeHtml(project.title)}</strong>
      <em>${escapeHtml(project.metric)}</em>
    </article>
  `;
}

export function renderProjectDetailPage(project, relatedRecords, labels) {
  return `
    <section class="hero project-detail-hero">
      <div class="hero-copy">
        <p class="eyebrow">${escapeHtml(project.company)} · ${escapeHtml(project.period)}</p>
        <h1 class="page-title">${escapeHtml(project.title)}</h1>
        <p class="lead">${escapeHtml(project.summary)}</p>
        <div class="meta">
          ${renderTags([...project.categories, ...project.technologies])}
        </div>
      </div>
    </section>
    <section class="section section-white">
      <div class="case-study site-shell">
        <div>
          <div class="case-section">
            <h2>${escapeHtml(labels.problem)}</h2>
            <p>${escapeHtml(project.problem)}</p>
          </div>
          <div class="case-section">
            <h2>${escapeHtml(labels.approach)}</h2>
            <p>${escapeHtml(project.approach)}</p>
          </div>
          <div class="case-section">
            <h2>${escapeHtml(labels.implementation)}</h2>
            <p>${escapeHtml(project.implementation)}</p>
          </div>
          <div class="case-section">
            <h2>${escapeHtml(labels.result)}</h2>
            <p>${escapeHtml(project.result)}</p>
          </div>
        </div>
        <aside class="card compact">
          <h3>${escapeHtml(labels.role)}</h3>
          <p>${escapeHtml(project.role)}</p>
          <h3>${escapeHtml(labels.metric)}</h3>
          <p>${escapeHtml(project.metric)}</p>
        </aside>
      </div>
    </section>
    <section class="section section-gray">
      <div class="section-heading site-shell">
        <h2>${escapeHtml(labels.records)}</h2>
        <a class="text-link" href="/records/">${escapeHtml(labels.allRecords)}</a>
      </div>
      <div class="grid two site-shell">
        ${
          relatedRecords.length
            ? relatedRecords.map(renderRecordCard).join('')
            : `<article class="card compact"><p>${escapeHtml(labels.emptyRecords)}</p></article>`
        }
      </div>
    </section>
  `;
}

export function renderCareerTimeline(items) {
  return items.map(renderCareerItem).join('');
}

function renderCareerSkillGroups(item) {
  const groups = item.skillGroups?.length
    ? item.skillGroups
    : [{ title: 'Skills', skills: item.skills ?? [] }];

  return groups
    .filter((group) => group.skills?.length)
    .map(
      (group) => `
        <section class="career-skill-section">
          <h4>${escapeHtml(group.title)}</h4>
          <div class="meta">${renderTags(group.skills)}</div>
        </section>
      `,
    )
    .join('');
}

function renderCareerItem(item) {
  return `
    <article class="career-card">
      <div class="company-icon"><img src="${escapeAttribute(item.logo.src)}" alt="${escapeAttribute(item.logo.alt)}"></div>
      <div class="career-card-body">
        <header class="company-header">
          <h3>${escapeHtml(item.company)}</h3>
          <p class="career-period">${escapeHtml(item.period)} · ${escapeHtml(item.role)}</p>
          <p class="company-summary">${escapeHtml(item.summary)}</p>
          <div class="career-skills">${renderCareerSkillGroups(item)}</div>
        </header>
        <div class="career-projects">
          ${item.projects.map(renderCareerProject).join('')}
        </div>
      </div>
    </article>
  `;
}

function renderCareerProject(project) {
  const points = project.points?.length
    ? `
      <ul class="career-points">
        ${project.points.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}
      </ul>
    `
    : '';

  return `
    <section class="career-project">
      <h4>${escapeHtml(project.title)}</h4>
      <p class="project-period">${escapeHtml(project.period)}</p>
      <p>${escapeHtml(project.summary)}</p>
      ${points}
    </section>
  `;
}

export function applyDocumentMeta(profile) {
  if (typeof document === 'undefined') return;

  document.title = profile.siteTitle;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute('content', profile.description);
}

export function applyPageMeta(page) {
  if (typeof document === 'undefined') return;

  document.title = page.title;
  if (typeof document.querySelector !== 'function') return;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute('content', page.description);
}

export function renderSiteChrome({ profile, navItems, currentHref }) {
  const brand = byId('brand-link');
  const footerBrand = byId('footer-brand');
  const nav = byId('site-nav');

  if (brand) brand.textContent = profile.brand;
  if (footerBrand) footerBrand.textContent = profile.brand;
  if (nav) nav.innerHTML = renderPageNav(navItems, currentHref);
}

export function renderAboutPage(aboutPage) {
  const heroTarget = byId('about-hero');
  const sectionsTarget = byId('about-sections');
  const contactTitle = byId('about-contact-title');
  const contactLink = byId('about-contact-link');

  if (heroTarget) heroTarget.innerHTML = `<h1 class="page-title">${escapeHtml(aboutPage.hero.title)}</h1>`;
  if (sectionsTarget) {
    sectionsTarget.innerHTML = aboutPage.sections
      .map((section) => `
        <section class="section">
          <div class="section-heading">
            <h2>${escapeHtml(section.title)}</h2>
          </div>
          <div class="grid two">
            ${section.cards.map(renderAboutCard).join('')}
          </div>
        </section>
      `)
      .join('');
  }
  if (contactTitle) contactTitle.textContent = aboutPage.contact.title;
  if (contactLink) {
    contactLink.href = `mailto:${aboutPage.contact.email}`;
    contactLink.textContent = aboutPage.contact.email;
  }
}

function renderAboutCard(card) {
  const body = card.skills?.length
    ? `<div class="meta">${renderTags(card.skills)}</div>`
    : `<p>${escapeHtml(card.body)}</p>`;

  return `
    <article class="card compact">
      <h3>${escapeHtml(card.title)}</h3>
      ${body}
    </article>
  `;
}

export function setupFooterYear() {
  const target = byId('year');
  if (target) target.textContent = String(new Date().getFullYear());
}

setupFooterYear();
