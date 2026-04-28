"use client"

import { useEffect, useRef, useState } from "react"
import type { CalendarItem } from "./types"
import { colorFor } from "./colors"
import {
  DAYS_FULL_ES,
  addDays,
  hourDecimal,
  isSameDay,
  startOfWeek,
} from "./utils"

const HOUR_HEIGHT = 56 // pixels per hour
const HOURS = Array.from({ length: 24 }, (_, i) => i)

type Layout = {
  item: CalendarItem
  top: number
  height: number
  column: number
  columnsInGroup: number
}

/** Layout overlapping events into columns within the same day */
function layoutForDay(items: CalendarItem[]): Layout[] {
  if (items.length === 0) return []
  // Sort by start
  const sorted = [...items].sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
  )
  const out: Layout[] = []
  // Greedy column assignment, group by overlap
  let group: { item: CalendarItem; col: number; endTs: number }[] = []
  let groupStartTs = 0

  function flush() {
    if (group.length === 0) return
    const cols = Math.max(...group.map((g) => g.col)) + 1
    for (const g of group) {
      const start = new Date(g.item.startAt)
      const end = g.item.endAt
        ? new Date(g.item.endAt)
        : new Date(start.getTime() + 60 * 60 * 1000)
      const top = (hourDecimal(start)) * HOUR_HEIGHT
      const heightHours = Math.max(0.5, (end.getTime() - start.getTime()) / 3600000)
      out.push({
        item: g.item,
        top,
        height: heightHours * HOUR_HEIGHT - 2,
        column: g.col,
        columnsInGroup: cols,
      })
    }
    group = []
  }

  for (const it of sorted) {
    const start = new Date(it.startAt).getTime()
    const end = it.endAt ? new Date(it.endAt).getTime() : start + 60 * 60 * 1000
    if (group.length === 0) {
      group.push({ item: it, col: 0, endTs: end })
      groupStartTs = start
      continue
    }
    // If this event overlaps the group window
    const groupEnd = Math.max(...group.map((g) => g.endTs))
    if (start < groupEnd) {
      // find first column whose end is <= start
      const usedCols = new Set(group.filter((g) => g.endTs > start).map((g) => g.col))
      let col = 0
      while (usedCols.has(col)) col++
      group.push({ item: it, col, endTs: end })
    } else {
      flush()
      group.push({ item: it, col: 0, endTs: end })
      groupStartTs = start
    }
  }
  flush()
  return out
}

export function WeekView({
  cursor,
  items,
  onCreate,
  onEdit,
  singleDay,
}: {
  cursor: Date
  items: CalendarItem[]
  onCreate: (defaults: Partial<CalendarItem>) => void
  onEdit: (item: CalendarItem) => void
  /** If true, render only the cursor day (Day view) */
  singleDay?: boolean
}) {
  const today = new Date()
  const days = singleDay
    ? [new Date(cursor)]
    : Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(cursor), i))

  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60 * 1000)
    return () => clearInterval(t)
  }, [])

  // Auto-scroll to current hour on mount
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (scrollerRef.current) {
      const targetHour = Math.max(0, Math.min(23, now.getHours() - 1))
      scrollerRef.current.scrollTop = targetHour * HOUR_HEIGHT
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // All-day strip
  const allDayByDay = new Map<number, CalendarItem[]>()
  const timedByDay = new Map<number, CalendarItem[]>()
  for (const it of items) {
    const start = new Date(it.startAt)
    const i = days.findIndex((d) => isSameDay(d, start))
    if (i === -1) continue
    if (it.allDay || it.kind === "deadline") {
      if (!allDayByDay.has(i)) allDayByDay.set(i, [])
      allDayByDay.get(i)!.push(it)
    } else {
      if (!timedByDay.has(i)) timedByDay.set(i, [])
      timedByDay.get(i)!.push(it)
    }
  }

  const cols = days.length

  return (
    <div className="flex-1 flex flex-col bg-white border border-[#E5E5E5] rounded-xl overflow-hidden">
      {/* Day headers */}
      <div
        className="grid border-b border-[#E5E5E5] bg-[#F9F9F9]"
        style={{ gridTemplateColumns: `60px repeat(${cols}, 1fr)` }}
      >
        <div className="px-2 py-3" />
        {days.map((d, i) => {
          const isToday = isSameDay(d, today)
          return (
            <div
              key={i}
              className="px-3 py-2.5 border-l border-[#E5E5E5] text-left"
            >
              <div className="jur-mono text-[10.5px] text-[#6B6B6B] uppercase tracking-wider">
                {DAYS_FULL_ES[(d.getDay() + 6) % 7]}
              </div>
              <div
                className={`mt-1 inline-flex items-center justify-center min-w-[28px] h-[28px] rounded-full text-[14px] font-medium ${
                  isToday ? "bg-[#B54534] text-white" : "text-[#0A0A0A]"
                }`}
              >
                {d.getDate()}
              </div>
            </div>
          )
        })}
      </div>

      {/* All-day strip */}
      {Array.from(allDayByDay.values()).some((l) => l.length > 0) && (
        <div
          className="grid border-b border-[#E5E5E5] bg-white"
          style={{ gridTemplateColumns: `60px repeat(${cols}, 1fr)` }}
        >
          <div className="px-2 py-2 jur-mono text-[10px] text-[#6B6B6B] uppercase tracking-wider">
            todo el día
          </div>
          {days.map((_, i) => {
            const list = allDayByDay.get(i) ?? []
            return (
              <div
                key={i}
                className="border-l border-[#E5E5E5] p-1 flex flex-col gap-1 min-h-[32px]"
              >
                {list.map((it) => {
                  const c = colorFor(it.type)
                  return (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => onEdit(it)}
                      className="text-left rounded px-2 py-1 text-[11px] truncate hover:opacity-90"
                      style={{
                        backgroundColor: c.bg,
                        color: c.text,
                        borderLeft: `3px solid ${c.solid}`,
                      }}
                      title={it.title}
                    >
                      {it.title}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}

      {/* Hour grid */}
      <div ref={scrollerRef} className="flex-1 overflow-y-auto jur-nice-scroll relative">
        <div
          className="grid relative"
          style={{
            gridTemplateColumns: `60px repeat(${cols}, 1fr)`,
            minHeight: `${HOUR_HEIGHT * 24}px`,
          }}
        >
          {/* Hour labels column */}
          <div className="relative">
            {HOURS.map((h) => (
              <div
                key={h}
                style={{ height: HOUR_HEIGHT }}
                className="relative border-b border-[#EFEFEF] pr-2 text-right jur-mono text-[10.5px] text-[#6B6B6B]"
              >
                <span className="absolute -top-2 right-2 bg-white px-1">
                  {h.toString().padStart(2, "0")}:00
                </span>
              </div>
            ))}
          </div>

          {days.map((d, dayIdx) => {
            const isToday = isSameDay(d, today)
            const layout = layoutForDay(timedByDay.get(dayIdx) ?? [])
            return (
              <DayColumn
                key={dayIdx}
                date={d}
                isToday={isToday}
                now={now}
                layout={layout}
                onCreate={onCreate}
                onEdit={onEdit}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

function DayColumn({
  date,
  isToday,
  now,
  layout,
  onCreate,
  onEdit,
}: {
  date: Date
  isToday: boolean
  now: Date
  layout: Layout[]
  onCreate: (defaults: Partial<CalendarItem>) => void
  onEdit: (item: CalendarItem) => void
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [drag, setDrag] = useState<{ y0: number; y1: number } | null>(null)

  function startDrag(e: React.MouseEvent) {
    if (e.button !== 0) return
    const target = e.target as HTMLElement
    if (target.closest("[data-event]")) return // clicking an existing event
    const rect = ref.current!.getBoundingClientRect()
    const y = e.clientY - rect.top
    setDrag({ y0: y, y1: y })
  }

  function moveDrag(e: React.MouseEvent) {
    if (!drag) return
    const rect = ref.current!.getBoundingClientRect()
    setDrag({ y0: drag.y0, y1: e.clientY - rect.top })
  }

  function endDrag() {
    if (!drag) return
    const yMin = Math.min(drag.y0, drag.y1)
    const yMax = Math.max(drag.y0, drag.y1)
    const startHour = Math.max(0, Math.min(23.5, yMin / HOUR_HEIGHT))
    const endHour = Math.max(startHour + 0.25, yMax / HOUR_HEIGHT)
    setDrag(null)

    // Snap to 15min slots
    const snap = (h: number) => Math.round(h * 4) / 4
    const sH = snap(startHour)
    const eH = Math.max(sH + 0.25, snap(endHour))

    const start = new Date(date)
    start.setHours(Math.floor(sH), Math.round((sH - Math.floor(sH)) * 60), 0, 0)
    const end = new Date(date)
    end.setHours(Math.floor(eH), Math.round((eH - Math.floor(eH)) * 60), 0, 0)

    onCreate({
      startAt: start.toISOString(),
      endAt: end.toISOString(),
      allDay: false,
    })
  }

  const dragTop = drag ? Math.min(drag.y0, drag.y1) : 0
  const dragHeight = drag ? Math.abs(drag.y1 - drag.y0) : 0

  // Now indicator position
  const showNow = isToday
  const nowY = (now.getHours() + now.getMinutes() / 60) * HOUR_HEIGHT

  return (
    <div
      ref={ref}
      className="relative border-l border-[#E5E5E5]"
      onMouseDown={startDrag}
      onMouseMove={moveDrag}
      onMouseUp={endDrag}
      onMouseLeave={() => drag && setDrag(null)}
    >
      {/* Hour grid lines */}
      {HOURS.map((h) => (
        <div
          key={h}
          style={{ height: HOUR_HEIGHT }}
          className="border-b border-[#EFEFEF]"
        />
      ))}

      {/* Drag selection */}
      {drag && (
        <div
          className="absolute left-1 right-1 rounded bg-[#B54534]/15 border-2 border-[#B54534] pointer-events-none z-20"
          style={{ top: dragTop, height: dragHeight }}
        />
      )}

      {/* Events */}
      {layout.map((l) => {
        const c = colorFor(l.item.type)
        const widthPercent = 100 / l.columnsInGroup
        const leftPercent = widthPercent * l.column
        const start = new Date(l.item.startAt)
        const end = l.item.endAt
          ? new Date(l.item.endAt)
          : new Date(start.getTime() + 60 * 60 * 1000)
        return (
          <button
            key={l.item.id}
            type="button"
            data-event
            onClick={(e) => {
              e.stopPropagation()
              onEdit(l.item)
            }}
            className="absolute rounded-md text-left overflow-hidden text-[11px] hover:opacity-95 transition-opacity z-10"
            style={{
              top: l.top + 1,
              height: Math.max(20, l.height),
              left: `calc(${leftPercent}% + 2px)`,
              width: `calc(${widthPercent}% - 4px)`,
              backgroundColor: c.bg,
              borderLeft: `3px solid ${c.solid}`,
              color: c.text,
            }}
          >
            <div className="px-2 py-1.5 leading-tight">
              <div
                className={`font-semibold truncate ${l.item.completed ? "line-through opacity-60" : ""}`}
              >
                {l.item.title}
              </div>
              <div className="opacity-75">
                {start.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" — "}
                {end.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </button>
        )
      })}

      {/* Now indicator */}
      {showNow && (
        <div
          className="absolute left-0 right-0 z-30 pointer-events-none"
          style={{ top: nowY }}
        >
          <div className="absolute -left-1 -top-[5px] w-2.5 h-2.5 rounded-full bg-[#B54534]" />
          <div className="h-px bg-[#B54534]" />
        </div>
      )}
    </div>
  )
}
