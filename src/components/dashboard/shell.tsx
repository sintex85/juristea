"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  Menu,
  X,
  Search,
  Bell,
  Plus,
  ArrowRight,
  AlertTriangle,
  Inbox,
  Euro,
  CornerDownLeft,
  Folder,
  User,
  CalendarClock,
  Receipt,
} from "lucide-react"
import { Sidebar } from "./sidebar"
import type { UserWithSubscription } from "@/types"

export function DashboardShell({
  user,
  children,
}: {
  user: UserWithSubscription
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const mainRef = useRef<HTMLElement | null>(null)
  const bellBtnRef = useRef<HTMLButtonElement | null>(null)
  const bellPopRef = useRef<HTMLDivElement | null>(null)

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase()

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === "Escape") setSearchOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (!bellOpen) return
    const onClick = (e: MouseEvent) => {
      if (
        bellPopRef.current?.contains(e.target as Node) ||
        bellBtnRef.current?.contains(e.target as Node)
      ) {
        return
      }
      setBellOpen(false)
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [bellOpen])

  const breadcrumb = crumbFromPath(pathname)

  return (
    <div className="flex min-h-screen bg-white">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar
          user={{
            name: user.name,
            email: user.email,
            initials,
            firmName: "González & Asociados",
            firmMeta: "MADRID · 5 letrados",
          }}
        />
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/30 z-50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 left-0 z-[55]">
            <Sidebar
              user={{
                name: user.name,
                email: user.email,
                initials,
                firmName: "González & Asociados",
                firmMeta: "MADRID · 5 letrados",
              }}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header
          className={`jur-topbar-blur sticky top-0 z-40 bg-white border-b border-[#E5E5E5] ${
            scrolled ? "is-scrolled" : ""
          }`}
        >
          <div className="h-[56px] flex items-center gap-4 px-6 lg:px-12">
            <button
              type="button"
              className="lg:hidden w-9 h-9 rounded-md border border-[#E5E5E5] flex items-center justify-center"
              aria-label="Abrir menú"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="hidden md:flex items-center gap-1.5 jur-mono text-[11px] text-[#6B6B6B]">
              {breadcrumb.map((c, i) => (
                <span key={i}>
                  {i > 0 && <span className="mx-1 text-[#A0A0A0]">·</span>}
                  {c}
                </span>
              ))}
            </div>

            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-[520px]">
                <Search className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar expediente, cliente, NIG…"
                  className="jur-search-input jur-ring-focus"
                  onFocus={() => setSearchOpen(true)}
                  readOnly
                  aria-label="Búsqueda global"
                />
                <span className="jur-kbd absolute right-3 top-1/2 -translate-y-1/2">⌘K</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  ref={bellBtnRef}
                  type="button"
                  className="w-9 h-9 rounded-md hover:bg-[#F9F9F9] flex items-center justify-center relative jur-ring-focus"
                  aria-label="Notificaciones"
                  onClick={(e) => {
                    e.stopPropagation()
                    setBellOpen((v) => !v)
                  }}
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#B54534]" />
                </button>
                {bellOpen && (
                  <div
                    ref={bellPopRef}
                    className="absolute right-0 mt-2 w-[340px] bg-white border border-[#E5E5E5] rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] p-3 z-40"
                  >
                    <div className="flex items-center justify-between px-2 pb-2">
                      <div className="text-[13px] font-medium">Notificaciones</div>
                      <button className="jur-mono text-[10.5px] text-[#6B6B6B] hover:text-[#0A0A0A]">
                        Marcar leídas
                      </button>
                    </div>
                    <ul className="divide-y divide-[#EFEFEF]">
                      <NotifItem
                        icon={<AlertTriangle className="w-3.5 h-3.5" />}
                        iconBg="bg-[#F6E9E5] text-[#B54534]"
                        title={
                          <>
                            Plazo <span className="font-medium">Contestación demanda</span>{" "}
                            vence hoy
                          </>
                        }
                        meta="EXP-2026-0247 · hace 12 min"
                      />
                      <NotifItem
                        icon={<Inbox className="w-3.5 h-3.5" />}
                        iconBg="bg-[#F9F9F9] text-[#0A0A0A]"
                        title="3 nuevas notificaciones en Lexnet"
                        meta="hace 38 min"
                      />
                      <NotifItem
                        icon={<Euro className="w-3.5 h-3.5" />}
                        iconBg="bg-[#F9F9F9] text-[#0A0A0A]"
                        title={
                          <>
                            Minuta <span className="font-medium">MIN-2026-0082</span> ha sido
                            pagada
                          </>
                        }
                        meta="2.400 € · hace 1 h"
                      />
                    </ul>
                    <button className="mt-2 w-full text-center text-[12.5px] text-[#1a1a1a] hover:bg-[#F9F9F9] py-2 rounded-md">
                      Ver todas
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="jur-btn-solid jur-ring-focus"
                onClick={() => router.push("/dashboard/cases")}
              >
                <Plus className="w-3.5 h-3.5" /> Nuevo expediente{" "}
                <ArrowRight className="w-3.5 h-3.5 arr" />
              </button>
              <span className="w-8 h-8 rounded-full bg-[#0A0A0A] text-white text-[10px] font-medium flex items-center justify-center ml-1 shrink-0">
                {initials}
              </span>
            </div>
          </div>
        </header>

        <main ref={mainRef} className="flex-1">{children}</main>

        <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
    </div>
  )
}

function NotifItem({
  icon,
  iconBg,
  title,
  meta,
}: {
  icon: React.ReactNode
  iconBg: string
  title: React.ReactNode
  meta: string
}) {
  return (
    <li className="px-2 py-3 flex items-start gap-3">
      <span className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[12.5px] text-[#0A0A0A]">{title}</div>
        <div className="jur-mono text-[10.5px] text-[#6B6B6B] mt-0.5">{meta}</div>
      </div>
    </li>
  )
}

function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center pt-24 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 jur-modal-backdrop" onClick={onClose} />
      <div className="relative w-full max-w-[640px] bg-white border border-[#E5E5E5] rounded-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)] overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E5E5E5]">
          <Search className="w-4 h-4 text-[#6B6B6B]" />
          <input
            autoFocus
            type="text"
            placeholder="Buscar expedientes, clientes, actuaciones…"
            className="flex-1 bg-transparent outline-none text-[14px]"
          />
          <span className="jur-kbd">ESC</span>
        </div>
        <div className="max-h-[60vh] overflow-y-auto jur-nice-scroll">
          <div className="px-5 pt-4 pb-2 jur-mono text-[10px] text-[#6B6B6B] tracking-wider uppercase">
            Sugerencias
          </div>
          <ul className="pb-2">
            <SuggestRow
              icon={<Folder className="w-4 h-4 text-[#1a1a1a]" />}
              title="Ruiz Martínez c. BBVA"
              meta="EXP-2026-0247 · civil"
              trailing={<CornerDownLeft className="w-3.5 h-3.5 text-[#A0A0A0]" />}
            />
            <SuggestRow
              icon={<User className="w-4 h-4 text-[#1a1a1a]" />}
              title="Constructora Levante"
              meta="cliente · 3 expedientes"
            />
            <SuggestRow
              icon={<CalendarClock className="w-4 h-4 text-[#1a1a1a]" />}
              title="Contestación a la demanda"
              meta="plazo · vence hoy"
            />
          </ul>
          <div className="px-5 pt-3 pb-2 jur-mono text-[10px] text-[#6B6B6B] tracking-wider uppercase border-t border-[#EFEFEF]">
            Acciones rápidas
          </div>
          <ul className="pb-3">
            <SuggestRow icon={<Plus className="w-4 h-4 text-[#1a1a1a]" />} title="Crear nuevo expediente" />
            <SuggestRow icon={<Inbox className="w-4 h-4 text-[#1a1a1a]" />} title="Clasificar Lexnet" />
            <SuggestRow icon={<Receipt className="w-4 h-4 text-[#1a1a1a]" />} title="Emitir minuta" />
          </ul>
        </div>
        <div className="border-t border-[#E5E5E5] px-5 py-2.5 flex items-center justify-between jur-mono text-[10.5px] text-[#6B6B6B]">
          <span>↵ Abrir · ↑↓ Navegar</span>
          <span>ESC Cerrar</span>
        </div>
      </div>
    </div>
  )
}

function SuggestRow({
  icon,
  title,
  meta,
  trailing,
}: {
  icon: React.ReactNode
  title: string
  meta?: string
  trailing?: React.ReactNode
}) {
  return (
    <li className="px-5 py-2.5 jur-row-hover flex items-center gap-3 cursor-pointer">
      {icon}
      <div className="flex-1">
        <div className="text-[13.5px] text-[#0A0A0A]">{title}</div>
        {meta && <div className="jur-mono text-[11px] text-[#6B6B6B]">{meta}</div>}
      </div>
      {trailing}
    </li>
  )
}

function crumbFromPath(path: string): string[] {
  const map: Record<string, string> = {
    "/dashboard": "Inicio",
    "/dashboard/cases": "Expedientes",
    "/dashboard/deadlines": "Plazos",
    "/dashboard/notifications": "Lexnet",
    "/dashboard/agenda": "Agenda",
    "/dashboard/clients": "Clientes",
    "/dashboard/billing": "Minutas",
    "/dashboard/time": "Honorarios",
    "/dashboard/settings": "Ajustes",
  }
  const label = map[path] ?? "Inicio"
  return [label]
}
