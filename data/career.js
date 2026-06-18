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
        title: 'Winkand 프로젝트 개발 참여',
        period: '2026년 상반기',
        summary: 'Winkand 프로젝트 개발에 참여했습니다.',
      },
      {
        title: '결제 도메인 개발 담당',
        period: '2026년 상반기',
        summary: '결제 도메인 개발을 담당했습니다.',
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
        title: '정산·결제 도메인 담당',
        period: '2024년 하반기 - 퇴사',
        summary: '매장 결제, 정산, PG 데이터 흐름을 함께 다루는 정산·결제 도메인을 담당했습니다.',
      },
      {
        title: '관리 콘솔 리뉴얼 및 유지보수 담당',
        period: '2024년 상반기 - 퇴사',
        summary: '운영자가 매장·주문·결제 데이터를 관리하는 콘솔의 리뉴얼과 유지보수를 담당했습니다.',
      },
      {
        title: '정산 대행 플랫폼 개발 및 운영 담당',
        period: '2025년 하반기',
        summary: '고객사별 수수료율과 지급 기준을 관리하는 정산 대행 플랫폼의 개발과 운영을 담당했습니다.',
      },
      {
        title: '네이버페이 결제 담당',
        period: '2025년 상반기',
        summary: 'POS·KIOSK 환경에서 네이버페이 결제 흐름을 연결하고 운영 가능한 형태로 정리했습니다.',
      },
      {
        title: '드림페이 개발 및 운영 담당',
        period: '2025년 하반기',
        summary: '드림페이 결제 서비스의 개발과 운영을 담당했습니다.',
      },
      {
        title: '외부 배달앱 주문 POS 연동 담당',
        period: '2024년 상반기',
        summary: '외부 배달앱 주문이 POS 흐름에 연동되도록 주문 수신과 처리 흐름을 담당했습니다.',
      },
      {
        title: 'AX 도입 및 도메인 지식 문서화 담당',
        period: '2026년 상반기 - 퇴사',
        summary: '업무 효율화를 위한 AX 도입과 정산·결제 도메인 지식 문서화를 담당했습니다.',
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
        title: '관리 콘솔 리뉴얼 담당',
        period: '2023년 하반기 - 전환',
        summary: '관리 콘솔 리뉴얼을 담당했습니다.',
      },
    ],
  },
];
