export const secondaryNav = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'Records', href: '/records/' },
  { label: 'About', href: '/about/' },
];

export const pageContent = {
  projects: {
    title: 'Projects | 723poil',
    description: '결제, 정산, 운영 개선 프로젝트를 정리한 포트폴리오입니다.',
    hero: {
      title: '만든 것보다, 왜 그렇게 만들었는지를 더 남기고 싶었습니다.',
    },
  },
  records: {
    title: 'Records | 723poil',
    description: '프로젝트 작업일지, 학습 기록, 회고를 정리하는 기록 공간입니다.',
    hero: {
      title: '완성된 결과 뒤에 남은 생각들을 따로 쌓습니다.',
    },
    emptyMessage: '아직 이 분류의 기록이 없습니다.',
  },
  about: {
    title: 'About | 723poil',
    description: '백엔드 개발자 이상협의 경력, 기술, 자격 정보를 압축한 소개 페이지입니다.',
  },
  projectDetail: {
    title: 'Project | 723poil',
    description: '프로젝트 사례 연구 상세 페이지입니다.',
    fallback: '프로젝트를 찾을 수 없습니다.',
    detailButtonLabel: '상세보기',
    closeButtonLabel: '닫기',
    sections: {
      problem: '풀고 싶었던 문제',
      approach: '접근 방식',
      implementation: '구현한 것',
      result: '달라진 점',
      emptyDetail: '상세 내용은 아직 정리 중입니다.',
      role: '맡은 역할',
      metric: '눈에 보인 변화',
      records: '이어지는 기록',
      allRecords: '전체 기록 보기',
      emptyRecords: '아직 연결된 기록이 없습니다.',
    },
  },
};
