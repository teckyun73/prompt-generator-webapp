import type { FormState, Preset } from './types'

export const initialForm: FormState = {
  brief: '',
  goal: '',
  audience: '',
  context: '',
  constraints: '',
  outputFormat: '구조화된 문서',
  domain: '자동 추론',
  tone: '전문적',
  language: '한국어',
  modelTarget: '범용',
  creativity: 60,
  askQuestionsFirst: true,
  includeExamples: false,
  selfCheck: true,
  stepByStep: true,
  structuredOutput: true,
}

export const presets: Preset[] = [
  {
    name: '블로그 글',
    values: {
      brief: 'AI 생산성 도구를 비교하는 블로그 글을 작성하고 싶어.',
      goal: '검색 유입과 신뢰도를 높일 수 있는 글 초안 생성',
      audience: '생산성 도구를 찾는 직장인과 1인 사업자',
      context: '비교 대상은 ChatGPT, Claude, Gemini이며, 실무 활용 관점이 중요해.',
      constraints: '광고 문구처럼 보이지 않게 쓰고, 과장 표현은 피하고, 표 하나를 포함해.',
      outputFormat: '블로그 글',
      domain: '마케팅/콘텐츠',
      tone: '전문적',
    },
  },
  {
    name: '개발 요청',
    values: {
      brief: 'React와 Node.js로 사내 할 일 관리 앱을 설계하고 싶어.',
      goal: 'MVP 설계안과 초기 개발 프롬프트 생성',
      audience: '풀스택 개발자 1명과 디자이너 1명',
      context: '권한 관리, 태스크 상태, 댓글, 알림 기능이 필요하고 4주 안에 만들어야 해.',
      constraints: '과설계를 피하고, 구현 우선순위를 제시하고, 코드 예시는 최소화해.',
      outputFormat: '구조화된 문서',
      domain: '개발',
      tone: '간결함',
    },
  },
  {
    name: '사업계획서',
    values: {
      brief: '친환경 식품 스타트업의 사업계획서를 작성하고 싶어.',
      goal: '투자자 미팅용 초안 구성',
      audience: '초기 투자자와 액셀러레이터 심사역',
      context: '제품은 구독형 밀키트이고, 타깃은 30대 맞벌이 가구야.',
      constraints: '시장성, 수익모델, 실행 계획을 명확히 제시하고 2페이지 분량 느낌으로 써줘.',
      outputFormat: '사업계획서',
      domain: '비즈니스',
      tone: '설득적',
    },
  },
]
