import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Wand2,
  Copy,
  RotateCcw,
  Sparkles,
  FileText,
  CheckCircle2,
  HelpCircle,
  Download,
  Gauge,
  Upload,
  Pencil,
  X,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { FieldLabel } from '@/components/FieldLabel'
import { initialForm, presets } from '@/lib/prompt/constants'
import { completeness } from '@/lib/prompt/completeness'
import { buildQuestionMappings } from '@/lib/prompt/buildClarifyingQuestions'
import { creativityLabel } from '@/lib/prompt/creativity'
import { generateAll } from '@/lib/prompt/generateAll'
import type { FormState, QuestionFieldKey } from '@/lib/prompt/types'
import { cn } from '@/lib/utils/cn'
import { copyToClipboard } from '@/lib/utils/clipboard'
import { downloadText } from '@/lib/utils/downloadText'
import { clearFormStorage, loadFormFromStorage, saveFormToStorage } from '@/lib/utils/storage'

const FIELD_IDS: Record<QuestionFieldKey, string> = {
  brief: 'field-brief',
  goal: 'field-goal',
  audience: 'field-audience',
  context: 'field-context',
  constraints: 'field-constraints',
}

const TOGGLE_OPTIONS: { key: keyof FormState; label: string }[] = [
  { key: 'askQuestionsFirst', label: '정보가 부족하면 질문 먼저' },
  { key: 'stepByStep', label: '단계별 지시 포함' },
  { key: 'structuredOutput', label: '구조화된 출력 강제' },
  { key: 'includeExamples', label: '예시 포함' },
  { key: 'selfCheck', label: '자기 검토 포함' },
]

function isFormState(value: unknown): value is FormState {
  if (!value || typeof value !== 'object') return false
  const obj = value as Record<string, unknown>
  return typeof obj.brief === 'string' && typeof obj.goal === 'string' && typeof obj.creativity === 'number'
}

export default function PromptGeneratorWebApp() {
  const [form, setForm] = useState<FormState>(() => loadFormFromStorage() ?? initialForm)
  const [activeTab, setActiveTab] = useState('prompt')
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [isEditingPrompt, setIsEditingPrompt] = useState(false)
  const [customPrompt, setCustomPrompt] = useState<string | null>(null)
  const importInputRef = useRef<HTMLInputElement>(null)

  const fieldRefs = useRef<Record<QuestionFieldKey, HTMLInputElement | HTMLTextAreaElement | null>>({
    brief: null,
    goal: null,
    audience: null,
    context: null,
    constraints: null,
  })

  const result = useMemo(() => generateAll(form), [form])
  const questionMappings = useMemo(() => buildQuestionMappings(form), [form])
  const score = completeness(form)
  const displayPrompt = customPrompt ?? result.prompt

  useEffect(() => {
    saveFormToStorage(form)
  }, [form])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2800)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    setCustomPrompt(null)
    setIsEditingPrompt(false)
  }, [result.prompt])

  const setValue = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const showToast = (message: string) => setToast(message)

  const applyPreset = (preset: (typeof presets)[number]) => {
    setForm({ ...initialForm, ...preset.values })
    setActiveTab('prompt')
    showToast(`"${preset.name}" 예시를 적용했습니다.`)
  }

  const resetAll = () => {
    setForm(initialForm)
    setCustomPrompt(null)
    setIsEditingPrompt(false)
    setActiveTab('prompt')
    clearFormStorage()
    showToast('입력을 초기화했습니다.')
  }

  const copyPrompt = async () => {
    const { ok, message } = await copyToClipboard(displayPrompt)
    setCopied(ok)
    showToast(message)
    if (ok) setTimeout(() => setCopied(false), 1800)
  }

  const exportJson = () => {
    const payload = { version: 1, exportedAt: new Date().toISOString(), form }
    downloadText('prompt-generator-config.json', JSON.stringify(payload, null, 2))
    showToast('설정을 JSON으로보냈습니다.')
  }

  const importJson = async (file: File) => {
    try {
      const text = await file.text()
      const parsed = JSON.parse(text) as { form?: unknown }
      const candidate = parsed.form ?? parsed
      if (!isFormState(candidate)) {
        showToast('올바른 설정 JSON이 아닙니다.')
        return
      }
      setForm({ ...initialForm, ...candidate })
      showToast('설정을 가져왔습니다.')
    } catch {
      showToast('JSON 파싱에 실패했습니다.')
    }
  }

  const focusField = (field: QuestionFieldKey) => {
    const el = fieldRefs.current[field]
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.focus()
  }

  const registerFieldRef =
    (field: QuestionFieldKey) => (el: HTMLInputElement | HTMLTextAreaElement | null) => {
      fieldRefs.current[field] = el
    }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 p-4 md:p-8">
      {toast ? (
        <div
          role="status"
          className="fixed right-4 top-4 z-50 max-w-sm rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-lg"
        >
          {toast}
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="grid gap-6 p-6 md:grid-cols-[1.3fr_0.7fr] md:p-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                <Sparkles className="h-3.5 w-3.5" />
                Prompt Builder Studio
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                  요구를 넣으면, 바로 복사 가능한 프롬프트로 바꿔주는 웹 앱
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
                  사용자 의도 분석, 추가 질문 제안, 최적화된 프롬프트 생성, 사용된 프롬프트 기법 설명까지 한 번에 정리합니다.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  범용 모델 호환
                </Badge>
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  한국어 UI
                </Badge>
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  즉시 복사/다운로드
                </Badge>
              </div>
            </div>

            <Card className="rounded-3xl border-slate-200 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Gauge className="h-4 w-4" />
                  입력 완성도
                </CardTitle>
                <CardDescription>핵심 정보가 많을수록 더 정교한 프롬프트가 생성됩니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">완성도</span>
                    <span className="font-semibold text-slate-900">{score}%</span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
                <div className="grid gap-2 text-sm text-slate-600">
                  {(
                    [
                      ['brief', '요청 설명'],
                      ['goal', '목표 정의'],
                      ['audience', '대상 독자'],
                      ['context', '배경 맥락'],
                      ['constraints', '제약 조건'],
                    ] as const
                  ).map(([key, label]) => (
                    <div key={key} className="flex items-center gap-2">
                      <CheckCircle2 className={cn('h-4 w-4', form[key] ? 'text-emerald-500' : 'text-slate-300')} />
                      {label}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
            <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  요구 입력
                </CardTitle>
                <CardDescription>왼쪽 값을 채우면 오른쪽에서 실시간으로 프롬프트가 생성됩니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <FieldLabel title="빠른 예시" hint="클릭해서 즉시 채우기" />
                  <div className="flex flex-wrap gap-2">
                    {presets.map((preset) => (
                      <Button key={preset.name} type="button" variant="outline" className="rounded-full" onClick={() => applyPreset(preset)}>
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <FieldLabel title="무엇을 만들고 싶은가요?" hint="가장 중요한 입력" htmlFor={FIELD_IDS.brief} />
                    <Textarea
                      id={FIELD_IDS.brief}
                      ref={registerFieldRef('brief')}
                      value={form.brief}
                      onChange={(e) => setValue('brief', e.target.value)}
                      placeholder="예: 스타트업 투자 제안서를 작성하고 싶어 / React로 예약 시스템을 만들고 싶어"
                      className="min-h-[120px] rounded-2xl"
                    />
                  </div>

                  <div>
                    <FieldLabel title="이번 프롬프트의 목표" hint="예: 초안 작성, 구조 설계, 코드 생성" htmlFor={FIELD_IDS.goal} />
                    <Input
                      id={FIELD_IDS.goal}
                      ref={registerFieldRef('goal')}
                      value={form.goal}
                      onChange={(e) => setValue('goal', e.target.value)}
                      placeholder="예: 투자자에게 보여줄 수준의 초안 작성"
                      className="rounded-2xl"
                    />
                  </div>

                  <div>
                    <FieldLabel title="누가 결과물을 사용하나요?" hint="대상 독자 / 사용자" htmlFor={FIELD_IDS.audience} />
                    <Input
                      id={FIELD_IDS.audience}
                      ref={registerFieldRef('audience')}
                      value={form.audience}
                      onChange={(e) => setValue('audience', e.target.value)}
                      placeholder="예: 투자자, 개발자, 일반 독자, 학생"
                      className="rounded-2xl"
                    />
                  </div>

                  <div>
                    <FieldLabel title="배경 정보 / 맥락" hint="참고할 정보, 상황, 기존 자료" htmlFor={FIELD_IDS.context} />
                    <Textarea
                      id={FIELD_IDS.context}
                      ref={registerFieldRef('context')}
                      value={form.context}
                      onChange={(e) => setValue('context', e.target.value)}
                      placeholder="예: 제품은 B2B SaaS이고, 3개월 MVP 일정이며, 경쟁사 2곳이 있음"
                      className="min-h-[100px] rounded-2xl"
                    />
                  </div>

                  <div>
                    <FieldLabel title="반드시 지켜야 할 조건" hint="길이, 금지사항, 포함 요소" htmlFor={FIELD_IDS.constraints} />
                    <Textarea
                      id={FIELD_IDS.constraints}
                      ref={registerFieldRef('constraints')}
                      value={form.constraints}
                      onChange={(e) => setValue('constraints', e.target.value)}
                      placeholder="예: 과장 금지, 표 1개 포함, 800자 내외, 전문적인 톤 유지"
                      className="min-h-[100px] rounded-2xl"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <FieldLabel title="출력 형식" />
                    <Select value={form.outputFormat} onValueChange={(value) => setValue('outputFormat', value as FormState['outputFormat'])}>
                      <SelectTrigger className="rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['구조화된 문서', '블로그 글', '사업계획서', '표 형태', '코드', '이메일', 'JSON', '기타'].map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <FieldLabel title="작업 분야" />
                    <Select value={form.domain} onValueChange={(value) => setValue('domain', value as FormState['domain'])}>
                      <SelectTrigger className="rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['자동 추론', '일반', '개발', '마케팅/콘텐츠', '비즈니스', '연구/분석', '교육'].map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <FieldLabel title="톤" />
                    <Select value={form.tone} onValueChange={(value) => setValue('tone', value as FormState['tone'])}>
                      <SelectTrigger className="rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['전문적', '간결함', '친근함', '설득적', '분석적'].map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <FieldLabel title="출력 언어" />
                    <Select value={form.language} onValueChange={(value) => setValue('language', value as FormState['language'])}>
                      <SelectTrigger className="rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="한국어">한국어</SelectItem>
                        <SelectItem value="영어">영어</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <FieldLabel title="모델 타깃" hint="모델별 지시 스타일 최적화" />
                    <Select value={form.modelTarget} onValueChange={(value) => setValue('modelTarget', value as FormState['modelTarget'])}>
                      <SelectTrigger className="rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['범용', 'GPT', 'Claude', 'Gemini'].map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">창의성</p>
                      <p className="text-xs text-slate-500">수치를 높일수록 확장적 제안이 늘어납니다.</p>
                    </div>
                    <Badge className="rounded-full bg-white text-slate-700 shadow-none hover:bg-white">{form.creativity}</Badge>
                  </div>
                  <Slider value={[form.creativity]} min={0} max={100} step={5} onValueChange={(value) => setValue('creativity', value[0])} />
                  <p className="text-xs text-slate-600">{creativityLabel(form.creativity)}</p>
                </div>

                <div className="grid gap-3 rounded-3xl border border-slate-200 p-4 md:grid-cols-2">
                  {TOGGLE_OPTIONS.map(({ key, label }) => (
                    <label
                      key={key}
                      className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-sm text-slate-700"
                    >
                      <Checkbox checked={form[key] as boolean} onCheckedChange={(checked) => setValue(key, Boolean(checked) as FormState[typeof key])} />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button onClick={copyPrompt} className="rounded-2xl">
                    <Copy className="mr-2 h-4 w-4" />
                    {copied ? '복사됨' : '프롬프트 복사'}
                  </Button>
                  <Button variant="outline" className="rounded-2xl" onClick={() => downloadText('optimized-prompt.txt', displayPrompt)}>
                    <Download className="mr-2 h-4 w-4" />
                    TXT 다운로드
                  </Button>
                  <Button variant="outline" className="rounded-2xl" onClick={exportJson}>
                    <Download className="mr-2 h-4 w-4" />
                    JSON보내기
                  </Button>
                  <Button variant="outline" className="rounded-2xl" onClick={() => importInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    JSON 가져오기
                  </Button>
                  <Button variant="ghost" className="rounded-2xl" onClick={resetAll}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    초기화
                  </Button>
                  <input
                    ref={importInputRef}
                    type="file"
                    accept="application/json,.json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) void importJson(file)
                      e.target.value = ''
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
            <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wand2 className="h-5 w-5" />
                  생성 결과
                </CardTitle>
                <CardDescription>분석 → 추가 질문 → 최적화된 프롬프트 → 사용 기법 순서로 확인할 수 있습니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 rounded-2xl">
                    <TabsTrigger value="analysis">의도 분석</TabsTrigger>
                    <TabsTrigger value="questions">추가 질문</TabsTrigger>
                    <TabsTrigger value="prompt">프롬프트</TabsTrigger>
                    <TabsTrigger value="techniques">기법 설명</TabsTrigger>
                  </TabsList>

                  <TabsContent value="analysis" className="mt-4 space-y-4">
                    <Card className="rounded-3xl border-slate-200 shadow-none">
                      <CardContent className="space-y-4 p-5">
                        {(
                          [
                            ['핵심 목표', result.analysis.objective],
                            ['예상 결과 형태', result.analysis.expected],
                            ['필요 분야', result.analysis.domain],
                            ['조건 / 제약', result.analysis.constraints],
                            ['모호성 판단', result.analysis.ambiguity],
                          ] as const
                        ).map(([label, value]) => (
                          <div key={label}>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
                            <p className="mt-1 text-sm leading-6 text-slate-900">{value}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="questions" className="mt-4 space-y-4">
                    <Card className="rounded-3xl border-slate-200 shadow-none">
                      <CardContent className="p-5">
                        {questionMappings.length ? (
                          <div className="space-y-3">
                            {questionMappings.map((item) => (
                              <button
                                key={`${item.field}-${item.question}`}
                                type="button"
                                onClick={() => focusField(item.field)}
                                className="flex w-full gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-slate-300 hover:bg-white"
                              >
                                <div className="mt-0.5">
                                  <HelpCircle className="h-4 w-4 text-slate-500" />
                                </div>
                                <div>
                                  <p className="text-sm leading-6 text-slate-800">{item.question}</p>
                                  <p className="mt-1 text-xs text-slate-500">클릭하면 해당 입력란으로 이동합니다</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
                            입력 정보가 충분합니다. 추가 질문 없이도 바로 프롬프트를 사용할 수 있습니다.
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="prompt" className="mt-4 space-y-4">
                    <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-slate-50 shadow-sm">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium">복사 가능한 최종 프롬프트</p>
                          <p className="text-xs text-slate-400">
                            약 {result.estimatedTokens.toLocaleString()} 토큰 · 다른 AI 모델에 바로 붙여넣어 사용할 수 있습니다.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="rounded-xl"
                            onClick={() => {
                              if (isEditingPrompt) {
                                setIsEditingPrompt(false)
                              } else {
                                setCustomPrompt(displayPrompt)
                                setIsEditingPrompt(true)
                              }
                            }}
                          >
                            {isEditingPrompt ? <X className="mr-2 h-4 w-4" /> : <Pencil className="mr-2 h-4 w-4" />}
                            {isEditingPrompt ? '편집 종료' : '직접 편집'}
                          </Button>
                          <Button size="sm" variant="secondary" className="rounded-xl" onClick={copyPrompt}>
                            <Copy className="mr-2 h-4 w-4" />
                            {copied ? '복사됨' : '복사'}
                          </Button>
                        </div>
                      </div>
                      {isEditingPrompt ? (
                        <Textarea
                          value={customPrompt ?? ''}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          className="min-h-[360px] rounded-2xl border-slate-700 bg-slate-900 text-slate-100"
                        />
                      ) : (
                        <pre className="overflow-x-auto whitespace-pre-wrap text-sm leading-6 text-slate-100">{displayPrompt}</pre>
                      )}
                      {customPrompt && customPrompt !== result.prompt ? (
                        <p className="mt-3 text-xs text-amber-300">수동 편집된 프롬프트입니다. 입력을 변경하면 자동 생성본으로 되돌아갑니다.</p>
                      ) : null}
                    </div>
                  </TabsContent>

                  <TabsContent value="techniques" className="mt-4 space-y-4">
                    <div className="space-y-3">
                      {result.techniques.map((technique) => (
                        <Card key={technique.name} className="rounded-3xl border-slate-200 shadow-none">
                          <CardContent className="p-5">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge className="rounded-full">{technique.name}</Badge>
                            </div>
                            <p className="mt-3 text-sm font-medium text-slate-900">선택 이유</p>
                            <p className="mt-1 text-sm leading-6 text-slate-700">{technique.reason}</p>
                            <p className="mt-3 text-sm font-medium text-slate-900">기대 효과</p>
                            <p className="mt-1 text-sm leading-6 text-slate-700">{technique.impact}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
