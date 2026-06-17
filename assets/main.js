export function byId(id) {
  if (typeof document === 'undefined') return null;
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

export function createTag(label) {
  return `<span class="tag">${escapeHtml(label)}</span>`;
}

export function renderProjectCard(project, { detailed = false } = {}) {
  const href = project.featured ? `/projects/${encodeURIComponent(project.slug)}/` : '/projects/';
  const tags = [...project.categories, ...project.technologies.slice(0, 3)].map(createTag).join('');
  const metric = project.metric ? `<p><strong>${escapeHtml(project.metric)}</strong></p>` : '';

  return `
    <article class="card">
      <h3><a href="${href}">${escapeHtml(project.title)}</a></h3>
      <p>${escapeHtml(project.summary)}</p>
      ${detailed ? metric : ''}
      <div class="meta">${tags}</div>
    </article>
  `;
}

export function renderRecordCard(record) {
  const tags = record.tags.map(createTag).join('');

  return `
    <article class="card compact">
      <p class="eyebrow">${escapeHtml(record.category)} · ${escapeHtml(record.date)}</p>
      <h3>${escapeHtml(record.title)}</h3>
      <p>${escapeHtml(record.summary)}</p>
      <div class="meta">${tags}</div>
    </article>
  `;
}

export function setupFooterYear() {
  const target = byId('year');
  if (target) target.textContent = String(new Date().getFullYear());
}

setupFooterYear();
