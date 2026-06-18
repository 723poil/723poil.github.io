import { projects } from '/data/projects.js';
import { records } from '/data/records.js';
import { profile } from '/data/profile.js';
import { pageContent, secondaryNav } from '/data/site.js';
import { applyPageMeta, byId, escapeHtml, renderProjectDetailPage, renderSiteChrome } from '/assets/main.js';

const slug = document.body.dataset.projectSlug;
const project = projects.find((item) => item.slug === slug);
const labels = pageContent.projectDetail.sections;

applyPageMeta(pageContent.projectDetail);
renderSiteChrome({ profile, navItems: secondaryNav, currentHref: '/projects/' });

if (!project) {
  byId('project-detail').innerHTML = `<p class="lead">${escapeHtml(pageContent.projectDetail.fallback)}</p>`;
} else {
  document.title = `${project.title} | ${profile.brand}`;
  const relatedRecords = records.filter((record) => record.relatedProject === project.slug);
  byId('project-detail').innerHTML = renderProjectDetailPage(project, relatedRecords, labels);
}
