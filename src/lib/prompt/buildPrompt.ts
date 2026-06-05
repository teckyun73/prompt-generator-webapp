import { creativityInstruction, creativityLabel } from './creativity'
import { getFewShotTemplate } from './fewShotTemplates'
import { formatInstructions } from './formatInstructions'
import { roleForDomain } from './inferDomain'
import { getModelPreset } from './modelPresets'
import type { Analysis, FormState, Technique } from './types'

export function buildPrompt(
  form: FormState,
  analysis: Analysis,
  questions: string[],
  techniques: Technique[],
  resolvedDomain: string,
): string {
  const role = roleForDomain(resolvedDomain)
  const language = form.language || '한국어'
  const modelPreset = getModelPreset(form.modelTarget)

  const mustAskBlock = form.askQuestionsFirst
    ? '- 정보가 부족하거나 모호한 경우, 작업을 시작하기 전에 핵심 질문을 최대 3개까지만 먼저 하세요.\n'
    : '- 정보가 부족한 경우, 필요한 가정을 명시한 뒤 작업을 진행하세요.\n'

  const fewShotTemplate = form.includeExamples ? getFewShotTemplate(form.outputFormat) : null
  const exampleBlock = form.includeExamples
    ? fewShotTemplate
      ? `- 아래 예시 형식을 참고해 출력 톤과 구조를 맞추세요:\n${fewShotTemplate}\n`
      : '- 이해를 돕기 위해 짧은 예시 1개를 함께 제시하세요.\n'
    : ''

  const selfCheckBlock = form.selfCheck
    ? '- 초안 작성 후 누락, 모순, 제약 위반 여부를 자체 점검하고 개선한 뒤 최종본을 제시하세요.\n'
    : ''

  const structureBlock = form.structuredOutput
    ? `- 결과물은 사용자가 바로 붙여넣거나 검토할 수 있도록 명확한 섹션 구조를 사용하세요.\n- 출력 형식 지침: ${formatInstructions(form.outputFormat)}\n`
    : ''

  const stepBlock = form.stepByStep
    ? '1. 사용자의 요청을 한 문장으로 재정의하세요.\n2. 필요한 정보가 충분한지 판단하세요.\n3. 작업을 단계별로 수행하세요.\n4. 마지막에 결과물을 정리해 제시하세요.\n'
    : '1. 사용자의 요청을 정확히 수행하세요.\n'

  const questionsBlock = questions.length
    ? `\n확인이 필요한 사항 (정보가 부족하면 아래를 우선 질문하세요):\n${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n`
    : ''

  const techniquesBlock = techniques.length
    ? `\n적용된 프롬프트 기법:\n${techniques.map((t) => `- ${t.name}: ${t.reason}`).join('\n')}\n`
    : ''

  const fewShotHint = form.includeExamples
    ? '원한다면 답변 중간에 미니 예시를 사용해 형식과 수준을 명확히 맞추세요.'
    : '불필요한 예시는 생략하고 핵심에 집중하세요.'

  return `당신은 ${role}입니다.

목표
- ${analysis.objective}

입력 정보
- 사용자 요청: ${form.brief || '(사용자 요청을 여기에 입력)'}
- 대상 독자/사용자: ${form.audience || '명시되지 않음'}
- 배경 맥락: ${form.context || '추가 맥락이 없으면 필요한 핵심 질문을 먼저 하세요.'}
- 작업 분야: ${resolvedDomain}
- 원하는 출력 형식: ${analysis.expected}
${questionsBlock}
작업 방식
${stepBlock}${mustAskBlock}${structureBlock}${exampleBlock}${selfCheckBlock}- 톤/스타일: ${form.tone}
- 창의성 (${form.creativity}/100): ${creativityLabel(form.creativity)}
- 창의성 지시: ${creativityInstruction(form.creativity)}
- 추가 제약: ${form.constraints || '불필요한 장황함을 줄이고 핵심 위주로 작성하세요.'}
- 모델 타깃: ${modelPreset.label}
- 모델 스타일: ${modelPreset.styleHint}
- 출력 형식 힌트: ${modelPreset.formatHint}
- ${fewShotHint}
${techniquesBlock}
결과물에 반드시 포함할 것
- 요청의 핵심을 반영한 실질적 산출물
- 필요한 경우 전제 또는 가정의 명시
- 사용자가 바로 활용할 수 있는 정리된 형태의 최종본

최종 출력 언어
- ${language}`
}
