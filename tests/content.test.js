import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { projectCategories, projects } from '../data/projects.js';
import { recordCategories, records } from '../data/records.js';
import { careerItems } from '../data/career.js';
import { homeContent } from '../data/home.js';
import { profile, profileCards } from '../data/profile.js';
import { pageContent, secondaryNav } from '../data/site.js';
import { getSkill, portfolioSkillNames, skillRegistry } from '../data/skills.js';

describe('project content', () => {
  it('starts with expected project categories', () => {
    assert.deepEqual(projectCategories, ['All', 'Payment', 'Settlement', 'Ops', 'Android', 'Documentation']);
  });

  it('contains all resume-derived projects', () => {
    assert.equal(projects.length, 8);
  });

  it('has the expected featured projects', () => {
    const featuredSlugs = projects
      .filter((project) => project.featured)
      .map((project) => project.slug)
      .sort();

    assert.deepEqual(featuredSlugs, ['payment-reliability', 'pg-reconciliation', 'settlement-platform']);
  });

  it('uses stable unique slugs', () => {
    const slugs = projects.map((project) => project.slug);
    assert.equal(new Set(slugs).size, slugs.length);
    assert.ok(slugs.includes('pg-reconciliation'));
    assert.ok(slugs.includes('settlement-platform'));
    assert.ok(slugs.includes('payment-reliability'));
  });

  it('featured projects have case study sections', () => {
    for (const project of projects.filter((item) => item.featured)) {
      assert.ok(project.problem.length > 20);
      assert.ok(project.approach.length > 20);
      assert.ok(project.implementation.length > 20);
      assert.ok(project.result.length > 20);
    }
  });
});

describe('record content', () => {
  it('starts with expected record categories', () => {
    assert.deepEqual(recordCategories, ['All', 'Work Logs', 'Learning Notes', 'Retrospectives']);
  });

  it('contains one record for each non-All category', () => {
    const countsByCategory = records.reduce((counts, record) => {
      counts[record.category] = (counts[record.category] ?? 0) + 1;
      return counts;
    }, {});

    assert.equal(records.length, 3);
    assert.deepEqual(countsByCategory, {
      'Learning Notes': 1,
      Retrospectives: 1,
      'Work Logs': 1,
    });
  });

  it('uses stable unique slugs', () => {
    const slugs = records.map((record) => record.slug);
    assert.equal(new Set(slugs).size, slugs.length);
  });

  it('links at least one record to a featured project', () => {
    assert.ok(records.some((record) => record.relatedProject === 'pg-reconciliation'));
  });
});

describe('profile and home content', () => {
  it('keeps requested about me details in a dedicated data module', () => {
    assert.equal(profile.name, '이상협');
    assert.equal(profile.email, 'leetkdguq73@naver.com');
    assert.equal(profile.education, '경북대학교(컴퓨터학부)');
    assert.deepEqual(profileCards.map((item) => item.label), ['이름', '이메일', '학력']);
  });

  it('keeps home labels and portfolio skill groups in data modules', () => {
    assert.deepEqual(homeContent.nav.map((item) => item.label), ['About me', 'Skills', 'Projects', 'Career']);
    assert.equal(homeContent.sections.about.title, 'ABOUT ME');
    assert.equal(homeContent.sections.skills.title, 'SKILLS');
    assert.equal(homeContent.sections.projects.title, 'PROJECTS');
    assert.equal(homeContent.sections.archive.title, 'ARCHIVING');
    assert.equal(homeContent.sections.career.title, 'CAREER');
    assert.ok(homeContent.skillGroups.every((group) => group.skills.length > 0));
    assert.deepEqual(homeContent.skillGroups.map((group) => group.title), ['Languages & Frameworks', 'Database & Infra', 'Tools']);
    assert.ok(homeContent.skillGroups.some((group) => group.skills.includes('GitLab')));
    assert.ok(homeContent.skillGroups.some((group) => group.skills.includes('Slack')));
    assert.ok(homeContent.skillGroups.some((group) => group.skills.includes('Codex')));
    assert.ok(homeContent.skillGroups.every((group) => !group.skills.includes('백엔드 개발')));
  });

  it('keeps secondary page navigation and page labels in a data module', () => {
    assert.deepEqual(secondaryNav.map((item) => item.label), ['Home', 'Projects', 'Records', 'About']);
    assert.equal(pageContent.projects.hero.title, '만든 것보다, 왜 그렇게 만들었는지를 더 남기고 싶었습니다.');
    assert.equal(pageContent.records.hero.title, '완성된 결과 뒤에 남은 생각들을 따로 쌓습니다.');
    assert.equal(pageContent.projectDetail.fallback, '프로젝트를 찾을 수 없습니다.');
  });

  it('keeps career companies and nested projects in a dedicated data module', () => {
    assert.deepEqual(careerItems.map((item) => item.company), ['씨앤에이아이', '샵체인', '샵체인']);
    assert.deepEqual(careerItems.map((item) => item.period), ['2026.04 - 현재', '2024.01 - 2026.03', '2023.06 - 2024.01']);
    assert.ok(careerItems.every((item) => item.summary.length > 20));
    assert.ok(careerItems.every((item) => item.projects.length > 0));
    assert.ok(careerItems.some((item) => item.projects.some((project) => project.title === '구독 결제 및 실패 보상 처리')));
  });

  it('groups career skills by company context', () => {
    const [cnai, shopchain, intern] = careerItems;

    assert.deepEqual(cnai.skillGroups, [
      { title: 'Frameworks & Language', skills: ['NestJS', 'TypeScript'] },
      { title: 'Database & Cache', skills: ['PostgreSQL', 'Redis'] },
      { title: 'Infra & Messaging', skills: ['AWS', 'Docker', 'Kafka'] },
      { title: 'Monitoring & Tools', skills: ['Grafana', 'GitLab', 'JIRA', 'Slack'] },
    ]);

    assert.deepEqual(shopchain.skillGroups, [
      { title: 'Frameworks & Language', skills: ['NestJS', 'TypeScript', 'Vue3', 'PHP', 'Java(Android)'] },
      { title: 'Database', skills: ['MySQL'] },
      { title: 'Infra', skills: ['Docker'] },
      { title: 'Monitoring & Tools', skills: ['Grafana', 'Prometheus', 'Loki', 'GitLab'] },
    ]);

    assert.deepEqual(intern.skillGroups, [
      { title: 'Frameworks & Language', skills: ['NestJS', 'Vue3', 'PHP'] },
      { title: 'Database', skills: ['MySQL'] },
    ]);
    assert.deepEqual(intern.skillGroups.flatMap((group) => group.skills), ['NestJS', 'Vue3', 'PHP', 'MySQL']);
    assert.equal(intern.projects[0].title, '관리 콘솔 리뉴얼');
    assert.equal(intern.projects[0].summary, '관리 콘솔 리뉴얼 프로젝트를 진행했습니다.');
  });
});

describe('skill registry', () => {
  const projectSkillNames = projects.flatMap((project) => project.technologies);
  const homeSkillNames = homeContent.skillGroups.flatMap((group) => group.skills);
  const careerSkillNames = careerItems.flatMap((item) => item.skillGroups.flatMap((group) => group.skills));

  it('only registers approved portfolio skills and tools', () => {
    assert.deepEqual(Object.keys(skillRegistry).sort(), portfolioSkillNames.toSorted());
    assert.ok(!skillRegistry.Backend);
    assert.ok(!skillRegistry['Data reliability']);
    assert.ok(!skillRegistry['백엔드 개발']);
    assert.ok(!skillRegistry.Idempotency);
    assert.ok(!skillRegistry['Knowledge Base']);
    assert.ok(!skillRegistry['AI Tools']);
    assert.ok(!skillRegistry.Promtail);
    assert.ok(!skillRegistry.node_exporter);
    assert.ok(skillRegistry.Kafka);
    assert.ok(!skillRegistry['NCP(네이버클라우드)']);
  });

  it('defines a color for every portfolio skill used by content data', () => {
    for (const name of [...projectSkillNames, ...homeSkillNames, ...careerSkillNames]) {
      assert.ok(skillRegistry[name], `${name} should be registered`);
      assert.match(skillRegistry[name].color, /^#[0-9a-f]{6}$/i);
    }
  });

  it('returns a safe fallback for unknown skill names', () => {
    assert.deepEqual(getSkill('Unknown Skill'), {
      label: 'Unknown Skill',
      color: '#2f74c0',
    });
  });
});
