"use client"

import { AlertCircle } from "lucide-react"

type BaseProps = {
  label: string
  required?: boolean
  error?: string | null
  hint?: string
  className?: string
}

export function FieldLabel({
  label,
  required,
  htmlFor,
}: {
  label: string
  required?: boolean
  htmlFor?: string
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="jur-mono text-[10.5px] text-[#6B6B6B] uppercase tracking-wider"
    >
      {label}
      {required && <span className="text-[#B54534] ml-0.5">*</span>}
    </label>
  )
}

export function FieldError({ error }: { error?: string | null }) {
  if (!error) return null
  return (
    <p className="mt-1.5 text-[12px] text-[#B54534] font-medium flex items-center gap-1">
      <AlertCircle className="w-3 h-3 shrink-0" />
      {error}
    </p>
  )
}

export function TextField({
  id,
  label,
  required,
  error,
  hint,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  mono,
  className = "",
}: BaseProps & {
  id?: string
  type?: string
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  placeholder?: string
  mono?: boolean
}) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-")
  return (
    <div className={className}>
      <FieldLabel label={label} required={required} htmlFor={fieldId} />
      <input
        id={fieldId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={`mt-1.5 w-full rounded-md border bg-white px-3 py-2.5 text-[13.5px] text-[#0A0A0A] placeholder:text-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#B54534]/20 ${
          error
            ? "border-[#B54534] focus:border-[#B54534]"
            : "border-[#E5E5E5] focus:border-[#B54534]"
        } ${mono ? "jur-mono" : ""}`}
      />
      {hint && !error && (
        <p className="mt-1 text-[11px] text-[#6B6B6B]">{hint}</p>
      )}
      <FieldError error={error} />
    </div>
  )
}

export function SelectField({
  id,
  label,
  required,
  error,
  hint,
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  className = "",
}: BaseProps & {
  id?: string
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  options: { value: string; label: string }[]
  placeholder?: string
}) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-")
  return (
    <div className={className}>
      <FieldLabel label={label} required={required} htmlFor={fieldId} />
      <select
        id={fieldId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={`mt-1.5 w-full rounded-md border bg-white px-3 py-2.5 text-[13.5px] text-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-[#B54534]/20 ${
          error
            ? "border-[#B54534] focus:border-[#B54534]"
            : "border-[#E5E5E5] focus:border-[#B54534]"
        }`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && !error && (
        <p className="mt-1 text-[11px] text-[#6B6B6B]">{hint}</p>
      )}
      <FieldError error={error} />
    </div>
  )
}

export function TextareaField({
  id,
  label,
  required,
  error,
  hint,
  value,
  onChange,
  onBlur,
  placeholder,
  rows = 4,
  className = "",
}: BaseProps & {
  id?: string
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  placeholder?: string
  rows?: number
}) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-")
  return (
    <div className={className}>
      <FieldLabel label={label} required={required} htmlFor={fieldId} />
      <textarea
        id={fieldId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={`mt-1.5 w-full rounded-md border bg-white px-3 py-2.5 text-[13.5px] text-[#0A0A0A] placeholder:text-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#B54534]/20 resize-y ${
          error
            ? "border-[#B54534] focus:border-[#B54534]"
            : "border-[#E5E5E5] focus:border-[#B54534]"
        }`}
      />
      {hint && !error && (
        <p className="mt-1 text-[11px] text-[#6B6B6B]">{hint}</p>
      )}
      <FieldError error={error} />
    </div>
  )
}

export function FormErrorBanner({ error }: { error?: string | null }) {
  if (!error) return null
  return (
    <div
      role="alert"
      className="rounded-lg bg-[#F6E9E5] border border-[#B54534]/20 px-4 py-3 flex items-start gap-2.5"
    >
      <AlertCircle className="w-4 h-4 text-[#B54534] shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] text-[#8A2F22] font-medium">No se ha podido guardar</div>
        <div className="text-[12.5px] text-[#8A2F22]/85 mt-0.5">{error}</div>
      </div>
    </div>
  )
}
