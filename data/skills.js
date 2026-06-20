export const fallbackSkill = {
  color: '#2f74c0',
};

export const portfolioSkillNames = [
  'NestJS',
  'Vue3',
  'MySQL',
  'TypeScript',
  'GitLab',
  'Jenkins',
  'Grafana',
  'Prometheus',
  'AWS',
  'Docker',
  'PostgreSQL',
  'Redis',
  'JIRA',
  'Slack',
  'Obsidian',
  'PHP',
  'Java(Android)',
  'Kotlin',
  'Python',
  'PyQt5',
  'Firebase',
  'Selenium',
  'Pandas',
  'Node.js',
  'TensorFlow',
  'Google Cloud',
  // Kafka는 학습 중이라 포트폴리오 노출에서 잠시 제외합니다.
  // 'Kafka',
];

export const resumeSkillNames = portfolioSkillNames;

export const skillRegistry = {
  NestJS: { color: '#e0234e' },
  Vue3: { color: '#42b883' },
  MySQL: { color: '#4479a1' },
  TypeScript: { color: '#3178c6' },
  GitLab: { color: '#fc6d26' },
  Jenkins: { color: '#d33833' },
  Grafana: { color: '#f46800' },
  Prometheus: { color: '#e6522c' },
  AWS: { color: '#ff9900' },
  Docker: { color: '#2496ed' },
  PostgreSQL: { color: '#336791' },
  Redis: { color: '#dc382d' },
  JIRA: { color: '#0052cc' },
  Slack: { color: '#4a154b' },
  Obsidian: { color: '#7c3aed' },
  PHP: { color: '#777bb4' },
  'Java(Android)': { color: '#30a26e' },
  Kotlin: { color: '#7f52ff' },
  Python: { color: '#3776ab' },
  PyQt5: { color: '#41cd52' },
  Firebase: { color: '#ffca28' },
  Selenium: { color: '#43b02a' },
  Pandas: { color: '#150458' },
  'Node.js': { color: '#339933' },
  TensorFlow: { color: '#ff6f00' },
  'Google Cloud': { color: '#4285f4' },
  // Kafka: { color: '#231f20' },
};

export function getSkill(name) {
  const skill = skillRegistry[name] ?? {};
  return {
    label: skill.label ?? name,
    color: skill.color ?? fallbackSkill.color,
  };
}
