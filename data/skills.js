export const fallbackSkill = {
  color: '#2f74c0',
};

export const resumeSkillNames = [
  'NestJS',
  'Vue',
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
  'PHP',
  'Java(Android)',
  'Loki',
  'Promtail',
  'node_exporter',
  'Codex',
  'Obsidian',
  'Markdown',
];

export const skillRegistry = {
  NestJS: { color: '#e0234e' },
  Vue: { color: '#42b883' },
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
  PHP: { color: '#777bb4' },
  'Java(Android)': { color: '#30a26e' },
  Loki: { color: '#5f6bff' },
  Promtail: { color: '#5f6bff' },
  node_exporter: { color: '#30a26e' },
  Codex: { color: '#212529' },
  Obsidian: { color: '#7c3aed' },
  Markdown: { color: '#495057' },
};

export function getSkill(name) {
  const skill = skillRegistry[name] ?? {};
  return {
    label: skill.label ?? name,
    color: skill.color ?? fallbackSkill.color,
  };
}
