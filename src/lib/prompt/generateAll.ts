import { buildAnalysis } from './buildAnalysis'
import { buildClarifyingQuestions } from './buildClarifyingQuestions'
import { buildPrompt } from './buildPrompt'
import { buildTechniques } from './buildTechniques'
import { estimateTokens } from './estimateTokens'
import { inferDomain } from './inferDomain'
import type { FormState, GenerateResult } from './types'

export function generateAll(form: FormState): GenerateResult {
  const resolvedDomain =
    form.domain === '자동 추론' ? inferDomain(`${form.brief} ${form.goal} ${form.context}`) : form.domain
  const questions = buildClarifyingQuestions(form)
  const techniques = buildTechniques(form, resolvedDomain)
  const analysis = buildAnalysis(form, resolvedDomain, questions)
  const prompt = buildPrompt(form, analysis, questions, techniques, resolvedDomain)

  return {
    analysis,
    questions,
    techniques,
    prompt,
    resolvedDomain,
    estimatedTokens: estimateTokens(prompt),
  }
}
