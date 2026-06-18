export const profile = {
  brand: '723poil',
  name: '이상협',
  title: '백엔드 개발자',
  email: 'leetkdguq73@naver.com',
  education: '경북대학교(컴퓨터학부)',
  siteTitle: '723poil | Backend Developer',
  description: '운영에서 반복되는 문제를 구조적으로 줄이는 백엔드 개발자 이상협의 포트폴리오입니다.',
};

export const profileCards = [
  {
    label: '이름',
    value: profile.name,
  },
  {
    label: '이메일',
    value: profile.email,
    href: `mailto:${profile.email}`,
  },
  {
    label: '학력',
    value: profile.education,
  },
];

export const aboutPage = {
  hero: {
    title: '운영 가까이에 있는 문제를 백엔드 구조로 풀어왔습니다.',
  },
  sections: [
    {
      title: 'Profile',
      cards: [
        {
          title: 'Career',
          body: '씨앤에이아이 백엔드 개발자, 샵체인 풀스택 개발자로 일했습니다.',
        },
        {
          title: 'Skills',
          skills: ['NestJS', 'TypeScript', 'Vue3', 'MySQL', 'PostgreSQL', 'Redis', 'Grafana', 'Prometheus'],
        },
        {
          title: 'Education',
          body: '경북대학교 컴퓨터학부 심화컴퓨터전공을 졸업했습니다.',
        },
        {
          title: 'Certifications',
          body: '정보처리기사, SQL 개발자, 데이터분석준전문가',
        },
      ],
    },
  ],
  contact: {
    title: 'Contact',
    email: profile.email,
  },
};
