import type { FormState, Technique } from './types'

export function buildTechniques(form: FormState, resolvedDomain: string): Technique[] {
  const techniques: Technique[] = []

  techniques.push({
    name: '역할 기반 프롬프트',
    reason: `${resolvedDomain} 작업에서 전문적 관점과 어휘 수준을 맞추기 위해`,
    impact: 'AI가 더 적절한 시각과 문제 해결 프레임으로 답변하도록 유도합니다.',
  })

  if (form.stepByStep) {
    techniques.push({
      name: '작업 분해 + 단계적 지시',
      reason: '복잡한 요청을 작은 단계로 나누면 누락과 비약이 줄어들기 때문에',
      impact: '결과물의 논리성과 재현 가능성이 높아집니다.',
    })
  }

  if (form.structuredOutput) {
    techniques.push({
      name: '구조화된 출력 지시',
      reason: '복사, 검토, 재사용이 쉬운 형태로 받기 위해',
      impact: '응답 형식이 안정화되고 후처리가 쉬워집니다.',
    })
  }

  if (form.askQuestionsFirst) {
    techniques.push({
      name: '선질문(Clarification Loop)',
      reason: '정보가 부족할 때 잘못된 가정으로 시작하는 것을 방지하기 위해',
      impact: '사용자 의도와 결과물의 정합성이 높아집니다.',
    })
  }

  if (form.includeExamples) {
    techniques.push({
      name: '예시 제공(Few-shot)',
      reason: '출력 톤과 형태를 더 빠르게 정렬하기 위해',
      impact: '원하는 스타일에 가까운 응답을 얻을 확률이 높아집니다.',
    })
  }

  if (form.constraints.trim()) {
    techniques.push({
      name: '제약 조건 명시',
      reason: '금지 요소와 필수 조건을 선명하게 전달하기 위해',
      impact: '불필요한 확장과 요구 범위 이탈을 줄여줍니다.',
    })
  }

  if (form.selfCheck) {
    techniques.push({
      name: '자기 검토(Self-check)',
      reason: '초안의 누락, 모순, 불명확함을 줄이기 위해',
      impact: '최종 출력의 완성도와 신뢰성이 올라갑니다.',
    })
  }

  if (form.modelTarget !== '범용') {
    techniques.push({
      name: `${form.modelTarget} 최적화 지시`,
      reason: '선택한 모델의 응답 패턴에 맞춘 지시 스타일을 적용하기 위해',
      impact: '모델별 강점을 활용한 더 안정적인 출력을 기대할 수 있습니다.',
    })
  }

  return techniques
}
