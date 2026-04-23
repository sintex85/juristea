import { z } from "zod"

/**
 * LexNET ZIP structure:
 * - {lexnetId}_{date}.pdf — The notification document
 * - {lexnetId}_{date}.xml — Metadata (type, court, procedure, etc.)
 *
 * XML metadata fields (cabeceraType):
 * - idMensaje: LexNET message ID
 * - tipoMensaje: notification type
 * - fechaEnvio: send date
 * - asunto: subject
 * - datosEnvio: procedure info, references
 * - organoJudicial: court name
 * - NIG: case identification number
 * - tipoProcedimiento: procedure type
 * - numeroProcedimiento: procedure number + year
 */

export const notificationTypes = [
  "sentencia",
  "providencia",
  "auto",
  "diligencia",
  "emplazamiento",
  "requerimiento",
  "other",
] as const

export type NotificationType = (typeof notificationTypes)[number]

export interface ParsedNotification {
  lexnetId: string | null
  type: NotificationType
  subject: string
  sender: string | null
  receivedAt: Date
  nig: string | null
  caseNumber: string | null
  court: string | null
  jurisdiction: string | null
  procedureType: string | null
  rawXml: string | null
  pdfBuffer: Buffer | null
  pdfFilename: string | null
}

/** Detect notification type from subject/XML content */
export function detectNotificationType(text: string): NotificationType {
  const lower = text.toLowerCase()
  if (lower.includes("sentencia")) return "sentencia"
  if (lower.includes("providencia")) return "providencia"
  if (lower.includes("auto ") || lower.includes("auto,")) return "auto"
  if (lower.includes("diligencia")) return "diligencia"
  if (lower.includes("emplazamiento")) return "emplazamiento"
  if (lower.includes("requerimiento")) return "requerimiento"
  return "other"
}

/** Extract fields from LexNET XML metadata string */
export function parseXmlMetadata(xml: string): Partial<ParsedNotification> {
  const result: Partial<ParsedNotification> = { rawXml: xml }

  // Extract simple XML fields with regex (avoid heavy XML parser dependency)
  const extract = (tag: string): string | null => {
    const match = xml.match(new RegExp(`<${tag}[^>]*>([^<]+)</${tag}>`, "i"))
    return match ? match[1].trim() : null
  }

  result.lexnetId = extract("idMensaje") || extract("idLexnet") || extract("id")
  result.subject = extract("asunto") || extract("subject") || "Sin asunto"
  result.sender = extract("organoJudicial") || extract("origen") || extract("remitente")
  result.nig = extract("NIG") || extract("nig")
  result.court = extract("organoJudicial") || extract("juzgado")
  result.procedureType = extract("tipoProcedimiento")
  result.jurisdiction = extract("jurisdiccion")

  const caseNum = extract("numeroProcedimiento")
  const caseYear = extract("anoProcedimiento") || extract("anyoProcedimiento")
  if (caseNum && caseYear) {
    result.caseNumber = `${caseNum}/${caseYear}`
  } else if (caseNum) {
    result.caseNumber = caseNum
  }

  const dateStr =
    extract("fechaEnvio") || extract("fechaRecepcion") || extract("fecha")
  if (dateStr) {
    const parsed = new Date(dateStr)
    if (!isNaN(parsed.getTime())) {
      result.receivedAt = parsed
    }
  }

  // Detect type from subject/content
  const typeSource = result.subject || xml
  result.type = detectNotificationType(typeSource)

  return result
}

/**
 * Calculate the deadline (plazo) based on notification type.
 *
 * Spanish procedural law deadlines:
 * - Emplazamiento para contestar demanda: 20 días hábiles
 * - Recurso de reposición: 5 días hábiles
 * - Recurso de apelación: 20 días hábiles
 * - Recurso de queja: 10 días hábiles
 * - Providencia (general response): 5 días hábiles
 * - Sentencia (appeal): 20 días hábiles
 * - Auto (recurso reposición): 5 días hábiles
 * - Diligencia de ordenación: 5 días hábiles
 * - Requerimiento: 10 días hábiles
 *
 * Rules:
 * - Only business days count (Mon-Fri)
 * - National + regional holidays excluded (simplified: weekends only for now)
 * - August is non-business for civil jurisdiction
 * - Notification effective: when read, or 3 business days after deposit (art. 162 LEC)
 */
export function calculateDeadline(
  notificationDate: Date,
  type: NotificationType,
  subject?: string
): { dueDate: Date; businessDays: number; title: string } {
  let businessDays = 10 // default
  let title = "Plazo procesal"

  // Detect specific deadlines from type and subject
  const lower = (subject || "").toLowerCase()

  if (type === "emplazamiento" || lower.includes("contestar") || lower.includes("contestación")) {
    businessDays = 20
    title = "Contestación a la demanda"
  } else if (lower.includes("apelación") || lower.includes("apelar")) {
    businessDays = 20
    title = "Recurso de apelación"
  } else if (lower.includes("reposición")) {
    businessDays = 5
    title = "Recurso de reposición"
  } else if (lower.includes("queja")) {
    businessDays = 10
    title = "Recurso de queja"
  } else if (lower.includes("subsanar") || lower.includes("subsanación")) {
    businessDays = 10
    title = "Subsanación"
  } else if (type === "sentencia") {
    businessDays = 20
    title = "Plazo para recurrir sentencia"
  } else if (type === "auto") {
    businessDays = 5
    title = "Recurso contra auto"
  } else if (type === "diligencia") {
    businessDays = 5
    title = "Respuesta a diligencia"
  } else if (type === "requerimiento") {
    businessDays = 10
    title = "Cumplimiento de requerimiento"
  } else if (type === "providencia") {
    businessDays = 5
    title = "Respuesta a providencia"
  }

  // First, add 3 business days for notification to become effective (art. 162 LEC)
  const effectiveDate = addBusinessDays(notificationDate, 3)

  // Then add the actual deadline days
  const dueDate = addBusinessDays(effectiveDate, businessDays)

  return { dueDate, businessDays, title }
}

/** Add N business days to a date (skipping weekends and August for civil) */
export function addBusinessDays(startDate: Date, days: number): Date {
  const result = new Date(startDate)
  let added = 0

  while (added < days) {
    result.setDate(result.getDate() + 1)

    const dayOfWeek = result.getDay()
    const month = result.getMonth() // 0-indexed, August = 7

    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) continue

    // Skip August (civil jurisdiction - simplified assumption)
    if (month === 7) continue

    added++
  }

  return result
}
