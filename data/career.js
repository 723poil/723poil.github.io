export const careerItems = [
  {
    company: '씨앤에이아이',
    period: '2026.04 - 현재',
    role: '백엔드 개발자',
    summary: 'AI 기술을 기반으로 사용자 서비스와 디지털 콘텐츠 제품을 운영하는 회사입니다.',
    logo: {
      src: 'assets/logos/cnai.png',
      alt: '씨앤에이아이 로고',
    },
    skillGroups: [
      { title: 'Framework', skills: ['NestJS'] },
      { title: 'Database & Cache', skills: ['PostgreSQL', 'Redis'] },
      { title: 'Infra & Messaging', skills: ['AWS', 'Docker', 'Kafka'] },
      { title: 'Monitoring & Tools', skills: ['Grafana', 'GitLab', 'JIRA', 'Slack'] },
    ],
    projects: [
      {
        title: 'Toss·PayPal 결제 안정성 구조',
        period: '2026.04 - 2026.05',
        summary: 'PG 승인, 내부 주문 처리, 실패 보상 단계를 분리해 결제 데이터 불일치 가능성을 줄였습니다.',
        points: [
          'Redis Lock과 멱등키 기반 중복 처리 제어',
          '내부 처리 실패 시 PG 취소 API로 보상 처리',
        ],
      },
      {
        title: '구독 결제 및 실패 보상 처리',
        period: '2026.04 - 현재',
        summary: '단건 결제와 구독 결제 흐름을 분리하고, 실패 상황을 추적 가능한 상태로 남기도록 처리 단계를 정리했습니다.',
        points: [
          '구독 결제 승인 흐름과 일반 결제 승인 흐름 분리',
          '실패 시 재처리와 보상 처리가 가능한 구조 구성',
        ],
      },
    ],
  },
  {
    company: '샵체인',
    period: '2024.01 - 2026.03',
    role: '풀스택 개발자',
    summary: '프랜차이즈 매장의 주문, 결제, POS·KIOSK, 정산 운영을 지원하는 매장 운영 솔루션 회사입니다.',
    logo: {
      src: 'assets/logos/shopchain.png',
      alt: '샵체인 로고',
    },
    skillGroups: [
      { title: 'Frameworks & Language', skills: ['NestJS', 'Vue3', 'PHP', 'Java(Android)'] },
      { title: 'Database', skills: ['MySQL'] },
      { title: 'Infra', skills: ['Docker'] },
      { title: 'Monitoring & Tools', skills: ['Grafana', 'Prometheus', 'Loki', 'GitLab'] },
    ],
    projects: [
      {
        title: 'PG 결제 내역 자동 대조',
        period: '2024.12 - 2025.02',
        summary: 'PG 결제 내역과 내부 결제 데이터를 자동으로 대조해 운영자의 수기 검증 시간을 줄였습니다.',
        points: [
          '결제 내역 조회 60초 이상에서 10초 이내로 단축',
          '정산 검증 업무 1시간~1일에서 30분 이내로 단축',
        ],
      },
      {
        title: '정산 대행 플랫폼',
        period: '2025.08 - 2025.12',
        summary: '고객사별 수수료율과 지급 기준을 정산 생성 시점의 스냅샷으로 보존해 과거 정산 기준이 흔들리지 않게 구성했습니다.',
        points: [
          '월 매출 약 5천만 원 규모 정산 대행 플랫폼 운영',
          '정산 도메인 모델과 관리자 운영 기능 구현',
        ],
      },
      {
        title: 'POS·KIOSK 네이버페이 결제',
        period: '2025.01 - 2025.04',
        summary: '기존 신용카드·현금 결제 흐름을 유지하면서 POS와 KIOSK에 네이버페이 결제 진입점을 추가했습니다.',
      },
      {
        title: '모니터링 및 로그 조회 환경',
        period: '2024.10 - 2024.11',
        summary: 'Grafana, Prometheus, Loki 기반으로 서버 메트릭과 로그를 한 화면에서 확인할 수 있는 운영 환경을 구성했습니다.',
      },
    ],
  },
  {
    company: '샵체인',
    period: '2023.06 - 2024.01',
    role: '인턴',
    summary: '프랜차이즈 매장의 주문, 결제, POS·KIOSK, 정산 운영을 지원하는 매장 운영 솔루션 회사입니다.',
    logo: {
      src: 'assets/logos/shopchain.png',
      alt: '샵체인 로고',
    },
    skillGroups: [
      { title: 'Frameworks & Language', skills: ['NestJS', 'Vue3', 'PHP'] },
      { title: 'Database', skills: ['MySQL'] },
    ],
    projects: [
      {
        title: '관리 콘솔 리뉴얼',
        period: '2023.06 - 2024.01',
        summary: '관리 콘솔 리뉴얼 프로젝트를 진행했습니다.',
      },
    ],
  },
];
