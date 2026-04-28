export const DAYS_ES = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"]
export const DAYS_FULL_ES = [
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
  "domingo",
]
export const MONTHS_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
]

/** Date key ('YYYY-MM-DD' in local time) for keying maps */
export function dayKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function startOfDay(d: Date): Date {
  const out = new Date(d)
  out.setHours(0, 0, 0, 0)
  return out
}

export function endOfDay(d: Date): Date {
  const out = new Date(d)
  out.setHours(23, 59, 59, 999)
  return out
}

export function addDays(d: Date, n: number): Date {
  const out = new Date(d)
  out.setDate(out.getDate() + n)
  return out
}

export function addMonths(d: Date, n: number): Date {
  const out = new Date(d)
  out.setMonth(out.getMonth() + n)
  return out
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

/** Monday as first day of week — Spanish convention */
export function startOfWeek(d: Date): Date {
  const out = startOfDay(d)
  const dow = (out.getDay() + 6) % 7 // 0=Mon, 6=Sun
  out.setDate(out.getDate() - dow)
  return out
}

export function endOfWeek(d: Date): Date {
  return endOfDay(addDays(startOfWeek(d), 6))
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
}

/** Returns 6×7 = 42 dates covering the month grid (Mon-first) */
export function monthGridDates(d: Date): Date[] {
  const start = startOfWeek(startOfMonth(d))
  const out: Date[] = []
  for (let i = 0; i < 42; i++) out.push(addDays(start, i))
  return out
}

/** Format an ISO range to "9:00 — 10:30" or "9:00" */
export function formatTimeRange(startISO: string, endISO: string | null): string {
  const start = new Date(startISO)
  const startStr = start.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  })
  if (!endISO) return startStr
  const end = new Date(endISO)
  const endStr = end.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  })
  return `${startStr} — ${endStr}`
}

export function formatDay(d: Date): string {
  return d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })
}

export function formatMonthYear(d: Date): string {
  const m = MONTHS_ES[d.getMonth()]
  return `${m.charAt(0).toUpperCase() + m.slice(1)} ${d.getFullYear()}`
}

/** Local-datetime string for <input type="datetime-local"> */
export function toLocalInput(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function fromLocalInput(value: string): Date {
  return new Date(value)
}

/** Decimal hour from 0 to 24 used for vertical positioning in week/day views */
export function hourDecimal(d: Date): number {
  return d.getHours() + d.getMinutes() / 60
}
