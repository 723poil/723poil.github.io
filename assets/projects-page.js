import { profile } from '../data/profile.js';
import { projects, projectCategories } from '../data/projects.js';
import { pageContent, secondaryNav } from '../data/site.js';
import { applyPageMeta, byId, renderProjectCard, renderProjectModal, renderSimpleHero, renderSiteChrome } from './main.js';

const filters = byId('project-filters');
const list = byId('project-list');
const projectModal = byId('project-modal');

let activeCategory = 'All';
const modalLabels = {
  ...pageContent.projectDetail.sections,
  closeButtonLabel: pageContent.projectDetail.closeButtonLabel,
};

applyPageMeta(pageContent.projects);
renderSiteChrome({ profile, navItems: secondaryNav, currentHref: '/projects/' });
byId('page-hero').innerHTML = renderSimpleHero(pageContent.projects.hero);

export function renderFilters(container, categories, selectedCategory) {
  const buttons = categories.map((category) => {
    const button = document.createElement('button');
    button.className = 'filter-button';
    button.type = 'button';
    button.setAttribute('aria-pressed', String(category === selectedCategory));
    button.dataset.category = category;
    button.textContent = category;
    return button;
  });

  container.replaceChildren(...buttons);
}

function renderProjects() {
  const visible = activeCategory === 'All'
    ? projects
    : projects.filter((project) => project.categories.includes(activeCategory));

  list.innerHTML = visible.map((project) => renderProjectCard(project, {
    detailed: true,
    actionMode: 'modal',
    detailLabel: pageContent.projectDetail.detailButtonLabel,
  })).join('');
}

function closeProjectModal() {
  projectModal.hidden = true;
  projectModal.innerHTML = '';
  document.body.classList.remove('modal-open');
}

function openProjectModal(slug) {
  const project = projects.find((item) => item.slug === slug);
  if (!project) return;
  projectModal.innerHTML = renderProjectModal(project, modalLabels);
  projectModal.hidden = false;
  document.body.classList.add('modal-open');
  projectModal.querySelector('[data-modal-close]')?.focus();
}

filters.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-category]');
  if (!button) return;
  activeCategory = button.dataset.category;
  renderFilters(filters, projectCategories, activeCategory);
  renderProjects();
});

list.addEventListener('click', (event) => {
  const button = event.target.closest('[data-project-detail]');
  if (!button) return;
  openProjectModal(button.dataset.projectDetail);
});

document.addEventListener('click', (event) => {
  if (event.target.closest('[data-modal-close]')) closeProjectModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !projectModal.hidden) closeProjectModal();
});

renderFilters(filters, projectCategories, activeCategory);
renderProjects();
