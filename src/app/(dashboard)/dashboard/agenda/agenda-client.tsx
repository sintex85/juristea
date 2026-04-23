"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus, X } from "lucide-react"

const eventTypes = [
  { value: "vista", label: "Vista oral" },
  { value: "juicio", label: "Juicio" },
  { value: "reunion", label: "Reunión" },
  { value: "llamada", label: "Llamada" },
  { value: "declaracion", label: "Declaración" },
  { value: "mediacion", label: "Mediación" },
  { value: "otro", label: "Otro" },
]

export function AgendaClient() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const data = {
      title: form.get("title") as string,
      type: form.get("type") as string,
      startAt: form.get("startAt") as string,
      endAt: (form.get("endAt") as string) || undefined,
      location: (form.get("location") as string) || undefined,
      description: (form.get("description") as string) || undefined,
      whatsappReminder: form.get("whatsappReminder") === "on",
    }

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error || "Error al crear evento")
        return
      }

      toast.success("Evento creado")
      setOpen(false)
      router.refresh()
    } catch {
      toast.error("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-500 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Nuevo evento
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Nuevo evento</h2>
          <button onClick={() => setOpen(false)} className="p-1 rounded-md hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Título *</label>
            <input name="title" required className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Vista oral — García vs. López" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Tipo</label>
              <select name="type" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {eventTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Ubicación</label>
              <input name="location" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Juzgado nº 3" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Inicio *</label>
              <input name="startAt" type="datetime-local" required className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Fin</label>
              <input name="endAt" type="datetime-local" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Notas</label>
            <textarea name="description" rows={2} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" placeholder="Llevar documentación original..." />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input name="whatsappReminder" type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            <span className="text-sm text-muted-foreground">Recordatorio por WhatsApp</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-lg bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
          >
            {loading ? "Creando..." : "Crear evento"}
          </button>
        </form>
      </div>
    </div>
  )
}
