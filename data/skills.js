export const fallbackSkill = {
  color: '#2f74c0',
};

export const skillRegistry = {
  Payment: { color: '#f94148' },
  Settlement: { color: '#30a26e' },
  Ops: { color: '#8869ee' },
  Operations: { color: '#8869ee' },
  Android: { color: '#30a26e' },
  Documentation: { color: '#f79b26' },
  Backend: { color: '#2f74c0' },
  'Data reliability': { color: '#30a26e' },

  NestJS: { color: '#e0234e' },
  TypeScript: { color: '#3178c6' },
  'Node.js': { color: '#43853d' },
  Scheduler: { color: '#f79b26' },
  MySQL: { color: '#4479a1' },
  PostgreSQL: { color: '#336791' },
  Redis: { color: '#dc382d' },
  Idempotency: { color: '#8869ee' },
  Grafana: { color: '#f46800' },
  Prometheus: { color: '#e6522c' },
  Loki: { color: '#5f6bff' },
  'Knowledge Base': { color: '#8869ee' },
  Vue3: { color: '#42b883' },
  PHP: { color: '#777bb4' },
  'Java(Android)': { color: '#30a26e' },
  Popbill: { color: '#f79b26' },
  Promtail: { color: '#5f6bff' },
  node_exporter: { color: '#30a26e' },
  'AI Tools': { color: '#8869ee' },
  Obsidian: { color: '#7c3aed' },
  Markdown: { color: '#495057' },
  Batch: { color: '#f79b26' },
};

export function getSkill(name) {
  const skill = skillRegistry[name] ?? {};
  return {
    label: skill.label ?? name,
    color: skill.color ?? fallbackSkill.color,
  };
}
