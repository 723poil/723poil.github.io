import { records, recordCategories } from '../data/records.js';
import { byId, renderRecordCard } from './main.js';

const filters = byId('record-filters');
const list = byId('record-list');

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

function renderRecords() {
  const visible = activeCategory === 'All'
    ? records
    : records.filter((record) => record.category === activeCategory);

  list.innerHTML = visible.length
    ? visible.map(renderRecordCard).join('')
    : '<article class="card compact"><p>아직 이 분류의 기록이 없습니다.</p></article>';
}

filters.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-category]');
  if (!button) return;
  activeCategory = button.dataset.category;
  renderFilters(filters, recordCategories, activeCategory);
  renderRecords();
});

renderFilters(filters, recordCategories, activeCategory);
renderRecords();
