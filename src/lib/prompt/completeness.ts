import type { FormState } from './types'

export function completeness(form: FormState): number {
  const keys: (keyof FormState)[] = ['brief', 'goal', 'audience', 'context', 'constraints']
  const score = keys.filter((key) => String(form[key] || '').trim().length > 0).length
  return Math.round((score / keys.length) * 100)
}
