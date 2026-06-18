export const careerItems = [
  {
    company: '씨앤에이아이',
    period: '2026.04 - 재직중',
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
        summary: 'AI 챗봇 서비스 Winkand 프로젝트 백엔드 개발 참여',
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
      { title: 'Monitoring & Tools', skills: ['Grafana', 'Prometheus', 'GitLab'] },
    ],
    projects: [
      {
        title: 'AX 도입 및 도메인 지식 문서화 담당',
        period: '2026년 상반기 - 퇴사',
        summary: '팀 내 지식 공유와 도메인 문서화를 통해 업무 효율 개선 및 LLM 활용 기반 마련',
      },
      {
        title: '정산 대행 플랫폼 개발',
        period: '2025년 하반기',
        summary: '고객사별 수수료율과 지급 기준을 관리하는 정산 플랫폼 개발·운영',
      },
      {
        title: '드림페이 개발',
        period: '2025년 하반기',
        summary: '비사업자 결제·정산 및 현금영수증 발급 서비스 개발',
      },
      {
        title: '네이버페이 결제 도입',
        period: '2025년 상반기',
        summary: 'POS·KIOSK·테이블오더 환경의 네이버페이 결제 도입',
      },
      {
        title: '정산·결제 도메인 담당',
        period: '2024년 하반기 - 퇴사',
        summary: '결제 신규 도입 및 정산에 대한 고도화 및 유지보수 업무 담당',
      },
      {
        title: '관리 콘솔 리뉴얼 및 유지보수',
        period: '2024년 상반기 - 퇴사',
        summary: 'NestJS, Vue3 기반 지사, 점주, 프랜차이즈, 어드민 관리 콘솔 리뉴얼 및 유지보수를 담당하여 업무 효율 개선',
      },
      {
        title: '외부 배달앱 주문 POS 연동',
        period: '2024년 상반기',
        summary: '외부 배달앱 주문을 POS 주문·매출 흐름으로 연결하는 연동 작업 진행',
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
        period: '2023년 하반기 - 전환',
        summary: 'NestJS, Vue3 기반 지사용 관리 콘솔 리뉴얼을 담당하여 업무 효율 개선',
      },
    ],
  },
];
