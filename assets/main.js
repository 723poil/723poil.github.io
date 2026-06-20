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

function slugifyHeading(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[`*_~]/g, '')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

function createHeadingId(title, usedIds) {
  const baseId = slugifyHeading(title) || 'section';
  const count = (usedIds.get(baseId) ?? 0) + 1;
  usedIds.set(baseId, count);
  return count === 1 ? baseId : `${baseId}-${count}`;
}

function renderInlineMarkdown(value) {
  const codeSpans = [];
  const withoutCode = String(value).replace(/`([^`]+)`/g, (_, code) => {
    const token = `@@CODE_SPAN_${codeSpans.length}@@`;
    codeSpans.push(`<code>${escapeHtml(code)}</code>`);
    return token;
  });

  const html = escapeHtml(withoutCode)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/@@CODE_SPAN_(\d+)@@/g, (_, index) => codeSpans[Number(index)] ?? '');

  return html;
}

function renderMarkdownList(lines, startIndex, ordered) {
  const itemPattern = ordered ? /^\d+\.\s+(.+)$/ : /^[-*]\s+(.+)$/;
  const tag = ordered ? 'ol' : 'ul';
  const items = [];
  let index = startIndex;

  while (index < lines.length) {
    const match = lines[index].match(itemPattern);
    if (!match) break;
    items.push(`<li>${renderInlineMarkdown(match[1])}</li>`);
    index += 1;
  }

  return {
    html: `<${tag}>${items.join('')}</${tag}>`,
    nextIndex: index,
  };
}

function renderMarkdownParagraph(lines, startIndex) {
  const paragraphLines = [];
  let index = startIndex;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) break;
    if (/^#{1,6}\s+/.test(line) || /^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) break;
    paragraphLines.push(line.trim());
    index += 1;
  }

  return {
    html: `<p>${renderInlineMarkdown(paragraphLines.join(' '))}</p>`,
    nextIndex: index,
  };
}

export function renderMarkdownDocument(markdown) {
  const lines = String(markdown).replace(/\r\n?/g, '\n').split('\n');
  const usedHeadingIds = new Map();
  const toc = [];
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const title = heading[2].trim();
      const id = createHeadingId(title, usedHeadingIds);

      if (level === 2) toc.push({ id, title });
      blocks.push(`<h${level} id="${escapeAttribute(id)}">${renderInlineMarkdown(title)}</h${level}>`);
      index += 1;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const list = renderMarkdownList(lines, index, false);
      blocks.push(list.html);
      index = list.nextIndex;
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const list = renderMarkdownList(lines, index, true);
      blocks.push(list.html);
      index = list.nextIndex;
      continue;
    }

    const paragraph = renderMarkdownParagraph(lines, index);
    blocks.push(paragraph.html);
    index = paragraph.nextIndex;
  }

  return {
    html: blocks.join('\n'),
    toc,
  };
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

export const majorProjectFilter = '주요 프로젝트';

export function partitionProjectCards(projects, activeProjectTypes = '', visibleCount = 2) {
  const selectedTypes = createProjectTypeSet(activeProjectTypes);

  if (selectedTypes.size === 0) {
    const featuredItems = projects.filter((project) => project.featured);
    const regularItems = projects.filter((project) => !project.featured);
    const orderedItems = [...featuredItems, ...regularItems];

    return {
      primaryItems: orderedItems.slice(0, visibleCount),
      secondaryItems: orderedItems.slice(visibleCount),
    };
  }

  const filteredItems = projects.filter((project) => (
    selectedTypes.has(project.type) || (selectedTypes.has(majorProjectFilter) && project.majorProject)
  ));

  return {
    primaryItems: filteredItems.slice(0, visibleCount),
    secondaryItems: filteredItems.slice(visibleCount),
  };
}

export function renderProjectCard(project, { detailed = false, detailLabel = '상세보기' } = {}) {
  const canOpenDetail = project.detailReady !== false && project.slug;
  const tags = renderTags((project.technologies ?? []).slice(0, 3));
  const summary = Array.isArray(project.summary)
    ? `<ul class="project-summary-list">${project.summary
      .filter(Boolean)
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join('')}</ul>`
    : `<p>${escapeHtml(project.summary ?? '')}</p>`;
  const type = project.type
    ? `<span class="project-kind" data-project-type="${escapeAttribute(project.type)}">${escapeHtml(project.type)}</span>`
    : '';
  const metaLine = [project.company, project.period].filter(Boolean).join(' · ');
  const eyebrow = metaLine ? `<p class="eyebrow">${escapeHtml(metaLine)}</p>` : '';
  const detailAction = canOpenDetail
    ? `<button class="button project-detail-button" type="button" data-project-detail="${escapeAttribute(project.slug)}">${escapeHtml(detailLabel)}</button>`
    : '<span class="button project-detail-button disabled" aria-disabled="true">상세 준비 중</span>';
  const majorProjectMark = project.majorProject
    ? '<span class="major-project-mark" aria-label="주요 프로젝트">★</span>'
    : '';

  return `
    <article class="card project-card">
      <div class="project-card-top">
        ${eyebrow}
        ${type}
      </div>
      <h3>${majorProjectMark}${escapeHtml(project.title)}</h3>
      ${summary}
      <div class="meta">${tags}</div>
      <div class="card-actions">${detailAction}</div>
    </article>
  `;
}

export function renderNavLinks(items) {
  return items
    .map((item) => `<a href="${escapeAttribute(item.href)}" data-section-link>${escapeHtml(item.label)}</a>`)
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
      <div class="project-modal-body project-modal-body-empty" data-project-modal-body>
        <nav class="modal-toc" aria-label="프로젝트 목차" data-project-detail-toc></nav>
        <article class="markdown-body" data-project-detail-body></article>
        <aside class="modal-skill-list" data-project-skill-list></aside>
      </div>
    </section>
  `;
}

export function renderProjectModalDetail(project, markdown, labels) {
  const rendered = renderMarkdownDocument(markdown);
  const tocLinks = rendered.toc.length
    ? rendered.toc
        .map((item) => `<a href="#${escapeAttribute(item.id)}">${escapeHtml(item.title)}</a>`)
        .join('')
    : `<span>${escapeHtml(labels.emptyDetail)}</span>`;
  const content = rendered.html || renderEmptyState(labels.emptyDetail);
  const projectLinks = (project.links ?? [])
    .filter((link) => link?.url && link?.label)
    .map((link) => `
      <a class="modal-link" href="${escapeAttribute(link.url)}" target="_blank" rel="noopener noreferrer">
        ${escapeHtml(link.label)}
      </a>
    `)
    .join('');

  return `
    <nav class="modal-toc" aria-label="프로젝트 목차" data-project-detail-toc>
      <strong>목차</strong>
      ${tocLinks}
    </nav>
    <article class="markdown-body" data-project-detail-body>
      ${content}
    </article>
    <aside class="modal-skill-list" data-project-skill-list>
      <div class="modal-fact">
        <h3>${escapeHtml(labels.role)}</h3>
        <p>${escapeHtml(project.role)}</p>
      </div>
      <div class="modal-fact">
        <h3>${escapeHtml(labels.skills)}</h3>
        <div class="meta">
          ${renderTags(project.technologies ?? [])}
        </div>
      </div>
      ${projectLinks ? `
        <div class="modal-fact">
          <h3>${escapeHtml(labels.links ?? '관련 링크')}</h3>
          <div class="modal-links">
            ${projectLinks}
          </div>
        </div>
      ` : ''}
    </aside>
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

export function setupFooterYear() {
  const target = byId('year');
  if (target) target.textContent = String(new Date().getFullYear());
}

setupFooterYear();
