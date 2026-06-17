import { projects } from '/data/projects.js';
import { records } from '/data/records.js';
import { byId, createTag, renderRecordCard } from '/assets/main.js';

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

const slug = document.body.dataset.projectSlug;
const project = projects.find((item) => item.slug === slug);

if (!project) {
  byId('project-detail').innerHTML = '<p class="lead">프로젝트를 찾을 수 없습니다.</p>';
} else {
  document.title = `${project.title} | 723poil`;
  const relatedRecords = records.filter((record) => record.relatedProject === project.slug);
  byId('project-detail').innerHTML = `
    <section class="hero">
      <p class="eyebrow">${escapeHtml(project.company)} · ${escapeHtml(project.period)}</p>
      <h1 class="page-title">${escapeHtml(project.title)}</h1>
      <p class="lead">${escapeHtml(project.summary)}</p>
      <div class="meta">
        ${project.categories.map(createTag).join('')}
        ${project.technologies.map(createTag).join('')}
      </div>
    </section>
    <section class="section case-study">
      <div>
        <div class="case-section">
          <h2>풀고 싶었던 문제</h2>
          <p>${escapeHtml(project.problem)}</p>
        </div>
        <div class="case-section">
          <h2>접근 방식</h2>
          <p>${escapeHtml(project.approach)}</p>
        </div>
        <div class="case-section">
          <h2>구현한 것</h2>
          <p>${escapeHtml(project.implementation)}</p>
        </div>
        <div class="case-section">
          <h2>달라진 점</h2>
          <p>${escapeHtml(project.result)}</p>
        </div>
      </div>
      <aside class="card compact">
        <h3>맡은 역할</h3>
        <p>${escapeHtml(project.role)}</p>
        <h3>눈에 보인 변화</h3>
        <p>${escapeHtml(project.metric)}</p>
      </aside>
    </section>
    <section class="section">
      <div class="section-heading">
        <h2>이어지는 기록</h2>
        <a href="/records/">전체 기록 보기</a>
      </div>
      <div class="grid two">
        ${
          relatedRecords.length
            ? relatedRecords.map(renderRecordCard).join('')
            : '<article class="card compact"><p>아직 연결된 기록이 없습니다.</p></article>'
        }
      </div>
    </section>
  `;
}
