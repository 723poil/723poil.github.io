import { getSkill } from '../data/skills.js?v=20260618-skill-cleanup';

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

function createProjectTypeSet(projectTypes) {
  if (!projectTypes) return new Set();
  if (projectTypes instanceof Set) return projectTypes;
  if (Array.isArray(projectTypes)) return new Set(projectTypes.filter(Boolean));
  return new Set([projectTypes].filter(Boolean));
}

export function toggleProjectTypeSelection(selectedTypes, type) {
  if (selectedTypes.has(type)) {
    selectedTypes.delete(type);
  } else {
    selectedTypes.add(type);
  }

  return selectedTypes;
}

export function partitionProjectCards(projects, activeProjectTypes = '', visibleCount = 3) {
  const selectedTypes = createProjectTypeSet(activeProjectTypes);

  if (selectedTypes.size === 0) {
    return {
      primaryItems: projects.filter((project) => project.featured),
      secondaryItems: projects.filter((project) => !project.featured),
    };
  }

  const filteredItems = projects.filter((project) => selectedTypes.has(project.type));

  return {
    primaryItems: filteredItems.slice(0, visibleCount),
    secondaryItems: filteredItems.slice(visibleCount),
  };
}

export function renderProjectCard(project, { detailed = false, actionMode = 'link', detailLabel = '상세보기' } = {}) {
  const canOpenDetail = project.detailReady !== false && project.slug;
  const href = canOpenDetail ? `/projects/${encodeURIComponent(project.slug)}/` : '';
  const tags = renderTags((project.technologies ?? []).slice(0, 3));
  const metric = project.metric ? `<p><strong>${escapeHtml(project.metric)}</strong></p>` : '';
  const type = project.type
    ? `<span class="project-kind" data-project-type="${escapeAttribute(project.type)}">${escapeHtml(project.type)}</span>`
    : '';
  const metaLine = [project.company, project.period].filter(Boolean).join(' · ');
  const eyebrow = metaLine ? `<p class="eyebrow">${escapeHtml(metaLine)}</p>` : '';
  const detailAction = actionMode === 'modal' && project.slug
    ? `<button class="button project-detail-button" type="button" data-project-detail="${escapeAttribute(project.slug)}">${escapeHtml(detailLabel)}</button>`
    : canOpenDetail
    ? `<a class="button project-detail-button" href="${href}">상세보기</a>`
    : '<span class="button project-detail-button disabled" aria-disabled="true">상세 준비 중</span>';
  const title = actionMode === 'modal' || !canOpenDetail
    ? escapeHtml(project.title)
    : `<a href="${href}">${escapeHtml(project.title)}</a>`;

  return `
    <article class="card project-card">
      <div class="project-card-top">
        ${eyebrow}
        ${type}
      </div>
      <h3>${title}</h3>
      <p>${escapeHtml(project.summary)}</p>
      ${detailed ? `<div class="metric">${metric}</div>` : ''}
      <div class="meta">${tags}</div>
      <div class="card-actions">${detailAction}</div>
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

export function renderEmptyState(message) {
  return `
    <article class="empty-state">
      <p>${escapeHtml(message)}</p>
    </article>
  `;
}

function renderCaseStudySections(project, labels) {
  const detailSections = [
    { title: labels.problem, body: project.problem },
    { title: labels.approach, body: project.approach },
    { title: labels.implementation, body: project.implementation },
    { title: labels.result, body: project.result },
  ].filter((section) => section.body);

  return detailSections.length
    ? detailSections.map((section) => `
        <div class="case-section">
          <h2>${escapeHtml(section.title)}</h2>
          <p>${escapeHtml(section.body)}</p>
        </div>
      `).join('')
    : renderEmptyState(labels.emptyDetail);
}

export function renderProjectModal(project, labels) {
  const closeButtonLabel = labels.closeButtonLabel ?? '닫기';

  return `
    <div class="project-modal-backdrop" data-modal-close></div>
    <section class="project-modal-panel" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
      <button class="modal-close" type="button" data-modal-close aria-label="${escapeAttribute(closeButtonLabel)}">×</button>
      <header class="project-modal-header">
        <p class="eyebrow">${escapeHtml(project.company)} · ${escapeHtml(project.period)}</p>
        <h2 id="project-modal-title">${escapeHtml(project.title)}</h2>
      </header>
      <div class="project-modal-body project-modal-body-empty">
        <div class="modal-case" data-project-detail-body></div>
        <aside class="modal-skill-list" data-project-skill-list></aside>
      </div>
    </section>
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
          ${renderTags([...(project.categories ?? []), ...(project.technologies ?? [])])}
        </div>
      </div>
    </section>
    <section class="section section-white">
      <div class="case-study site-shell">
        <div>
          ${renderCaseStudySections(project, labels)}
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

export function renderCareerTimeline(items, labels = {}) {
  return items.map((item, index) => renderCareerItem(item, labels, index)).join('');
}

const CAREER_PROJECT_VISIBLE_COUNT = 4;

function getCareerSkillGroups(item) {
  const groups = item.skillGroups?.length
    ? item.skillGroups
    : [{ title: 'Skills', skills: item.skills ?? [] }];

  return groups.filter((group) => group.skills?.length);
}

function renderCareerSkillGroups(groups) {
  return groups
    .map(
      (group) => `
        <div class="career-skill-row">
          <h4>${escapeHtml(group.title)}</h4>
          <div class="meta">${renderTags(group.skills)}</div>
        </div>
      `,
    )
    .join('');
}

function renderCareerSkillToggle(groups, labels, index) {
  if (groups.length <= 1) return '';

  const expandLabel = labels.skillMoreLabel ?? '더보기';
  const collapseLabel = labels.skillLessLabel ?? '접기';

  return `
    <button
      class="career-skill-toggle"
      type="button"
      data-career-skill-toggle
      data-expand-label="${escapeAttribute(expandLabel)}"
      data-collapse-label="${escapeAttribute(collapseLabel)}"
      aria-expanded="false"
      aria-controls="career-skill-card-${index}"
    >${escapeHtml(expandLabel)}</button>
  `;
}

function renderCareerProjectToggle(projects, labels, index) {
  if (projects.length <= CAREER_PROJECT_VISIBLE_COUNT) return '';

  const expandLabel = labels.projectMoreLabel ?? '더보기';
  const collapseLabel = labels.projectLessLabel ?? '접기';

  return `
    <button
      class="career-project-toggle"
      type="button"
      data-career-project-toggle
      data-expand-label="${escapeAttribute(expandLabel)}"
      data-collapse-label="${escapeAttribute(collapseLabel)}"
      aria-expanded="false"
      aria-controls="career-projects-${index}"
    >${escapeHtml(expandLabel)}</button>
  `;
}

function renderCareerItem(item, labels, index) {
  const skillGroups = getCareerSkillGroups(item);
  const collapsedClass = skillGroups.length > 1 ? ' is-collapsed' : '';
  const projectCollapsedClass = item.projects.length > CAREER_PROJECT_VISIBLE_COUNT ? ' is-collapsed' : '';

  return `
    <article class="career-card">
      <div class="company-icon"><img src="${escapeAttribute(item.logo.src)}" alt="${escapeAttribute(item.logo.alt)}"></div>
      <div class="career-card-body">
        <header class="company-header">
          <h3>${escapeHtml(item.company)}</h3>
          <p class="career-period">${escapeHtml(item.period)} · ${escapeHtml(item.role)}</p>
          <p class="company-summary">${escapeHtml(item.summary)}</p>
          <section class="career-skill-card${collapsedClass}" id="career-skill-card-${index}">${renderCareerSkillGroups(skillGroups)}</section>
          ${renderCareerSkillToggle(skillGroups, labels, index)}
        </header>
        <div class="career-projects${projectCollapsedClass}" id="career-projects-${index}">
          ${item.projects.map(renderCareerProject).join('')}
        </div>
        ${renderCareerProjectToggle(item.projects, labels, index)}
      </div>
    </article>
  `;
}

function renderCareerProject(project) {
  return `
    <section class="career-project-row">
      <div class="career-project-copy">
        <strong>${escapeHtml(project.title)}</strong>
        <span class="project-period">${escapeHtml(project.period)}</span>
        <p>${escapeHtml(project.summary)}</p>
      </div>
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
