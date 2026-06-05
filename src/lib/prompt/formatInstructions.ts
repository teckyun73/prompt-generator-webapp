import type { OutputFormat } from './types'

export function formatInstructions(outputFormat: OutputFormat): string {
  switch (outputFormat) {
    case '블로그 글':
      return '제목, 도입, 본문 소제목, 결론 순서로 작성하세요.'
    case '표 형태':
      return '핵심 비교 항목을 표로 먼저 제시하고, 이어서 짧은 해설을 덧붙이세요.'
    case '코드':
      return '먼저 설계 요약을 제시하고, 이어서 실행 가능한 코드와 간단한 사용법을 제시하세요.'
    case 'JSON':
      return '설명 없이 JSON 객체만 출력하되, 키 이름은 의미가 명확해야 합니다.'
    case '사업계획서':
      return '문제, 해결책, 시장, 수익모델, 실행계획, 리스크 순서로 작성하세요.'
    case '이메일':
      return '제목, 인사, 핵심 메시지, 요청사항, 마무리 순서로 작성하세요.'
    default:
      return '제목과 섹션 헤더를 사용해 구조적으로 정리하세요.'
  }
}
