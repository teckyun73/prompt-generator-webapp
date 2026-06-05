import type { Analysis, FormState } from './types'

export function buildAnalysis(form: FormState, resolvedDomain: string, questions: string[]): Analysis {
  const objective = form.goal.trim() || form.brief.trim() || '사용자 요구를 바탕으로 적절한 결과물 생성'
  const expected = form.outputFormat === '기타' ? '사용자 지정 형식' : form.outputFormat
  const ambiguity = questions.length
    ? `추가 확인이 필요한 항목 ${questions.length}개: ${questions.join(' / ')}`
    : '핵심 정보가 충분하여 바로 프롬프트를 설계할 수 있습니다.'

  return {
    objective,
    expected,
    domain: resolvedDomain,
    constraints:
      [form.tone ? `톤: ${form.tone}` : null, form.constraints ? `추가 제약: ${form.constraints}` : null]
        .filter(Boolean)
        .join(' / ') || '특별한 제약 없음',
    ambiguity,
  }
}
