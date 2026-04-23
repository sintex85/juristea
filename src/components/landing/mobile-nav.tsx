"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"

const links = [
  { href: "#producto", label: "Producto" },
  { href: "#plazos", label: "Plazos" },
  { href: "#lexnet", label: "Lexnet" },
  { href: "#precios", label: "Precios" },
  { href: "#contacto", label: "Contacto" },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="md:hidden w-9 h-9 flex items-center justify-center rounded border border-[#E5E5E5] text-ink"
        aria-label="Abrir menú"
      >
        {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full md:hidden border-t border-[#E5E5E5] bg-white py-4 px-6 text-[14px] text-[#1a1a1a] space-y-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-1.5"
            >
              {l.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-3">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="btn-ghost border border-[#E5E5E5] flex-1 justify-center"
            >
              Entrar
            </Link>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="btn-solid flex-1 justify-center"
            >
              Empezar
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
