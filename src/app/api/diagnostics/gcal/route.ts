import { auth } from "@/lib/auth"
import {
  syncEventToGoogle,
  deleteEventFromGoogle,
  isGoogleCalendarConnected,
} from "@/lib/google-calendar"

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ ok: false, error: "No autorizado" }, { status: 401 })

  const connected = await isGoogleCalendarConnected(session.user.id)
  if (!connected) {
    return Response.json(
      {
        ok: false,
        error:
          "Tu cuenta no tiene Google Calendar conectado. Cierra sesión y vuelve a entrar con Google.",
      },
      { status: 400 }
    )
  }

  const start = new Date(Date.now() + 60 * 60 * 1000) // +1h
  const end = new Date(start.getTime() + 30 * 60 * 1000) // +30 min

  const result = await syncEventToGoogle(session.user.id, {
    id: "diagnostic-test",
    title: "Juristea · prueba de sincronización",
    description:
      "Este evento se ha creado desde la página de diagnóstico de Juristea. Se borrará automáticamente en unos segundos.",
    location: "Diagnóstico",
    startAt: start,
    endAt: end,
    allDay: false,
    gcalEventId: null,
  })

  if ("error" in result) {
    return Response.json({ ok: false, error: result.error }, { status: 500 })
  }

  if (!("gcalEventId" in result) || !result.gcalEventId) {
    return Response.json({ ok: false, error: "No se recibió ID del evento" }, { status: 500 })
  }

  // Best-effort cleanup so we don't pollute the calendar
  await deleteEventFromGoogle(session.user.id, result.gcalEventId).catch(() => {})

  return Response.json({
    ok: true,
    message: "Evento creado y borrado en tu calendario principal",
    detail: `gcalEventId ${result.gcalEventId}`,
  })
}
