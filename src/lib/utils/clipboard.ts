function fallbackCopy(text: string): boolean {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  const ok = document.execCommand('copy')
  document.body.removeChild(textarea)
  return ok
}

export async function copyToClipboard(text: string): Promise<{ ok: boolean; message: string }> {
  try {
    await navigator.clipboard.writeText(text)
    return { ok: true, message: '클립보드에 복사했습니다.' }
  } catch {
    const ok = fallbackCopy(text)
    return ok
      ? { ok: true, message: '클립보드에 복사했습니다. (대체 방식)' }
      : { ok: false, message: '복사에 실패했습니다. 프롬프트를 직접 선택해 복사해 주세요.' }
  }
}
