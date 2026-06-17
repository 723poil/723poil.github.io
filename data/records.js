export const recordCategories = ['All', 'Work Logs', 'Learning Notes', 'Retrospectives'];

export const records = [
  {
    slug: 'pg-reconciliation-data-flow',
    title: '정산 검증 자동화를 만들며 줄인 것들',
    date: '2026-06-17',
    category: 'Work Logs',
    tags: ['Settlement', 'Batch', 'Operations'],
    summary: '수기 대조를 줄이려고 어떤 데이터를 따로 만들고, 어디에서 사람이 확인하게 했는지 정리합니다.',
    relatedProject: 'pg-reconciliation',
  },
  {
    slug: 'redis-lock-idempotency-payment',
    title: 'Redis Lock과 멱등키를 결제에 적용하기',
    date: '2026-06-17',
    category: 'Learning Notes',
    tags: ['Payment', 'Redis', 'Idempotency'],
    summary: '중복 결제 요청을 막을 때 Lock과 멱등키가 각각 어디까지 책임지는지 적어둡니다.',
    relatedProject: 'payment-reliability',
  },
  {
    slug: 'documentation-as-operating-system',
    title: '운영 문서를 지식베이스로 바꾸며 배운 것',
    date: '2026-06-17',
    category: 'Retrospectives',
    tags: ['Documentation', 'Knowledge Base', 'Operations'],
    summary: '반복 질문을 줄이려고 흩어진 도메인 문서를 연결 가능한 지식베이스로 바꾼 경험을 돌아봅니다.',
    relatedProject: 'domain-knowledge-base',
  },
];
