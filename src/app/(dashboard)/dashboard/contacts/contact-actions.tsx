"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus, X, MessageCircle, Send } from "lucide-react"

const roles = [
  { value: "cliente", label: "Cliente" },
  { value: "contrario", label: "Contrario" },
  { value: "procurador", label: "Procurador" },
  { value: "perito", label: "Perito" },
  { value: "testigo", label: "Testigo" },
  { value: "notario", label: "Notario" },
  { value: "mediador", label: "Mediador" },
  { value: "otro", label: "Otro" },
]

export function ContactActions({
  mode,
  contactId,
  phone,
  name,
}: {
  mode: "add" | "whatsapp"
  contactId?: string
  phone?: string
  name?: string
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  if (mode === "whatsapp") {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-emerald-50 transition-colors text-emerald-600"
          title={`WhatsApp a ${name}`}
        >
          <MessageCircle className="h-4 w-4" />
        </button>

        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">WhatsApp a {name}</h3>
                <button onClick={() => setOpen(false)} className="p-1 rounded-md hover:bg-gray-100">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mb-3">📱 {phone}</p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                placeholder="Escribe tu mensaje..."
              />
              <div className="flex gap-2 mt-4">
                <a
                  href={`https://wa.me/${phone?.replace(/[\s\-\+]/g, "")}?text=${encodeURIComponent(message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-lg bg-emerald-600 text-sm font-bold text-white hover:bg-emerald-500 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Abrir WhatsApp
                </a>
                <button
                  onClick={async () => {
                    if (!message.trim()) return toast.error("Escribe un mensaje")
                    setLoading(true)
                    try {
                      const res = await fetch("/api/whatsapp/send", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ phone, message, contactId }),
                      })
                      if (res.ok) {
                        toast.success("Mensaje enviado por API")
                        setOpen(false)
                        setMessage("")
                      } else {
                        // Fallback to wa.me link
                        toast.info("API no configurada. Usa el botón 'Abrir WhatsApp'")
                      }
                    } catch {
                      toast.error("Error de conexión")
                    } finally {
                      setLoading(false)
                    }
                  }}
                  disabled={loading}
                  className="h-10 px-3 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  title="Enviar vía API"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // Add contact mode
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-500 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Nuevo contacto
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Nuevo contacto</h2>
              <button onClick={() => setOpen(false)} className="p-1 rounded-md hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setLoading(true)
                const form = new FormData(e.currentTarget)
                try {
                  const res = await fetch("/api/contacts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: form.get("name"),
                      role: form.get("role"),
                      email: form.get("email") || undefined,
                      phone: form.get("phone") || undefined,
                      whatsapp: form.get("whatsapp") || undefined,
                      company: form.get("company") || undefined,
                      notes: form.get("notes") || undefined,
                    }),
                  })
                  if (res.ok) {
                    toast.success("Contacto creado")
                    setOpen(false)
                    router.refresh()
                  } else {
                    const err = await res.json()
                    toast.error(err.error || "Error")
                  }
                } catch {
                  toast.error("Error de conexión")
                } finally {
                  setLoading(false)
                }
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Nombre *</label>
                  <input name="name" required className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Rol</label>
                  <select name="role" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {roles.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Email</label>
                  <input name="email" type="email" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Teléfono</label>
                  <input name="phone" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="612 345 678" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">WhatsApp</label>
                  <input name="whatsapp" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="+34 612 345 678" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Empresa</label>
                  <input name="company" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Notas</label>
                <textarea name="notes" rows={2} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              </div>

              <button type="submit" disabled={loading} className="w-full h-10 rounded-lg bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50">
                {loading ? "Creando..." : "Crear contacto"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
