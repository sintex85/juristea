"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Save, Trash2 } from "lucide-react"

type ClientData = {
  id?: string
  name: string
  email?: string | null
  phone?: string | null
  nif?: string | null
  address?: string | null
  notes?: string | null
}

export function ClientForm({
  mode,
  initial,
}: {
  mode: "create" | "edit"
  initial?: ClientData
}) {
  const router = useRouter()
  const [data, setData] = useState<ClientData>(
    initial ?? { name: "", email: "", phone: "", nif: "", address: "", notes: "" }
  )
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!data.name.trim()) {
      toast.error("El nombre es obligatorio")
      return
    }
    setLoading(true)
    try {
      const url = mode === "create" ? "/api/clients" : `/api/clients/${data.id}`
      const method = mode === "create" ? "POST" : "PATCH"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email?.trim() || "",
          phone: data.phone?.trim() || null,
          nif: data.nif?.trim() || null,
          address: data.address?.trim() || null,
          notes: data.notes?.trim() || null,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast.error(err?.error?.fieldErrors?.email?.[0] ?? "No se pudo guardar")
        return
      }
      const saved = await res.json()
      toast.success(mode === "create" ? "Cliente creado" : "Cliente actualizado")
      if (mode === "create") {
        router.push(`/dashboard/clients/${saved.id}`)
      } else {
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  async function onDelete() {
    if (!data.id) return
    if (!confirm(`¿Eliminar a ${data.name}? Se borrarán también todos sus expedientes.`)) {
      return
    }
    setDeleting(true)
    try {
      const res = await fetch(`/api/clients/${data.id}`, { method: "DELETE" })
      if (!res.ok) {
        toast.error("No se pudo eliminar")
        return
      }
      toast.success("Cliente eliminado")
      router.push("/dashboard/clients")
      router.refresh()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field
          label="Nombre"
          required
          value={data.name}
          onChange={(v) => setData({ ...data, name: v })}
          placeholder="Juan Ruiz Martínez"
        />
        <Field
          label="NIF / CIF"
          value={data.nif ?? ""}
          onChange={(v) => setData({ ...data, nif: v })}
          mono
          placeholder="48765432A"
        />
        <Field
          label="Email"
          type="email"
          value={data.email ?? ""}
          onChange={(v) => setData({ ...data, email: v })}
          placeholder="cliente@example.com"
        />
        <Field
          label="Teléfono"
          value={data.phone ?? ""}
          onChange={(v) => setData({ ...data, phone: v })}
          placeholder="+34 600 000 000"
        />
      </div>

      <Field
        label="Dirección"
        value={data.address ?? ""}
        onChange={(v) => setData({ ...data, address: v })}
        placeholder="C/ Alcalá 234, 28028 Madrid"
      />

      <div>
        <label className="jur-mono text-[10.5px] text-[#6B6B6B] uppercase tracking-wider">
          Notas internas
        </label>
        <textarea
          value={data.notes ?? ""}
          onChange={(e) => setData({ ...data, notes: e.target.value })}
          rows={4}
          placeholder="Cliente recurrente, prefiere comunicación por WhatsApp…"
          className="mt-1.5 w-full rounded-md border border-[#E5E5E5] bg-white px-3 py-2.5 text-[13.5px] text-[#0A0A0A] placeholder:text-[#A0A0A0] focus:outline-none focus:border-[#B54534] focus:ring-2 focus:ring-[#B54534]/20 resize-y"
        />
      </div>

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#EFEFEF]">
        {mode === "edit" ? (
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting || loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-[12.5px] font-medium text-[#B54534] hover:bg-[#F6E9E5] disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {deleting ? "Eliminando…" : "Eliminar cliente"}
          </button>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={loading || deleting}
          className="jur-btn-solid disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          {loading
            ? "Guardando…"
            : mode === "create"
            ? "Crear cliente"
            : "Guardar cambios"}
        </button>
      </div>
    </form>
  )
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  mono,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
  placeholder?: string
  mono?: boolean
}) {
  return (
    <div>
      <label className="jur-mono text-[10.5px] text-[#6B6B6B] uppercase tracking-wider">
        {label}
        {required && <span className="text-[#B54534] ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className={`mt-1.5 w-full rounded-md border border-[#E5E5E5] bg-white px-3 py-2.5 text-[13.5px] text-[#0A0A0A] placeholder:text-[#A0A0A0] focus:outline-none focus:border-[#B54534] focus:ring-2 focus:ring-[#B54534]/20 ${
          mono ? "jur-mono" : ""
        }`}
      />
    </div>
  )
}
