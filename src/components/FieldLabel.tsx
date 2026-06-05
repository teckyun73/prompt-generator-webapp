type FieldLabelProps = {
  title: string
  hint?: string
  htmlFor?: string
}

export function FieldLabel({ title, hint, htmlFor }: FieldLabelProps) {
  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-slate-800">
        {title}
      </label>
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </div>
  )
}
