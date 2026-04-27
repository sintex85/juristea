"use client"

import { useState } from "react"
import { Pencil, X } from "lucide-react"
import { ClientForm } from "../client-form"

type Client = {
  id: string
  name: string
  email: string | null
  phone: string | null
  nif: string | null
  address: string | null
  notes: string | null
}

export function ClientHeaderActions({ client }: { client: Client }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="jur-btn-solid"
        >
          <Pencil className="w-3.5 h-3.5" />
          Editar cliente
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center pt-16 pb-8 px-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 jur-modal-backdrop"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-[720px] bg-white border border-[#E5E5E5] rounded-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
              <div>
                <div className="jur-mono-label">EDITAR</div>
                <h2 className="jur-serif text-[22px] text-[#0A0A0A] mt-1">
                  {client.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded-md text-[#6B6B6B] hover:text-[#0A0A0A] hover:bg-[#F9F9F9]"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <ClientForm
                mode="edit"
                initial={{
                  id: client.id,
                  name: client.name,
                  email: client.email,
                  phone: client.phone,
                  nif: client.nif,
                  address: client.address,
                  notes: client.notes,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
