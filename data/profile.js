export const profile = {
  brand: '723poil',
  name: '이상협',
  title: '백엔드 개발자',
  email: 'leetkdguq73@naver.com',
  education: '경북대학교(컴퓨터학부)',
  github: 'https://github.com/723poil',
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
  {
    label: 'GitHub',
    value: profile.github,
    href: profile.github,
  },
];
