export const homeContent = {
  nav: [
    { label: 'About me', href: '#about-snapshot' },
    { label: 'Skills', href: '#core-skills' },
    { label: 'Projects', href: '#featured-projects' },
    { label: 'Career', href: '#experience' },
  ],
  hero: {
    titleLines: ['이상협', '백엔드 개발자 포트폴리오'],
    bodyLines: ['안녕하세요.', '운영에서 반복되는 문제를 구조적으로 줄이는', '백엔드 개발자입니다.'],
    action: {
      label: '더 알아보기',
      href: '#about-snapshot',
    },
  },
  sections: {
    about: {
      title: 'ABOUT ME',
    },
    skills: {
      title: 'SKILLS',
    },
    projects: {
      title: 'PROJECTS',
      archiveLinkLabel: '전체 프로젝트 보기',
      archiveLinkHref: '#project-archive-preview',
    },
    archive: {
      title: 'ARCHIVING',
      limit: 5,
    },
    career: {
      title: 'CAREER',
    },
  },
  skillGroups: [
    {
      title: 'Backend',
      skills: ['NestJS', 'TypeScript', 'Node.js', 'Scheduler'],
    },
    {
      title: 'Data reliability',
      skills: ['MySQL', 'PostgreSQL', 'Redis', 'Idempotency'],
    },
    {
      title: 'Operations',
      skills: ['Grafana', 'Prometheus', 'Loki', 'Knowledge Base'],
    },
  ],
};
