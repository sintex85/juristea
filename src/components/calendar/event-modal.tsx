"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { X, Save, Trash2, MessageCircle, Briefcase, Loader2 } from "lucide-react"
import {
  TextField,
  TextareaField,
  SelectField,
  FormErrorBanner,
} from "@/components/ui/form-fields"
import type { CalendarItem, CaseLite, EventType } from "./types"
import { colorFor } from "./colors"
import { toLocalInput } from "./utils"

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: "vista", label: "Vista" },
  { value: "juicio", label: "Juicio" },
  { value: "reunion", label: "Reunión" },
  { value: "llamada", label: "Llamada" },
  { value: "plazo", label: "Plazo" },
  { value: "declaracion", label: "Declaración" },
  { value: "mediacion", label: "Mediación" },
  { value: "otro", label: "Otro" },
]

export type EventModalState =
  | { mode: "closed" }
  | { mode: "create"; defaults?: Partial<CalendarItem> }
  | { mode: "edit"; item: CalendarItem }

export function EventModal({
  state,
  cases,
  onClose,
}: {
  state: EventModalState
  cases: CaseLite[]
  onClose: () => void
}) {
  if (state.mode === "closed") return null
  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center pt-12 pb-12 px-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 jur-modal-backdrop" onClick={onClose} />
      <EventForm state={state} cases={cases} onClose={onClose} />
    </div>
  )
}

function EventForm({
  state,
  cases,
  onClose,
}: {
  state: Exclude<EventModalState, { mode: "closed" }>
  cases: CaseLite[]
  onClose: () => void
}) {
  const router = useRouter()
  const isEdit = state.mode === "edit"
  const seed = isEdit
    ? state.item
    : ({
        id: "",
        kind: "event" as const,
        title: "",
        type: "reunion" as EventType,
        startAt: state.defaults?.startAt ?? new Date().toISOString(),
        endAt: state.defaults?.endAt ?? null,
        allDay: state.defaults?.allDay ?? false,
        location: state.defaults?.location ?? null,
        description: state.defaults?.description ?? null,
        caseId: state.defaults?.caseId ?? null,
        caseTitle: null,
        completed: false,
        whatsappReminder: false,
        remindMinutesBefore: 60,
      } as CalendarItem)

  const [title, setTitle] = useState(seed.title)
  const [type, setType] = useState<EventType>(seed.type)
  const [allDay, setAllDay] = useState(seed.allDay)
  const [startAt, setStartAt] = useState(seed.startAt)
  const [endAt, setEndAt] = useState(
    seed.endAt ?? new Date(new Date(seed.startAt).getTime() + 60 * 60 * 1000).toISOString()
  )
  const [location, setLocation] = useState(seed.location ?? "")
  const [description, setDescription] = useState(seed.description ?? "")
  const [caseId, setCaseId] = useState(seed.caseId ?? "")
  const [reminder, setReminder] = useState<string>(
    String(seed.remindMinutesBefore ?? 60)
  )
  const [whatsapp, setWhatsapp] = useState(seed.whatsappReminder)
  const [error, setError] = useState<string | null>(null)
  const [titleError, setTitleError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // ESC closes modal
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const accent = colorFor(type)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setTitleError(null)

    if (!title.trim()) {
      setTitleError("Pon un título al evento.")
      return
    }
    const start = new Date(startAt)
    let end: Date | null = endAt ? new Date(endAt) : null
    if (end && end.getTime() <= start.getTime()) {
      end = new Date(start.getTime() + 60 * 60 * 1000)
    }

    setSaving(true)
    try {
      const url = isEdit ? `/api/events/${seed.id}` : "/api/events"
      const method = isEdit ? "PATCH" : "POST"
      const payload = {
        title: title.trim(),
        type,
        allDay,
        startAt: start.toISOString(),
        endAt: end ? end.toISOString() : null,
        location: location.trim() || null,
        description: description.trim() || null,
        caseId: caseId || null,
        remindMinutesBefore: reminder ? Number(reminder) : null,
        whatsappReminder: whatsapp,
      }
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        const fields = body?.error?.fieldErrors as Record<string, string[]> | undefined
        const summary = fields
          ? Object.entries(fields)
              .map(([k, v]) => `${k}: ${v?.[0] ?? "Inválido"}`)
              .join(" · ")
          : null
        setError(
          (typeof body?.error === "string" && body.error) ||
            summary ||
            `Error ${res.status} al guardar.`
        )
        return
      }
      toast.success(isEdit ? "Evento actualizado" : "Evento creado")
      onClose()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado")
    } finally {
      setSaving(false)
    }
  }

  async function onDelete() {
    if (!isEdit) return
    if (!confirm(`¿Eliminar "${seed.title}"?`)) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/events/${seed.id}`, { method: "DELETE" })
      if (!res.ok) {
        setError("No se pudo eliminar")
        return
      }
      toast.success("Evento eliminado")
      onClose()
      router.refresh()
    } finally {
      setDeleting(false)
    }
  }

  // Plazo (deadline) is read-only for now in this modal
  const isDeadline = isEdit && state.item.kind === "deadline"

  return (
    <div className="relative w-full max-w-[680px] bg-white border border-[#E5E5E5] rounded-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)] overflow-hidden">
      <div
        className="h-1.5"
        style={{ backgroundColor: accent.solid }}
      />
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
        <div>
          <div className="jur-mono-label">{isEdit ? "EDITAR EVENTO" : "NUEVO EVENTO"}</div>
          <h2 className="jur-serif text-[22px] text-[#0A0A0A] mt-1">
            {isDeadline ? "Plazo procesal" : isEdit ? title || "—" : "Programa un evento"}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md text-[#6B6B6B] hover:text-[#0A0A0A] hover:bg-[#F9F9F9]"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {isDeadline ? (
        <div className="p-6 space-y-3 text-[14px] text-[#0A0A0A]">
          <p>
            Los plazos se gestionan desde la sección{" "}
            <a href="/dashboard/deadlines" className="text-[#B54534] font-medium">
              Plazos
            </a>
            . Aquí solo aparecen para que los veas en la agenda.
          </p>
          <div className="rounded-md bg-[#FEF4E2] border border-[#F59E0B]/30 px-4 py-3 text-[13px] text-[#8A5A0B]">
            <div className="font-semibold">{state.item.title}</div>
            {state.item.caseTitle && (
              <div className="text-[12px] mt-1 opacity-80">{state.item.caseTitle}</div>
            )}
            <div className="mt-2 text-[12px] opacity-80">
              Vence el{" "}
              {new Date(state.item.startAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="p-6 space-y-5" noValidate>
          <FormErrorBanner error={error} />

          <TextField
            id="event-title"
            label="Título"
            required
            value={title}
            onChange={setTitle}
            onBlur={() => {
              if (!title.trim()) setTitleError("Pon un título al evento.")
              else setTitleError(null)
            }}
            error={titleError}
            placeholder="Vista oral · Ruiz c. BBVA"
          />

          <div className="grid grid-cols-2 gap-5">
            <SelectField
              id="event-type"
              label="Tipo"
              value={type}
              onChange={(v) => setType(v as EventType)}
              options={EVENT_TYPES}
            />
            <SelectField
              id="event-case"
              label="Expediente"
              value={caseId}
              onChange={setCaseId}
              options={[
                { value: "", label: "Sin expediente" },
                ...cases.map((c) => ({ value: c.id, label: c.title })),
              ]}
            />
          </div>

          <label className="inline-flex items-center gap-2.5 select-none cursor-pointer">
            <input
              type="checkbox"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              className="w-4 h-4 accent-[#B54534]"
            />
            <span className="text-[13.5px] text-[#0A0A0A] font-medium">Todo el día</span>
          </label>

          <div className="grid grid-cols-2 gap-5">
            <DateTimeInput
              id="event-start"
              label={allDay ? "Fecha" : "Inicio"}
              value={toLocalInput(startAt)}
              onChange={(v) => setStartAt(new Date(v).toISOString())}
              type={allDay ? "date" : "datetime-local"}
              required
            />
            {!allDay && (
              <DateTimeInput
                id="event-end"
                label="Fin"
                value={toLocalInput(endAt)}
                onChange={(v) => setEndAt(new Date(v).toISOString())}
                type="datetime-local"
              />
            )}
          </div>

          <TextField
            id="event-location"
            label="Lugar"
            value={location}
            onChange={setLocation}
            placeholder="Juzgado nº 4 Madrid · Sala 3"
          />

          <TextareaField
            id="event-description"
            label="Notas"
            value={description}
            onChange={setDescription}
            placeholder="Llevar copia compulsada del contrato y documental aportada por el contrario."
            rows={3}
          />

          <div className="grid grid-cols-2 gap-5 pt-2 border-t border-[#EFEFEF]">
            <SelectField
              id="event-reminder"
              label="Recordatorio"
              value={reminder}
              onChange={setReminder}
              options={[
                { value: "", label: "Sin recordatorio" },
                { value: "5", label: "5 minutos antes" },
                { value: "15", label: "15 minutos antes" },
                { value: "30", label: "30 minutos antes" },
                { value: "60", label: "1 hora antes" },
                { value: "120", label: "2 horas antes" },
                { value: "1440", label: "1 día antes" },
                { value: "2880", label: "2 días antes" },
                { value: "10080", label: "1 semana antes" },
              ]}
            />
            <label className="flex items-end pb-2.5">
              <span className="inline-flex items-center gap-2.5 select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.checked)}
                  className="w-4 h-4 accent-[#10B981]"
                />
                <span className="text-[13.5px] text-[#0A0A0A] font-medium inline-flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-[#10B981]" />
                  Aviso por WhatsApp
                </span>
              </span>
            </label>
          </div>

          {seed.caseTitle && !isEdit && (
            <div className="text-[12.5px] text-[#6B6B6B] inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[#F9F9F9] border border-[#E5E5E5]">
              <Briefcase className="w-3.5 h-3.5 text-[#B54534]" />
              {seed.caseTitle}
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#EFEFEF]">
            {isEdit ? (
              <button
                type="button"
                onClick={onDelete}
                disabled={saving || deleting}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-[12.5px] font-medium text-[#B54534] hover:bg-[#F6E9E5] disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {deleting ? "Eliminando…" : "Eliminar evento"}
              </button>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="jur-btn-ghost"
                disabled={saving || deleting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving || deleting}
                className="jur-btn-solid disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {isEdit ? "Guardar cambios" : "Crear evento"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

function DateTimeInput({
  id,
  label,
  value,
  onChange,
  type = "datetime-local",
  required,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  type?: "datetime-local" | "date"
  required?: boolean
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="jur-mono text-[10.5px] text-[#6B6B6B] uppercase tracking-wider"
      >
        {label}
        {required && <span className="text-[#B54534] ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-1.5 w-full rounded-md border border-[#E5E5E5] bg-white px-3 py-2.5 text-[13.5px] text-[#0A0A0A] focus:outline-none focus:border-[#B54534] focus:ring-2 focus:ring-[#B54534]/20"
      />
    </div>
  )
}
