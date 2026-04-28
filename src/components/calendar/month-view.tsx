"use client"

import type { CalendarItem } from "./types"
import { colorFor } from "./colors"
import {
  DAYS_ES,
  addDays,
  dayKey,
  isSameDay,
  isSameMonth,
  monthGridDates,
} from "./utils"

const MAX_PER_DAY = 4

export function MonthView({
  cursor,
  items,
  onCreate,
  onEdit,
}: {
  cursor: Date
  items: CalendarItem[]
  onCreate: (defaults: Partial<CalendarItem>) => void
  onEdit: (item: CalendarItem) => void
}) {
  const today = new Date()
  const cells = monthGridDates(cursor)

  // Group items by day key
  const byDay = new Map<string, CalendarItem[]>()
  for (const it of items) {
    const start = new Date(it.startAt)
    const key = dayKey(start)
    if (!byDay.has(key)) byDay.set(key, [])
    byDay.get(key)!.push(it)
  }
  for (const list of byDay.values()) {
    list.sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
  }

  return (
    <div className="flex-1 flex flex-col bg-white border border-[#E5E5E5] rounded-xl overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-[#E5E5E5] bg-[#F9F9F9]">
        {DAYS_ES.map((d) => (
          <div
            key={d}
            className="px-3 py-2 jur-mono text-[10.5px] text-[#6B6B6B] uppercase tracking-wider"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 grid-rows-6 flex-1">
        {cells.map((d, idx) => {
          const isOtherMonth = !isSameMonth(d, cursor)
          const isToday = isSameDay(d, today)
          const list = byDay.get(dayKey(d)) ?? []
          const overflow = Math.max(0, list.length - MAX_PER_DAY)
          const visible = list.slice(0, MAX_PER_DAY)

          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                const start = new Date(d)
                start.setHours(9, 0, 0, 0)
                onCreate({
                  startAt: start.toISOString(),
                  endAt: new Date(start.getTime() + 60 * 60 * 1000).toISOString(),
                  allDay: false,
                })
              }}
              className={`relative text-left p-1.5 border-r border-b border-[#EFEFEF] last:border-r-0 nth-7-r0 group hover:bg-[#FAFAFA] transition-colors ${
                isOtherMonth ? "bg-[#FAFAFA]" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`inline-flex items-center justify-center min-w-[22px] h-[22px] px-1 rounded-full text-[12px] font-medium ${
                    isToday
                      ? "bg-[#B54534] text-white"
                      : isOtherMonth
                        ? "text-[#A0A0A0]"
                        : "text-[#0A0A0A]"
                  }`}
                >
                  {d.getDate()}
                </span>
              </div>
              <ul className="space-y-1">
                {visible.map((it) => {
                  const c = colorFor(it.type)
                  return (
                    <li
                      key={it.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(it)
                      }}
                      className="px-1.5 py-0.5 rounded text-[11px] truncate cursor-pointer hover:opacity-90 transition-opacity"
                      style={{
                        backgroundColor: it.allDay ? c.bg : "transparent",
                        color: it.allDay ? c.text : "#0A0A0A",
                      }}
                      title={it.title}
                    >
                      {!it.allDay && (
                        <span
                          className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                          style={{ backgroundColor: c.solid }}
                        />
                      )}
                      {!it.allDay && (
                        <span className="text-[#6B6B6B] mr-1">
                          {new Date(it.startAt).toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                      <span className={it.completed ? "line-through opacity-60" : ""}>
                        {it.title}
                      </span>
                    </li>
                  )
                })}
                {overflow > 0 && (
                  <li className="px-1.5 text-[10.5px] text-[#6B6B6B] font-medium">
                    +{overflow} más
                  </li>
                )}
              </ul>
            </button>
          )
        })}
      </div>
    </div>
  )
}
