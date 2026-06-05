export type Domain =
  | '자동 추론'
  | '일반'
  | '개발'
  | '마케팅/콘텐츠'
  | '비즈니스'
  | '연구/분석'
  | '교육'

export type OutputFormat =
  | '구조화된 문서'
  | '블로그 글'
  | '사업계획서'
  | '표 형태'
  | '코드'
  | '이메일'
  | 'JSON'
  | '기타'

export type Tone = '전문적' | '간결함' | '친근함' | '설득적' | '분석적'

export type Language = '한국어' | '영어'

export type ModelTarget = '범용' | 'GPT' | 'Claude' | 'Gemini'

export type FormState = {
  brief: string
  goal: string
  audience: string
  context: string
  constraints: string
  outputFormat: OutputFormat
  domain: Domain
  tone: Tone
  language: Language
  modelTarget: ModelTarget
  creativity: number
  askQuestionsFirst: boolean
  includeExamples: boolean
  selfCheck: boolean
  stepByStep: boolean
  structuredOutput: boolean
}

export type Technique = {
  name: string
  reason: string
  impact: string
}

export type Analysis = {
  objective: string
  expected: string
  domain: string
  constraints: string
  ambiguity: string
}

export type GenerateResult = {
  analysis: Analysis
  questions: string[]
  techniques: Technique[]
  prompt: string
  resolvedDomain: string
  estimatedTokens: number
}

export type Preset = {
  name: string
  values: Partial<FormState>
}

export type QuestionFieldKey = 'goal' | 'audience' | 'context' | 'constraints' | 'brief'

export type QuestionMapping = {
  question: string
  field: QuestionFieldKey
}
