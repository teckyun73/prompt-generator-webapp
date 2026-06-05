export function creativityLabel(value: number): string {
  if (value <= 30) return '낮음 — 안정적, 보수적, 직설적'
  if (value <= 70) return '중간 — 균형 잡힌 아이디어와 표현'
  return '높음 — 확장적, 창의적, 대안 제시 강화'
}

export function creativityInstruction(value: number): string {
  if (value <= 30) {
    return '검증된 접근을 우선하고, 보수적이고 직설적으로 작성하세요. 불확실한 추측은 최소화하세요.'
  }
  if (value <= 70) {
    return '실용성과 창의성의 균형을 유지하세요. 핵심은 지키되 적절한 대안을 제시하세요.'
  }
  return '다양한 대안, 확장 아이디어, 비전통적 접근을 적극 제시하세요. 단, 제약 조건은 반드시 준수하세요.'
}
