import type { FormState, QuestionMapping } from './types'

export function buildClarifyingQuestions(form: FormState): string[] {
  return buildQuestionMappings(form).map((item) => item.question)
}

export function buildQuestionMappings(form: FormState): QuestionMapping[] {
  const mappings: QuestionMapping[] = []

  if (!form.goal.trim()) {
    mappings.push({
      field: 'goal',
      question: '이번 작업에서 가장 중요하게 얻고 싶은 결과는 무엇인가요?',
    })
  }
  if (!form.audience.trim()) {
    mappings.push({
      field: 'audience',
      question: '결과물을 누가 읽거나 사용할 예정인가요?',
    })
  }
  if (!form.context.trim()) {
    mappings.push({
      field: 'context',
      question: '참고해야 할 배경 정보, 상황, 기존 자료가 있나요?',
    })
  }
  if (!form.constraints.trim()) {
    mappings.push({
      field: 'constraints',
      question: '반드시 지켜야 할 제한 조건이나 피해야 할 요소가 있나요?',
    })
  }
  if ((form.brief || '').trim().length < 20) {
    mappings.push({
      field: 'brief',
      question: '원하는 작업을 한 문장 더 구체적으로 설명해줄 수 있나요?',
    })
  }
  if (form.outputFormat === '기타') {
    mappings.push({
      field: 'brief',
      question: '원하는 최종 출력 형태를 예시와 함께 알려줄 수 있나요?',
    })
  }

  return mappings.slice(0, 4)
}
