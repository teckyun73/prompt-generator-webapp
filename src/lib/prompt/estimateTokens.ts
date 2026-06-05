export function estimateTokens(text: string): number {
  if (!text) return 0
  const koreanChars = (text.match(/[\uAC00-\uD7AF\u3131-\u318E]/g) || []).length
  const otherChars = text.length - koreanChars
  // Korean ~1.5 chars/token, Latin ~4 chars/token (rough heuristic)
  return Math.ceil(koreanChars / 1.5 + otherChars / 4)
}
