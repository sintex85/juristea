"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Save, Trash2 } from "lucide-react"
import {
  TextField,
  TextareaField,
  FormErrorBanner,
} from "@/components/ui/form-fields"

type ClientData = {
  id?: string
  name: string
  email?: string | null
  phone?: string | null
  nif?: string | null
  address?: string | null
  notes?: string | null
}

type FieldErrors = Partial<Record<keyof ClientData, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(data: ClientData): FieldErrors {
  const errors: FieldErrors = {}
  if (!data.name.trim()) errors.name = "Indica el nombre del cliente."
  else if (data.name.trim().length < 2)
    errors.name = "El nombre es demasiado corto."
  const email = data.email?.trim()
  if (email && !EMAIL_RE.test(email)) errors.email = "Ese email no parece válido."
  return errors
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
  const [errors, setErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [touched, setTouched] = useState<Set<keyof ClientData>>(new Set())
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  function update<K extends keyof ClientData>(key: K, value: ClientData[K]) {
    const next = { ...data, [key]: value }
    setData(next)
    if (touched.has(key)) setErrors(validate(next))
    if (serverError) setServerError(null)
  }
  function touch(key: keyof ClientData) {
    setTouched((t) => new Set(t).add(key))
    setErrors(validate(data))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)
    const allErrors = validate(data)
    setErrors(allErrors)
    setTouched(new Set(["name", "email"]))
    if (Object.keys(allErrors).length > 0) {
      const first = Object.keys(allErrors)[0]
      const el = document.getElementById(first)
      if (el) el.scrollIntoView({ block: "center", behavior: "smooth" })
      toast.error("Revisa los campos marcados en rojo.")
      return
    }
    setLoading(true)
    try {
      const url = mode === "create" ? "/api/clients" : `/api/clients/${data.id}`
      const method = mode === "create" ? "POST" : "PATCH"

      let res: Response
      try {
        res = await fetch(url, {
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
            next[k as keyof ClientData] = fieldErrs[k]?.[0] ?? "Inválido"
          }
          setErrors(next)
        }
        const message =
          (typeof body?.error === "string" && body.error) ||
          (res.status === 401 && "Sesión caducada. Vuelve a iniciar sesión.") ||
          `Error ${res.status} al guardar.`
        setServerError(message)
        return
      }

      const saved = await res.json()
      if (!saved?.id) {
        setServerError("La respuesta del servidor no incluyó el ID del cliente.")
        return
      }
      toast.success(mode === "create" ? "Cliente creado" : "Cambios guardados")
      if (mode === "create") {
        router.push(`/dashboard/clients/${saved.id}`)
      } else {
        router.refresh()
      }
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Error inesperado al guardar el cliente."
      )
    } finally {
      setLoading(false)
    }
  }

  async function onDelete() {
    if (!data.id) return
    if (
      !confirm(
        `¿Eliminar a ${data.name}? Se borrarán también todos sus expedientes.`
      )
    )
      return
    setDeleting(true)
    setServerError(null)
    try {
      const res = await fetch(`/api/clients/${data.id}`, { method: "DELETE" })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setServerError(body?.error ?? "No se pudo eliminar el cliente.")
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
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <FormErrorBanner error={serverError} />

      <div className="grid sm:grid-cols-2 gap-5">
        <TextField
          id="name"
          label="Nombre"
          required
          value={data.name}
          onChange={(v) => update("name", v)}
          onBlur={() => touch("name")}
          error={errors.name}
          placeholder="Juan Ruiz Martínez"
        />
        <TextField
          id="nif"
          label="NIF / CIF"
          value={data.nif ?? ""}
          onChange={(v) => update("nif", v)}
          mono
          placeholder="48765432A"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <TextField
          id="email"
          label="Email"
          type="email"
          value={data.email ?? ""}
          onChange={(v) => update("email", v)}
          onBlur={() => touch("email")}
          error={errors.email}
          placeholder="cliente@example.com"
        />
        <TextField
          id="phone"
          label="Teléfono"
          value={data.phone ?? ""}
          onChange={(v) => update("phone", v)}
          placeholder="+34 600 000 000"
        />
      </div>

      <TextField
        id="address"
        label="Dirección"
        value={data.address ?? ""}
        onChange={(v) => update("address", v)}
        placeholder="C/ Alcalá 234, 28028 Madrid"
      />

      <TextareaField
        id="notes"
        label="Notas internas"
        value={data.notes ?? ""}
        onChange={(v) => update("notes", v)}
        placeholder="Cliente recurrente, prefiere comunicación por WhatsApp…"
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
