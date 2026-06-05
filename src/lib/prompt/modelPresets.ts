import type { ModelTarget } from './types'

type ModelPreset = {
  label: string
  styleHint: string
  formatHint: string
}

const MODEL_PRESETS: Record<ModelTarget, ModelPreset> = {
  범용: {
    label: '범용',
    styleHint: '특정 플랫폼 기능에 의존하지 말고 일반적인 텍스트 지시만 사용하세요.',
    formatHint: '명확한 섹션 헤더와 불릿 포인트를 사용하세요.',
  },
  GPT: {
    label: 'GPT',
    styleHint: '지시를 명확한 단계로 나누고, 각 단계의 기대 출력을 짧게 명시하세요.',
    formatHint: '역할 → 목표 → 제약 → 출력 형식 순으로 구조화하세요.',
  },
  Claude: {
    label: 'Claude',
    styleHint: '맥락과 의도를 먼저 설명하고, 사고 과정을 간결히 드러내도록 유도하세요.',
    formatHint: 'XML 태그나 마크다운 섹션으로 입력/출력 경계를 명확히 하세요.',
  },
  Gemini: {
    label: 'Gemini',
    styleHint: '구체적 예시와 명시적 출력 스키마를 함께 제공하면 효과적입니다.',
    formatHint: '요약, 본문, 후속 제안을 분리해 제시하세요.',
  },
}

export function getModelPreset(target: ModelTarget): ModelPreset {
  return MODEL_PRESETS[target]
}
