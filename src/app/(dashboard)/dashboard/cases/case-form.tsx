"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Save, Trash2 } from "lucide-react"

type Client = { id: string; name: string }

type CaseData = {
  id?: string
  title: string
  clientId: string
  caseNumber?: string | null
  nig?: string | null
  court?: string | null
  jurisdiction?: string | null
  description?: string | null
  status?: "active" | "archived" | "closed"
}

const JURISDICTIONS = [
  { value: "civil", label: "Civil" },
  { value: "penal", label: "Penal" },
  { value: "social", label: "Social" },
  { value: "mercantil", label: "Mercantil" },
  { value: "contencioso", label: "Contencioso-Administrativo" },
  { value: "familia", label: "Familia" },
  { value: "laboral", label: "Laboral" },
  { value: "fiscal", label: "Fiscal / Tributario" },
  { value: "otro", label: "Otro" },
]

const STATUSES = [
  { value: "active", label: "Activo" },
  { value: "archived", label: "Archivado" },
  { value: "closed", label: "Cerrado" },
]

export function CaseForm({
  mode,
  initial,
  clients,
}: {
  mode: "create" | "edit"
  initial?: CaseData
  clients: Client[]
}) {
  const router = useRouter()
  const [data, setData] = useState<CaseData>(
    initial ?? {
      title: "",
      clientId: clients[0]?.id ?? "",
      caseNumber: "",
      nig: "",
      court: "",
      jurisdiction: "",
      description: "",
      status: "active",
    }
  )
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!data.title.trim()) return toast.error("El título es obligatorio")
    if (!data.clientId) return toast.error("Elige un cliente")

    setLoading(true)
    try {
      const url = mode === "create" ? "/api/cases" : `/api/cases/${data.id}`
      const method = mode === "create" ? "POST" : "PATCH"
      const payload = {
        title: data.title.trim(),
        clientId: data.clientId,
        caseNumber: data.caseNumber?.trim() || null,
        nig: data.nig?.trim() || null,
        court: data.court?.trim() || null,
        jurisdiction: data.jurisdiction?.trim() || null,
        description: data.description?.trim() || null,
        ...(mode === "edit" && { status: data.status }),
      }
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast.error(err?.error ?? "No se pudo guardar")
        return
      }
      const saved = await res.json()
      toast.success(mode === "create" ? "Expediente creado" : "Cambios guardados")
      if (mode === "create") {
        router.push(`/dashboard/cases/${saved.id}`)
      } else {
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  async function onDelete() {
    if (!data.id) return
    if (!confirm(`¿Eliminar "${data.title}"? Se borrarán también plazos, eventos y documentos asociados.`))
      return
    setDeleting(true)
    try {
      const res = await fetch(`/api/cases/${data.id}`, { method: "DELETE" })
      if (!res.ok) {
        toast.error("No se pudo eliminar")
        return
      }
      toast.success("Expediente eliminado")
      router.push("/dashboard/cases")
      router.refresh()
    } finally {
      setDeleting(false)
    }
  }

  if (clients.length === 0) {
    return (
      <div className="text-[14px] text-[#6B6B6B]">
        Antes de abrir un expediente necesitas dar de alta al menos un cliente.{" "}
        <a href="/dashboard/clients/new" className="text-[#B54534] font-medium hover:underline">
          Crear cliente →
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Field
        label="Título del expediente"
        required
        value={data.title}
        onChange={(v) => setData({ ...data, title: v })}
        placeholder="Ruiz Martínez c. BBVA — cláusulas abusivas"
      />

      <div className="grid sm:grid-cols-2 gap-5">
        <Select
          label="Cliente"
          required
          value={data.clientId}
          onChange={(v) => setData({ ...data, clientId: v })}
          options={clients.map((c) => ({ value: c.id, label: c.name }))}
        />
        <Select
          label="Jurisdicción"
          value={data.jurisdiction ?? ""}
          onChange={(v) => setData({ ...data, jurisdiction: v })}
          options={[{ value: "", label: "Sin asignar" }, ...JURISDICTIONS]}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field
          label="Nº de procedimiento"
          value={data.caseNumber ?? ""}
          onChange={(v) => setData({ ...data, caseNumber: v })}
          mono
          placeholder="EXP-2026-0247"
        />
        <Field
          label="NIG"
          value={data.nig ?? ""}
          onChange={(v) => setData({ ...data, nig: v })}
          mono
          placeholder="28079-42-1-2026-0012345"
        />
      </div>

      <Field
        label="Juzgado / Tribunal"
        value={data.court ?? ""}
        onChange={(v) => setData({ ...data, court: v })}
        placeholder="Juzgado 1ª Inst. nº 4 Madrid"
      />

      {mode === "edit" && (
        <Select
          label="Estado"
          value={data.status ?? "active"}
          onChange={(v) => setData({ ...data, status: v as CaseData["status"] })}
          options={STATUSES}
        />
      )}

      <div>
        <label className="jur-mono text-[10.5px] text-[#6B6B6B] uppercase tracking-wider">
          Descripción / notas
        </label>
        <textarea
          value={data.description ?? ""}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          rows={4}
          placeholder="Resumen del asunto, estrategia, documentos clave…"
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
            {deleting ? "Eliminando…" : "Eliminar expediente"}
          </button>
        ) : (
          <span />
        )}
        <button type="submit" disabled={loading || deleting} className="jur-btn-solid disabled:opacity-50">
          <Save className="w-3.5 h-3.5" />
          {loading ? "Guardando…" : mode === "create" ? "Crear expediente" : "Guardar cambios"}
        </button>
      </div>
    </form>
  )
}

function Field({
  label,
  value,
  onChange,
  required,
  placeholder,
  mono,
}: {
  label: string
  value: string
  onChange: (v: string) => void
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
        type="text"
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

function Select({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  required?: boolean
}) {
  return (
    <div>
      <label className="jur-mono text-[10.5px] text-[#6B6B6B] uppercase tracking-wider">
        {label}
        {required && <span className="text-[#B54534] ml-0.5">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-1.5 w-full rounded-md border border-[#E5E5E5] bg-white px-3 py-2.5 text-[13.5px] text-[#0A0A0A] focus:outline-none focus:border-[#B54534] focus:ring-2 focus:ring-[#B54534]/20"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
