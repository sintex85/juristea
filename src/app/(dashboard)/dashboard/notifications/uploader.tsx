"use client"

import { useState, useRef } from "react"
import { Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function LexnetUploader() {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  async function handleUpload(file: File) {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/lexnet-upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Error al subir el archivo")
        return
      }

      toast.success(
        `${data.count} notificacion${data.count !== 1 ? "es" : ""} importada${data.count !== 1 ? "s" : ""}`
      )
      router.refresh()
    } catch {
      toast.error("Error de conexión")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".zip,.xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file)
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-lg bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
      >
        <Upload className="h-4 w-4" />
        {uploading ? "Subiendo..." : "Subir ZIP de LexNET"}
      </button>
    </>
  )
}
