"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalIcon,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"
import type { CalendarItem, CalendarLayer, CalendarView, CaseLite } from "./types"
import { TYPE_COLORS } from "./colors"
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  formatDay,
  formatMonthYear,
  startOfMonth,
  startOfWeek,
} from "./utils"
import { MonthView } from "./month-view"
import { WeekView } from "./week-view"
import { MiniCalendar } from "./mini-calendar"
import { EventModal, type EventModalState } from "./event-modal"

export function Calendar({
  initialItems,
  cases,
  gcalConnected,
}: {
  initialItems: CalendarItem[]
  cases: CaseLite[]
  gcalConnected: boolean
}) {
  const [view, setView] = useState<CalendarView>("week")
  const [cursor, setCursor] = useState(new Date())
  const [layers, setLayers] = useState<Record<CalendarLayer, boolean>>({
    events: true,
    deadlines: true,
  })
  const [items, setItems] = useState<CalendarItem[]>(initialItems)
  const [modal, setModal] = useState<EventModalState>({ mode: "closed" })

  // Refetch when view/cursor changes (broad window so navigation feels instant)
  useEffect(() => {
    let active = true
    async function load() {
      const from = startOfMonth(addMonths(cursor, -1))
      const to = endOfMonth(addMonths(cursor, 1))
      try {
        const params = new URLSearchParams({ from: from.toISOString(), to: to.toISOString() })
        const [eventsRes, deadlinesRes] = await Promise.all([
          fetch(`/api/events?${params}`, { cache: "no-store" }).then((r) => r.json()),
          fetch(`/api/deadlines?${params}`, { cache: "no-store" })
            .then((r) => (r.ok ? r.json() : []))
            .catch(() => []),
        ])
        if (!active) return
        const evItems: CalendarItem[] = (eventsRes ?? []).map((e: Record<string, unknown>) => ({
          id: String(e.id),
          kind: "event" as const,
          title: String(e.title ?? "Evento"),
          type: (e.type as CalendarItem["type"]) ?? "otro",
          startAt: new Date(e.startAt as string).toISOString(),
          endAt: e.endAt ? new Date(e.endAt as string).toISOString() : null,
          allDay: Boolean(e.allDay),
          location: (e.location as string) ?? null,
          description: (e.description as string) ?? null,
          caseId: (e.caseId as string) ?? null,
          caseTitle: (e.caseTitle as string) ?? null,
          completed: Boolean(e.completed),
          whatsappReminder: Boolean(e.whatsappReminder),
          remindMinutesBefore: (e.remindMinutesBefore as number) ?? null,
        }))
        const dlItems: CalendarItem[] = Array.isArray(deadlinesRes)
          ? deadlinesRes.map((d: Record<string, unknown>) => ({
              id: `dl-${d.id}`,
              kind: "deadline" as const,
              title: String(d.title ?? "Plazo"),
              type: "plazo" as const,
              startAt: new Date(d.dueDate as string).toISOString(),
              endAt: null,
              allDay: true,
              location: null,
              description: null,
              caseId: (d.caseId as string) ?? null,
              caseTitle: (d.caseTitle as string) ?? null,
              completed: d.status === "completed",
              whatsappReminder: false,
              remindMinutesBefore: null,
            }))
          : []
        setItems([...evItems, ...dlItems])
      } catch (err) {
        console.error("[calendar] fetch failed", err)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [cursor])

  const visibleItems = useMemo(() => {
    return items.filter((it) => {
      if (it.kind === "event" && !layers.events) return false
      if (it.kind === "deadline" && !layers.deadlines) return false
      return true
    })
  }, [items, layers])

  const headerLabel = useMemo(() => {
    if (view === "day") return formatDay(cursor)
    if (view === "week") {
      const s = startOfWeek(cursor)
      const e = endOfWeek(cursor)
      return `${s.toLocaleDateString("es-ES", { day: "numeric", month: "short" })} – ${e.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}`
    }
    return formatMonthYear(cursor)
  }, [view, cursor])

  function shift(delta: number) {
    if (view === "day") setCursor(addDays(cursor, delta))
    else if (view === "week") setCursor(addDays(cursor, delta * 7))
    else setCursor(addMonths(cursor, delta))
  }

  function openCreate(defaults?: Partial<CalendarItem>) {
    setModal({ mode: "create", defaults })
  }

  return (
    <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-6 flex flex-col h-[calc(100vh-56px)]">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 flex-wrap mb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCursor(new Date())}
            className="px-3 py-2 rounded-md border border-[#E5E5E5] text-[13px] font-medium text-[#0A0A0A] hover:bg-[#F9F9F9]"
          >
            Hoy
          </button>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => shift(-1)}
              className="w-9 h-9 rounded-md hover:bg-[#F9F9F9] flex items-center justify-center text-[#6B6B6B] hover:text-[#0A0A0A]"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => shift(1)}
              className="w-9 h-9 rounded-md hover:bg-[#F9F9F9] flex items-center justify-center text-[#6B6B6B] hover:text-[#0A0A0A]"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <h1 className="jur-serif text-[28px] text-[#0A0A0A] capitalize">
            {headerLabel}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <SyncBadge connected={gcalConnected} />
          <ViewSwitcher value={view} onChange={setView} />
          <button
            type="button"
            onClick={() => openCreate()}
            className="jur-btn-solid"
          >
            <Plus className="w-3.5 h-3.5" /> Nuevo evento
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 min-h-0">
        <aside className="hidden lg:flex flex-col gap-6 min-h-0">
          <button
            type="button"
            onClick={() => openCreate()}
            className="jur-btn-solid w-full justify-center"
          >
            <Plus className="w-3.5 h-3.5" /> Nuevo evento
          </button>

          <MiniCalendar cursor={cursor} onChange={setCursor} items={items} />

          <Layers value={layers} onChange={setLayers} />

          <Legend />
        </aside>

        <div className="flex flex-col min-h-0">
          {view === "month" && (
            <MonthView
              cursor={cursor}
              items={visibleItems}
              onCreate={(d) => openCreate(d)}
              onEdit={(it) => setModal({ mode: "edit", item: it })}
            />
          )}
          {view === "week" && (
            <WeekView
              cursor={cursor}
              items={visibleItems}
              onCreate={(d) => openCreate(d)}
              onEdit={(it) => setModal({ mode: "edit", item: it })}
            />
          )}
          {view === "day" && (
            <WeekView
              cursor={cursor}
              items={visibleItems}
              onCreate={(d) => openCreate(d)}
              onEdit={(it) => setModal({ mode: "edit", item: it })}
              singleDay
            />
          )}
        </div>
      </div>

      <EventModal state={modal} cases={cases} onClose={() => setModal({ mode: "closed" })} />
    </div>
  )
}

function ViewSwitcher({
  value,
  onChange,
}: {
  value: CalendarView
  onChange: (v: CalendarView) => void
}) {
  const opts: { value: CalendarView; label: string }[] = [
    { value: "month", label: "Mes" },
    { value: "week", label: "Semana" },
    { value: "day", label: "Día" },
  ]
  return (
    <div className="inline-flex items-center bg-[#F9F9F9] border border-[#E5E5E5] rounded-md p-0.5">
      {opts.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`px-3 py-1.5 rounded text-[12.5px] font-medium transition-colors ${
            value === o.value
              ? "bg-white text-[#0A0A0A] shadow-[0_1px_0_rgba(0,0,0,0.04),0_2px_6px_rgba(20,30,40,0.05)]"
              : "text-[#6B6B6B] hover:text-[#0A0A0A]"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function SyncBadge({ connected }: { connected: boolean }) {
  if (connected) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11.5px] text-[#10B981] bg-[#E6F5EE] px-2.5 py-1.5 rounded-md">
        <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} />
        Sincronizado con Google Calendar
      </span>
    )
  }
  return (
    <a
      href="/dashboard/settings"
      className="inline-flex items-center gap-1.5 text-[11.5px] text-[#8A5A0B] bg-[#FEF4E2] px-2.5 py-1.5 rounded-md hover:opacity-90"
    >
      <AlertTriangle className="w-3 h-3" />
      Conectar Google Calendar
    </a>
  )
}

function Layers({
  value,
  onChange,
}: {
  value: Record<CalendarLayer, boolean>
  onChange: (v: Record<CalendarLayer, boolean>) => void
}) {
  return (
    <div>
      <div className="jur-mono text-[10.5px] text-[#6B6B6B] uppercase tracking-wider mb-2.5">
        Capas
      </div>
      <ul className="space-y-1.5">
        <Toggle
          checked={value.events}
          onChange={(b) => onChange({ ...value, events: b })}
          color="#1B3A4B"
          label="Eventos"
        />
        <Toggle
          checked={value.deadlines}
          onChange={(b) => onChange({ ...value, deadlines: b })}
          color="#F59E0B"
          label="Plazos procesales"
        />
      </ul>
    </div>
  )
}

function Toggle({
  checked,
  onChange,
  color,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  color: string
  label: string
}) {
  return (
    <li>
      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-3.5 h-3.5"
          style={{ accentColor: color }}
        />
        <span
          className="w-2.5 h-2.5 rounded-sm shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="text-[13px] text-[#0A0A0A]">{label}</span>
      </label>
    </li>
  )
}

function Legend() {
  return (
    <div>
      <div className="jur-mono text-[10.5px] text-[#6B6B6B] uppercase tracking-wider mb-2.5">
        Tipos
      </div>
      <ul className="grid grid-cols-2 gap-x-2 gap-y-1.5">
        {Object.entries(TYPE_COLORS).map(([key, c]) => (
          <li
            key={key}
            className="inline-flex items-center gap-1.5 text-[11.5px] text-[#0A0A0A]"
          >
            <span
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: c.solid }}
            />
            <span className="truncate">{c.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
