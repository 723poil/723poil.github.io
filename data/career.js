export const careerItems = [
  {
    company: '씨앤에이아이',
    period: '2026.04 - 현재',
    role: '백엔드 개발자',
    summary: 'AI 휴먼과 LLM 기반 인터랙션 기술을 바탕으로 AI 휴먼 생성·영상 제작 서비스를 제공하는 AI 기술 기업',
    logo: {
      src: 'assets/logos/cnai.png',
      alt: '씨앤에이아이 로고',
    },
    skillGroups: [
      { title: 'Frameworks & Language', skills: ['NestJS', 'TypeScript'] },
      { title: 'Database & Cache', skills: ['PostgreSQL', 'Redis'] },
      // Kafka는 학습 중이라 포트폴리오 노출에서 잠시 제외합니다.
      { title: 'Infra & Messaging', skills: ['AWS', 'Docker'] },
      { title: 'Monitoring & Tools', skills: ['Grafana', 'GitLab', 'JIRA', 'Slack'] },
    ],
    projects: [
      {
        title: 'Toss·PayPal 결제 안정성 구조',
        period: '2026년 상반기',
        summary: 'PG 승인, 내부 주문 처리, 실패 보상 단계를 분리해 결제 데이터 불일치 가능성을 줄였습니다.',
        points: [
          'Redis Lock과 멱등키 기반 중복 처리 제어',
          '내부 처리 실패 시 PG 취소 API로 보상 처리',
        ],
      },
      {
        title: '구독 결제 및 실패 보상 처리',
        period: '2026년 상반기 - 현재',
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
    summary: '테이블오더, QR·NFC오더, POS, KIOSK 등 주문·결제 솔루션과 매장 관리 서비스를 제공하는 매장 운영 플랫폼',
    logo: {
      src: 'assets/logos/shopchain.png',
      alt: '샵체인 로고',
    },
    skillGroups: [
      { title: 'Frameworks & Language', skills: ['NestJS', 'TypeScript', 'Vue3', 'PHP', 'Java(Android)'] },
      { title: 'Database', skills: ['MySQL'] },
      { title: 'Infra', skills: ['Docker'] },
      { title: 'Monitoring & Tools', skills: ['Grafana', 'Prometheus', 'Pushgateway', 'Loki', 'GitLab'] },
    ],
    projects: [
      {
        title: 'PG 결제 내역 자동 대조',
        period: '2024년 하반기 - 2025년 상반기',
        summary: 'PG 결제 내역과 내부 결제 데이터를 자동으로 대조해 운영자의 수기 검증 시간을 줄였습니다.',
        points: [
          '결제 내역 조회 60초 이상에서 10초 이내로 단축',
          '정산 검증 업무 1시간~1일에서 30분 이내로 단축',
        ],
      },
      {
        title: '정산 대행 플랫폼',
        period: '2025년 하반기',
        summary: '고객사별 수수료율과 지급 기준을 정산 생성 시점의 스냅샷으로 보존해 과거 정산 기준이 흔들리지 않게 구성했습니다.',
        points: [
          '월 매출 약 5천만 원 규모 정산 대행 플랫폼 운영',
          '정산 도메인 모델과 관리자 운영 기능 구현',
        ],
      },
      {
        title: 'POS·KIOSK 네이버페이 결제',
        period: '2025년 상반기',
        summary: '기존 신용카드·현금 결제 흐름을 유지하면서 POS와 KIOSK에 네이버페이 결제 진입점을 추가했습니다.',
      },
      {
        title: '모니터링 및 로그 조회 환경',
        period: '2024년 하반기',
        summary: 'Grafana, Prometheus, Loki 기반으로 서버 메트릭과 로그를 한 화면에서 확인할 수 있는 운영 환경을 구성했습니다.',
      },
    ],
  },
  {
    company: '샵체인',
    period: '2023.06 - 2024.01',
    role: '인턴',
    summary: '테이블오더, QR·NFC오더, POS, KIOSK 등 주문·결제 솔루션과 매장 관리 서비스를 제공하는 매장 운영 플랫폼',
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
        period: '2023년 상반기 - 2024년 상반기',
        summary: '관리 콘솔 리뉴얼 프로젝트를 진행했습니다.',
      },
    ],
  },
];
