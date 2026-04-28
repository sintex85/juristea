"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Save, Trash2 } from "lucide-react"
import {
  TextField,
  SelectField,
  TextareaField,
  FormErrorBanner,
} from "@/components/ui/form-fields"

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

type FieldErrors = Partial<Record<keyof CaseData, string>>

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

function validate(data: CaseData): FieldErrors {
  const errors: FieldErrors = {}
  if (!data.title.trim()) errors.title = "Pon un título al expediente."
  else if (data.title.trim().length < 3)
    errors.title = "El título es demasiado corto (mínimo 3 caracteres)."
  if (!data.clientId) errors.clientId = "Elige el cliente del expediente."
  return errors
}

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
  const [errors, setErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [touched, setTouched] = useState<Set<keyof CaseData>>(new Set())
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  function update<K extends keyof CaseData>(key: K, value: CaseData[K]) {
    const next = { ...data, [key]: value }
    setData(next)
    if (touched.has(key)) {
      setErrors(validate(next))
    }
    if (serverError) setServerError(null)
  }

  function touch(key: keyof CaseData) {
    setTouched((t) => new Set(t).add(key))
    setErrors(validate(data))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)
    const allErrors = validate(data)
    setErrors(allErrors)
    setTouched(new Set(["title", "clientId"]))

    if (Object.keys(allErrors).length > 0) {
      const first = Object.keys(allErrors)[0]
      const el = document.getElementById(first)
      if (el) el.scrollIntoView({ block: "center", behavior: "smooth" })
      toast.error("Revisa los campos marcados en rojo.")
      return
    }

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

      let res: Response
      try {
        res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } catch (netErr) {
        setServerError(
          netErr instanceof Error
            ? `No hemos podido contactar con el servidor: ${netErr.message}`
            : "No hemos podido contactar con el servidor."
        )
        return
      }

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        const fieldErrs = body?.error?.fieldErrors as Record<string, string[]> | undefined
        if (fieldErrs) {
          const next: FieldErrors = {}
          for (const k of Object.keys(fieldErrs)) {
            next[k as keyof CaseData] = fieldErrs[k]?.[0] ?? "Inválido"
          }
          setErrors(next)
        }
        const message =
          (typeof body?.error === "string" && body.error) ||
          (res.status === 403 && "Has llegado al límite de tu plan.") ||
          (res.status === 404 && "No encontrado.") ||
          (res.status === 401 && "Sesión caducada. Vuelve a iniciar sesión.") ||
          `Error ${res.status} al guardar.`
        setServerError(message)
        return
      }

      const saved = await res.json()
      if (!saved?.id) {
        setServerError("La respuesta del servidor no incluyó el ID del expediente.")
        return
      }
      toast.success(mode === "create" ? "Expediente creado" : "Cambios guardados")
      if (mode === "create") {
        router.push(`/dashboard/cases/${saved.id}`)
      } else {
        router.refresh()
      }
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Error inesperado al guardar el expediente."
      )
    } finally {
      setLoading(false)
    }
  }

  async function onDelete() {
    if (!data.id) return
    if (
      !confirm(
        `¿Eliminar "${data.title}"? Se borrarán también plazos, eventos y documentos asociados.`
      )
    )
      return
    setDeleting(true)
    setServerError(null)
    try {
      const res = await fetch(`/api/cases/${data.id}`, { method: "DELETE" })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setServerError(body?.error ?? "No se pudo eliminar el expediente.")
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
        <a
          href="/dashboard/clients/new"
          className="text-[#B54534] font-medium hover:underline"
        >
          Crear cliente →
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <FormErrorBanner error={serverError} />

      <TextField
        id="title"
        label="Título del expediente"
        required
        value={data.title}
        onChange={(v) => update("title", v)}
        onBlur={() => touch("title")}
        error={errors.title}
        placeholder="Ruiz Martínez c. BBVA — cláusulas abusivas"
        hint="Cómo lo vas a buscar tú dentro del despacho."
      />

      <div className="grid sm:grid-cols-2 gap-5">
        <SelectField
          id="clientId"
          label="Cliente"
          required
          value={data.clientId}
          onChange={(v) => update("clientId", v)}
          onBlur={() => touch("clientId")}
          error={errors.clientId}
          options={clients.map((c) => ({ value: c.id, label: c.name }))}
          placeholder={data.clientId ? undefined : "Selecciona un cliente"}
        />
        <SelectField
          id="jurisdiction"
          label="Jurisdicción"
          value={data.jurisdiction ?? ""}
          onChange={(v) => update("jurisdiction", v)}
          options={[{ value: "", label: "Sin asignar" }, ...JURISDICTIONS]}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <TextField
          id="caseNumber"
          label="Nº de procedimiento"
          value={data.caseNumber ?? ""}
          onChange={(v) => update("caseNumber", v)}
          mono
          placeholder="234/2026"
          hint="Lo asigna el juzgado al repartir el asunto."
        />
        <TextField
          id="nig"
          label="NIG"
          value={data.nig ?? ""}
          onChange={(v) => update("nig", v)}
          mono
          placeholder="28079-42-1-2026-0012345"
          hint="17 cifras separadas por guiones."
        />
      </div>

      <TextField
        id="court"
        label="Juzgado / Tribunal"
        value={data.court ?? ""}
        onChange={(v) => update("court", v)}
        placeholder="Juzgado 1ª Inst. nº 4 Madrid"
      />

      {mode === "edit" && (
        <SelectField
          id="status"
          label="Estado"
          value={data.status ?? "active"}
          onChange={(v) => update("status", v as CaseData["status"])}
          options={STATUSES}
        />
      )}

      <TextareaField
        id="description"
        label="Descripción / notas"
        value={data.description ?? ""}
        onChange={(v) => update("description", v)}
        placeholder="Resumen del asunto, estrategia, documentos clave…"
      />

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
        <button
          type="submit"
          disabled={loading || deleting}
          className="jur-btn-solid disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          {loading
            ? "Guardando…"
            : mode === "create"
            ? "Crear expediente"
            : "Guardar cambios"}
        </button>
      </div>
    </form>
  )
}
