import type { OutputFormat } from './types'

const FEW_SHOT_TEMPLATES: Partial<Record<OutputFormat, string>> = {
  '블로그 글': `예시 형식:
제목: [핵심 키워드가 담긴 제목]
도입: [독자 문제 공감 2~3문장]
본문: [소제목별 논리 전개]
결론: [핵심 요약 + 다음 행동 제안]`,
  '표 형태': `예시 형식:
| 항목 | A | B | C |
|------|---|---|---|
| 핵심 지표 | ... | ... | ... |
(표 아래 3~5문장 해설)`,
  코드: `예시 형식:
1) 설계 요약 (2~3문장)
2) 코드 블록 (실행 가능한 최소 예시)
3) 사용법 (설치/실행 1~2단계)`,
  JSON: `예시 형식:
{
  "title": "string",
  "sections": [{ "heading": "string", "content": "string" }]
}`,
  사업계획서: `예시 형식:
- 문제 정의
- 해결책
- 시장/고객
- 수익모델
- 실행 계획
- 리스크`,
  이메일: `예시 형식:
제목: [한 줄]
본문: 인사 → 핵심 메시지 → 요청/CTA → 마무리`,
}

export function getFewShotTemplate(outputFormat: OutputFormat): string | null {
  return FEW_SHOT_TEMPLATES[outputFormat] ?? null
}
