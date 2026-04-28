"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  DAYS_ES,
  addMonths,
  dayKey,
  formatMonthYear,
  isSameDay,
  isSameMonth,
  monthGridDates,
} from "./utils"
import type { CalendarItem } from "./types"

export function MiniCalendar({
  cursor,
  onChange,
  items,
}: {
  cursor: Date
  onChange: (d: Date) => void
  items: CalendarItem[]
}) {
  const today = new Date()
  const cells = monthGridDates(cursor)

  const dotsByDay = new Set<string>()
  for (const it of items) {
    dotsByDay.add(dayKey(new Date(it.startAt)))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => onChange(addMonths(cursor, -1))}
          className="w-7 h-7 rounded-md hover:bg-[#F9F9F9] flex items-center justify-center text-[#6B6B6B] hover:text-[#0A0A0A]"
          aria-label="Mes anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-[13px] font-semibold text-[#0A0A0A] capitalize">
          {formatMonthYear(cursor)}
        </span>
        <button
          type="button"
          onClick={() => onChange(addMonths(cursor, 1))}
          className="w-7 h-7 rounded-md hover:bg-[#F9F9F9] flex items-center justify-center text-[#6B6B6B] hover:text-[#0A0A0A]"
          aria-label="Mes siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DAYS_ES.map((d) => (
          <div
            key={d}
            className="text-center jur-mono text-[9px] text-[#A0A0A0] uppercase py-1"
          >
            {d.charAt(0)}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((d, i) => {
          const isOther = !isSameMonth(d, cursor)
          const isToday = isSameDay(d, today)
          const hasDot = dotsByDay.has(dayKey(d))
          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange(d)}
              className={`relative aspect-square rounded-md text-[11.5px] flex items-center justify-center transition-colors ${
                isToday
                  ? "bg-[#B54534] text-white font-medium"
                  : isOther
                    ? "text-[#A0A0A0] hover:bg-[#F9F9F9]"
                    : "text-[#0A0A0A] hover:bg-[#F9F9F9]"
              }`}
            >
              {d.getDate()}
              {hasDot && !isToday && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#B54534]" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
