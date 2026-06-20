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
    assert.deepEqual(projectCategories, ['All', 'Payment', 'Settlement', 'Ops', 'Android', 'Documentation', 'Data']);
  });

  it('contains all resume-derived projects', () => {
    assert.equal(projects.length, 11);
  });

  it('has the expected featured projects', () => {
    const featuredSlugs = projects
      .filter((project) => project.featured)
      .map((project) => project.slug)
      .sort();

    assert.deepEqual(featuredSlugs, ['payment-reliability', 'pg-reconciliation', 'settlement-platform']);
  });

  it('has the expected major projects', () => {
    const majorProjectSlugs = projects
      .filter((project) => project.majorProject)
      .map((project) => project.slug)
      .sort();

    assert.deepEqual(majorProjectSlugs, ['pg-reconciliation', 'settlement-platform']);
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
    assert.match(readFileSync('data/project-details/recycling-guide-app.md', 'utf8'), /## (?:\S+ )?(구현한 것|개선 과정)/);
  });

  it('includes the 수성구 카페 상권 분석 team project with source links', () => {
    const project = projects.find((item) => item.slug === 'suseong-cafe-market-analysis');

    assert.ok(project);
    assert.equal(project.title, '수성구 카페 상권 분석');
    assert.equal(project.type, '팀 프로젝트');
    assert.equal(project.role, '데이터 수집·분석 및 서버 구축 담당');
    assert.ok(project.categories.includes('Data'));
    assert.ok(project.technologies.includes('Python'));
    assert.ok(project.technologies.includes('Selenium'));
    assert.ok(project.technologies.includes('TensorFlow'));
    assert.deepEqual(project.links.map((link) => link.url), [
      'https://github.com/JoWonYeong/market-analysis/',
      'https://app.notion.com/p/4-b5804aeb23fd4505a7b2343ea6cef846?source=copy_link',
      'https://velog.io/@723poil/%EC%9B%B9%ED%81%AC%EB%A1%A4%EB%A7%81-%EC%88%98%EC%84%B1%EA%B5%AC-CCTV-%EC%83%81%EA%B6%8C%EB%B6%84%EC%84%9D-%EC%9B%B9-%ED%81%AC%EB%A1%A4%EB%A7%81-%ED%95%98%EA%B8%B0',
    ]);
    assert.match(readFileSync('data/project-details/suseong-cafe-market-analysis.md', 'utf8'), /공공데이터/);
    assert.match(readFileSync('data/project-details/suseong-cafe-market-analysis.md', 'utf8'), /크롤링/);
  });

  it('includes the COVID19 information management system team project with source link', () => {
    const project = projects.find((item) => item.slug === 'cims-project');

    assert.ok(project);
    assert.equal(project.title, 'COVID19 정보 관리 시스템');
    assert.equal(project.type, '팀 프로젝트');
    assert.equal(project.role, '백엔드 개발 및 Firebase 연동 담당');
    assert.ok(project.categories.includes('Ops'));
    assert.ok(project.technologies.includes('Python'));
    assert.ok(project.technologies.includes('PyQt5'));
    assert.ok(project.technologies.includes('Firebase'));
    assert.deepEqual(project.links.map((link) => link.url), ['https://github.com/723poil/CIMS_project']);
    assert.match(readFileSync('data/project-details/cims-project.md', 'utf8'), /FCM/);
    assert.match(readFileSync('data/project-details/cims-project.md', 'utf8'), /read flag/);
  });

  it('uses stable unique slugs', () => {
    const slugs = projects.map((project) => project.slug);
    assert.equal(new Set(slugs).size, slugs.length);
    assert.ok(slugs.includes('pg-reconciliation'));
    assert.ok(slugs.includes('settlement-platform'));
    assert.ok(slugs.includes('payment-reliability'));
    assert.ok(slugs.includes('suseong-cafe-market-analysis'));
    assert.ok(slugs.includes('cims-project'));
  });

  it('featured projects have markdown case study files', () => {
    for (const project of projects.filter((item) => item.featured)) {
      const markdown = readFileSync(`data/project-details/${project.slug}.md`, 'utf8');
      assert.match(markdown, /^##\s+\S+/m);
      assert.match(markdown, /## (?:\S+ )?(구현한 것|개선 과정)/);
      assert.match(markdown, /## (?:\S+ )?(달라진 점|성과)/);
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
    assert.equal(profile.github, 'https://github.com/723poil');
    assert.deepEqual(profileCards.map((item) => item.label), ['이름', '이메일', '학력', 'GitHub']);
    assert.equal(profileCards.find((item) => item.label === 'GitHub').href, profile.github);
  });

  it('keeps home labels and portfolio skill groups in data modules', () => {
    assert.deepEqual(homeContent.nav.map((item) => item.label), ['About me', 'Skills', 'Projects', 'Career']);
    assert.equal(homeContent.sections.about.title, 'ABOUT ME');
    assert.equal(homeContent.sections.skills.title, 'SKILLS');
    assert.equal(homeContent.sections.projects.title, 'PROJECTS');
    assert.equal(homeContent.sections.projects.filterLabel, '프로젝트 유형 필터');
    assert.equal(homeContent.sections.projects.moreButtonLabel, '프로젝트 더보기');
    assert.equal(homeContent.sections.projects.lessButtonLabel, '접기');
    assert.equal(homeContent.sections.archive, undefined);
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
    assert.ok(homeContent.skillGroups.some((group) => group.skills.includes('Python')));
    assert.ok(homeContent.skillGroups.find((group) => group.title === 'Tools').skills.includes('Obsidian'));
    assert.ok(homeContent.skillGroups.every((group) => !group.skills.includes('Vue')));
    assert.ok(homeContent.skillGroups.every((group) => !group.skills.includes('Pushgateway')));
    assert.ok(homeContent.skillGroups.every((group) => !group.skills.includes('Loki')));
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

  it('presents the domain knowledge base as documentation and AI usage groundwork', () => {
    const project = projects.find((item) => item.slug === 'domain-knowledge-base');

    assert.ok(project);
    assert.equal(project.title, '도메인 지식베이스 구축 및 AI 활용 기반 정리');
    assert.equal(project.role, '도메인 문서화 담당');
    assert.ok(project.technologies.includes('Obsidian'));

    const markdown = readFileSync('data/project-details/domain-knowledge-base.md', 'utf8');
    assert.match(markdown, /Obsidian/);
    assert.match(markdown, /문서 간 연결/);
    assert.match(markdown, /AI 활용 기반/);
    assert.match(markdown, /동료 개발자/);
    assert.match(markdown, /질의를 하지 않고/);
  });

  it('keeps project modal labels in a data module', () => {
    assert.equal(pageContent.projectDetail.detailButtonLabel, '상세보기');
    assert.equal(pageContent.projectDetail.closeButtonLabel, '닫기');
    assert.equal(pageContent.projectDetail.sections.emptyDetail, '상세 내용은 아직 정리 중입니다.');
    assert.equal(pageContent.projectDetail.sections.role, '담당');
    assert.equal(pageContent.projectDetail.sections.skills, '스킬');
    assert.equal(pageContent.projectDetail.sections.links, '관련 링크');
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
      '2026년 상반기 - 퇴사',
      '2025년 하반기',
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
      '단맛 프로젝트 개발 참여',
      'AX 도입 및 도메인 지식 문서화 담당',
      '픽업프렌즈 프로젝트 개발',
      '정산 대행 플랫폼 개발',
      '드림페이 개발',
      '네이버페이 결제 도입',
      '정산·결제 도메인 담당',
      '관리 콘솔 리뉴얼 및 유지보수',
      '외부 배달앱 주문 POS 연동',
    ]);
    assert.deepEqual(shopchain.projects.map((project) => project.period), [
      '2026년 상반기 - 퇴사',
      '2026년 상반기 - 퇴사',
      '2025년 하반기',
      '2025년 하반기',
      '2025년 하반기',
      '2025년 상반기',
      '2024년 하반기 - 퇴사',
      '2024년 상반기 - 퇴사',
      '2024년 상반기',
    ]);
    assert.match(shopchain.projects[0].summary, /단골 맛집 리워드 앱/);
    assert.match(shopchain.projects[0].summary, /포인트/);
    assert.match(shopchain.projects[0].summary, /추천/);
    assert.match(shopchain.projects[2].summary, /포장주문 앱/);
    assert.match(shopchain.projects[2].summary, /지도와 매장 목록/);
    assert.match(shopchain.projects[2].summary, /매장 픽업/);
  });

  it('groups career skills by company context', () => {
    const [cnai, shopchain, intern] = careerItems;

    assert.deepEqual(cnai.skillGroups, [
      { title: 'Frameworks & Language', skills: ['NestJS', 'TypeScript'] },
      { title: 'Database & Cache', skills: ['PostgreSQL', 'Redis'] },
      { title: 'Infra & Messaging', skills: ['AWS', 'Docker'] },
      { title: 'Monitoring & Tools', skills: ['Grafana', 'GitLab', 'Jenkins', 'Infisical', 'JIRA', 'Slack'] },
    ]);

    assert.deepEqual(shopchain.skillGroups, [
      { title: 'Frameworks & Language', skills: ['NestJS', 'TypeScript', 'Vue3', 'PHP', 'Java(Android)'] },
      { title: 'Database', skills: ['MySQL'] },
      { title: 'Infra', skills: ['Docker'] },
      { title: 'Monitoring & Tools', skills: ['Grafana', 'Prometheus', 'GitLab', 'Jenkins'] },
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
