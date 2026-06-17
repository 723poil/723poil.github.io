import { projects, projectCategories } from '../data/projects.js';
import { byId, renderProjectCard } from './main.js';

const filters = byId('project-filters');
const list = byId('project-list');

let activeCategory = 'All';

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

  list.innerHTML = visible.map((project) => renderProjectCard(project, { detailed: true })).join('');
}

filters.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-category]');
  if (!button) return;
  activeCategory = button.dataset.category;
  renderFilters(filters, projectCategories, activeCategory);
  renderProjects();
});

renderFilters(filters, projectCategories, activeCategory);
renderProjects();
