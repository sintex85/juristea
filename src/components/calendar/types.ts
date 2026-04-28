export type EventType =
  | "vista"
  | "juicio"
  | "reunion"
  | "llamada"
  | "plazo"
  | "declaracion"
  | "mediacion"
  | "otro"

export type CalendarItem = {
  id: string
  kind: "event" | "deadline"
  title: string
  type: EventType
  startAt: string // ISO
  endAt: string | null // ISO
  allDay: boolean
  location: string | null
  description: string | null
  caseId: string | null
  caseTitle: string | null
  completed: boolean
  whatsappReminder: boolean
  remindMinutesBefore: number | null
}

export type CaseLite = { id: string; title: string }

export type CalendarLayer = "events" | "deadlines"

export type CalendarView = "month" | "week" | "day"
