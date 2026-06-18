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
      filterLabel: '프로젝트 유형 필터',
      moreButtonLabel: '프로젝트 더보기',
      lessButtonLabel: '접기',
    },
    archive: {
      title: 'ARCHIVING',
      items: [],
      emptyMessage: '아직 공개된 아카이빙이 없습니다.',
    },
    career: {
      title: 'CAREER',
      skillMoreLabel: '더보기',
      skillLessLabel: '접기',
      projectMoreLabel: '더보기',
      projectLessLabel: '접기',
    },
  },
  skillGroups: [
    {
      title: 'Languages & Frameworks',
      skills: ['NestJS', 'TypeScript', 'Vue', 'Vue3', 'PHP', 'Java(Android)'],
    },
    {
      title: 'Database & Infra',
      // Kafka는 학습 중이라 포트폴리오 노출에서 잠시 제외합니다.
      skills: ['MySQL', 'PostgreSQL', 'Redis', 'AWS', 'Docker'],
    },
    {
      title: 'Tools',
      skills: ['GitLab', 'Jenkins', 'Grafana', 'Prometheus', 'Pushgateway', 'Loki', 'JIRA', 'Slack', 'Codex', 'Obsidian', 'Markdown'],
    },
  ],
};
