"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"
import { Logo } from "@/components/logo"

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="h-8 w-8" />
  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:text-white/90 hover:bg-white/8 transition-colors"
      aria-label="Cambiar tema"
    >
      {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-white/8 bg-[#0C0A09]/85 backdrop-blur-xl">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center text-white">
            <Logo className="h-7" />
          </Link>

          <nav className="hidden items-center gap-7 text-[13px] text-white/50 md:flex">
            <Link href="#como-funciona" className="hover:text-white/90 transition-colors">Cómo funciona</Link>
            <Link href="#pricing" className="hover:text-white/90 transition-colors">Precios</Link>
            <Link href="#faq" className="hover:text-white/90 transition-colors">FAQ</Link>
          </nav>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <Link href="/login" className="text-[13px] text-white/50 hover:text-white/90 transition-colors px-3 py-1.5">
              Acceder
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center h-8 px-4 rounded-lg text-[13px] font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-[0_0_20px_rgba(79,70,229,0.35)]"
            >
              Empieza gratis
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-[#0C0A09] border-t border-white/8">
        <div className="container py-12">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <div className="flex items-center mb-3 text-white">
                <Logo className="h-6" />
              </div>
              <p className="text-sm text-white/40 leading-relaxed max-w-xs">
                Gestión de despachos, expedientes y plazos procesales.
                Integración con LexNET. Para abogados modernos.
              </p>
              <a href="mailto:hola@juristea.com" className="mt-3 block text-sm text-white/40 hover:text-white/70 transition-colors">
                hola@juristea.com
              </a>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 mb-4">Producto</p>
              <div className="flex flex-col gap-2 text-sm text-white/40">
                <Link href="#como-funciona" className="hover:text-white/70 transition-colors w-fit">Cómo funciona</Link>
                <Link href="#pricing" className="hover:text-white/70 transition-colors w-fit">Precios</Link>
                <Link href="#faq" className="hover:text-white/70 transition-colors w-fit">FAQ</Link>
                <Link href="/login" className="hover:text-white/70 transition-colors w-fit">Crear cuenta</Link>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 mb-4">Funciones</p>
              <div className="flex flex-col gap-2 text-sm text-white/40">
                <span>Gestión de expedientes</span>
                <span>Notificaciones LexNET</span>
                <span>Cálculo de plazos</span>
                <span>Control de tiempo</span>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-3 border-t border-white/8 pt-8 text-xs text-white/30 md:flex-row md:justify-between">
            <p>&copy; {new Date().getFullYear()} Juristea. Todos los derechos reservados.</p>
            <div className="flex gap-5">
              <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacidad</Link>
              <Link href="/terms" className="hover:text-white/60 transition-colors">Términos</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
