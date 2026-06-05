import type { FormState } from '@/lib/prompt/types'

const STORAGE_KEY = 'prompt-generator-form-v1'

export function loadFormFromStorage(): FormState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as FormState
  } catch {
    return null
  }
}

export function saveFormToStorage(form: FormState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
  } catch {
    // storage quota or privacy mode — silently ignore
  }
}

export function clearFormStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
