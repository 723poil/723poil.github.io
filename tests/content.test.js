import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { projectCategories, projects } from '../data/projects.js';
import { careerItems } from '../data/career.js';
import { homeContent } from '../data/home.js';
import { profile, profileCards } from '../data/profile.js';
import { pageContent } from '../data/site.js';
import { getSkill, portfolioSkillNames, skillRegistry } from '../data/skills.js';

describe('project content', () => {
  it('starts with expected project categories', () => {
    assert.deepEqual(projectCategories, ['All', 'Payment', 'Settlement', 'Ops', 'Android', 'Documentation']);
  });

  it('contains all resume-derived projects', () => {
    assert.equal(projects.length, 9);
  });

  it('has the expected featured projects', () => {
    const featuredSlugs = projects
      .filter((project) => project.featured)
      .map((project) => project.slug)
      .sort();

    assert.deepEqual(featuredSlugs, ['payment-reliability', 'pg-reconciliation', 'settlement-platform']);
  });

  it('separates project card metadata from future detail content', () => {
    assert.ok(projects.every((project) => ['회사 프로젝트', '팀 프로젝트'].includes(project.type)));
    assert.ok(projects.every((project) => project.detailReady));
    assert.ok(projects.every((project) => project.problem === undefined));
    assert.ok(projects.every((project) => project.approach === undefined));
    assert.ok(projects.every((project) => project.implementation === undefined));
    assert.ok(projects.every((project) => project.result === undefined));
  });

  it('includes the 알려줄게 team project with markdown detail content', () => {
    const project = projects.find((item) => item.slug === 'recycling-guide-app');

    assert.ok(project);
    assert.equal(project.title, '알려줄게');
    assert.equal(project.type, '팀 프로젝트');
    assert.equal(project.role, '서버 구축 및 Android API 연동 담당');
    assert.ok(project.categories.includes('Android'));
    assert.ok(project.technologies.includes('Kotlin'));
    assert.ok(project.technologies.includes('TensorFlow'));
    assert.match(readFileSync('data/project-details/recycling-guide-app.md', 'utf8'), /## 구현한 것/);
  });

  it('uses stable unique slugs', () => {
    const slugs = projects.map((project) => project.slug);
    assert.equal(new Set(slugs).size, slugs.length);
    assert.ok(slugs.includes('pg-reconciliation'));
    assert.ok(slugs.includes('settlement-platform'));
    assert.ok(slugs.includes('payment-reliability'));
  });

  it('featured projects have markdown case study files', () => {
    for (const project of projects.filter((item) => item.featured)) {
      const markdown = readFileSync(`data/project-details/${project.slug}.md`, 'utf8');
      assert.match(markdown, /## 풀고 싶었던 문제/);
      assert.match(markdown, /## 접근 방식/);
      assert.match(markdown, /## 구현한 것/);
      assert.match(markdown, /## 달라진 점/);
    }
  });

  it('keeps project modal detail content in markdown files with level two headings', () => {
    for (const project of projects.filter((item) => item.detailReady)) {
      const markdownPath = `data/project-details/${project.slug}.md`;
      assert.ok(existsSync(markdownPath), `${markdownPath} should exist`);

      const markdown = readFileSync(markdownPath, 'utf8');
      assert.match(markdown, /^##\s+\S+/m, `${markdownPath} should expose level two headings for the modal toc`);
    }
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
    assert.equal(homeContent.sections.projects.filterLabel, '프로젝트 유형 필터');
    assert.equal(homeContent.sections.projects.moreButtonLabel, '프로젝트 더보기');
    assert.equal(homeContent.sections.projects.lessButtonLabel, '접기');
    assert.equal(homeContent.sections.archive.title, 'ARCHIVING');
    assert.deepEqual(homeContent.sections.archive.items, []);
    assert.equal(homeContent.sections.archive.emptyMessage, '아직 공개된 아카이빙이 없습니다.');
    assert.equal(homeContent.sections.career.title, 'CAREER');
    assert.equal(homeContent.sections.career.skillMoreLabel, '더보기');
    assert.equal(homeContent.sections.career.skillLessLabel, '접기');
    assert.equal(homeContent.sections.career.projectMoreLabel, '더보기');
    assert.equal(homeContent.sections.career.projectLessLabel, '접기');
    assert.ok(homeContent.skillGroups.every((group) => group.skills.length > 0));
    assert.deepEqual(homeContent.skillGroups.map((group) => group.title), ['Languages & Frameworks', 'Database & Infra', 'Tools']);
    assert.ok(homeContent.skillGroups.some((group) => group.skills.includes('GitLab')));
    assert.ok(homeContent.skillGroups.some((group) => group.skills.includes('Slack')));
    assert.ok(homeContent.skillGroups.some((group) => group.skills.includes('Vue3')));
    assert.ok(homeContent.skillGroups.every((group) => !group.skills.includes('Vue')));
    assert.ok(homeContent.skillGroups.every((group) => !group.skills.includes('Pushgateway')));
    assert.ok(homeContent.skillGroups.every((group) => !group.skills.includes('Loki')));
    assert.ok(homeContent.skillGroups.every((group) => !group.skills.includes('Obsidian')));
    assert.ok(homeContent.skillGroups.every((group) => !group.skills.includes('Markdown')));
    assert.ok(homeContent.skillGroups.every((group) => !group.skills.includes('Codex')));
    assert.ok(homeContent.skillGroups.every((group) => !group.skills.includes('백엔드 개발')));
  });

  it('keeps every career skill visible in the top skills section', () => {
    const topSkillNames = new Set(homeContent.skillGroups.flatMap((group) => group.skills));
    const careerSkillNames = careerItems.flatMap((item) => item.skillGroups.flatMap((group) => group.skills));
    const missingSkillNames = [...new Set(careerSkillNames)].filter((skillName) => !topSkillNames.has(skillName));

    assert.deepEqual(missingSkillNames, []);
  });

  it('keeps project modal labels in a data module', () => {
    assert.equal(pageContent.projectDetail.detailButtonLabel, '상세보기');
    assert.equal(pageContent.projectDetail.closeButtonLabel, '닫기');
    assert.equal(pageContent.projectDetail.sections.emptyDetail, '상세 내용은 아직 정리 중입니다.');
    assert.equal(pageContent.projectDetail.sections.role, '담당');
    assert.equal(pageContent.projectDetail.sections.skills, '스킬');
  });

  it('keeps career companies and nested projects in a dedicated data module', () => {
    assert.deepEqual(careerItems.map((item) => item.company), ['씨앤에이아이', '샵체인', '샵체인']);
    assert.deepEqual(careerItems.map((item) => item.period), ['2026.04 - 재직중', '2024.01 - 2026.03', '2023.06 - 2024.01']);
    assert.equal(
      careerItems[0].summary,
      'AI 휴먼과 LLM 기반 인터랙션 기술을 바탕으로 AI 휴먼 생성·영상 제작 서비스를 제공하는 AI 기술 기업',
    );
    assert.equal(
      careerItems[1].summary,
      '테이블오더, QR·NFC오더, POS, KIOSK 등 주문·결제 솔루션과 매장 관리 서비스를 제공하는 매장 운영 플랫폼',
    );
    assert.equal(careerItems[2].summary, careerItems[1].summary);
    assert.ok(careerItems.every((item) => item.projects.length > 0));
    assert.deepEqual(
      careerItems[0].projects.map((project) => project.title),
      ['Winkand 프로젝트 개발 참여'],
    );
  });

  it('uses half-year labels for career project periods', () => {
    const projectPeriods = careerItems.flatMap((item) => item.projects.map((project) => project.period));

    assert.deepEqual(projectPeriods, [
      '2026년 상반기',
      '2026년 상반기 - 퇴사',
      '2025년 하반기',
      '2025년 하반기',
      '2025년 상반기',
      '2024년 하반기 - 퇴사',
      '2024년 상반기 - 퇴사',
      '2024년 상반기',
      '2023년 하반기 - 전환',
    ]);
    assert.ok(projectPeriods.every((period) => !/\d{4}\.\d{2}/.test(period)));
  });

  it('keeps Shopchain career projects as grouped responsibilities', () => {
    const shopchain = careerItems[1];

    assert.deepEqual(shopchain.projects.map((project) => project.title), [
      'AX 도입 및 도메인 지식 문서화 담당',
      '정산 대행 플랫폼 개발',
      '드림페이 개발',
      '네이버페이 결제 도입',
      '정산·결제 도메인 담당',
      '관리 콘솔 리뉴얼 및 유지보수',
      '외부 배달앱 주문 POS 연동',
    ]);
    assert.deepEqual(shopchain.projects.map((project) => project.period), [
      '2026년 상반기 - 퇴사',
      '2025년 하반기',
      '2025년 하반기',
      '2025년 상반기',
      '2024년 하반기 - 퇴사',
      '2024년 상반기 - 퇴사',
      '2024년 상반기',
    ]);
  });

  it('groups career skills by company context', () => {
    const [cnai, shopchain, intern] = careerItems;

    assert.deepEqual(cnai.skillGroups, [
      { title: 'Frameworks & Language', skills: ['NestJS', 'TypeScript'] },
      { title: 'Database & Cache', skills: ['PostgreSQL', 'Redis'] },
      { title: 'Infra & Messaging', skills: ['AWS', 'Docker'] },
      { title: 'Monitoring & Tools', skills: ['Grafana', 'GitLab', 'JIRA', 'Slack'] },
    ]);

    assert.deepEqual(shopchain.skillGroups, [
      { title: 'Frameworks & Language', skills: ['NestJS', 'TypeScript', 'Vue3', 'PHP', 'Java(Android)'] },
      { title: 'Database', skills: ['MySQL'] },
      { title: 'Infra', skills: ['Docker'] },
      { title: 'Monitoring & Tools', skills: ['Grafana', 'Prometheus', 'GitLab'] },
    ]);

    assert.deepEqual(intern.skillGroups, [
      { title: 'Frameworks & Language', skills: ['NestJS', 'Vue3', 'PHP'] },
      { title: 'Database', skills: ['MySQL'] },
    ]);
    assert.deepEqual(intern.skillGroups.flatMap((group) => group.skills), ['NestJS', 'Vue3', 'PHP', 'MySQL']);
    assert.equal(intern.projects[0].title, '관리 콘솔 리뉴얼');
    assert.equal(intern.projects[0].period, '2023년 하반기 - 전환');
    assert.equal(intern.projects[0].summary, 'NestJS, Vue3 기반 지사용 관리 콘솔 리뉴얼을 담당하여 업무 효율 개선');
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
    assert.ok(!skillRegistry.Kafka);
    assert.ok(!skillRegistry.Pushgateway);
    assert.ok(!skillRegistry.Loki);
    assert.ok(!skillRegistry.Obsidian);
    assert.ok(!skillRegistry.Markdown);
    assert.ok(!skillRegistry.Codex);
    assert.ok(!skillRegistry['NCP(네이버클라우드)']);
    assert.ok(!skillRegistry.Vue);
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
