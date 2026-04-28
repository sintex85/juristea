"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Folders,
  CalendarClock,
  Inbox,
  Calendar,
  Users,
  Receipt,
  Euro,
  FileText,
  Settings,
  LifeBuoy,
  ChevronsUpDown,
  LogOut,
  type LucideIcon,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { Logo } from "@/components/logo"

type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  count?: number
  badge?: { value: string; tone: "clay" | "dark" }
}

export const navItems: NavItem[] = [
  { label: "Inicio", href: "/dashboard", icon: Home },
  { label: "Expedientes", href: "/dashboard/cases", icon: Folders, count: 47 },
  {
    label: "Plazos",
    href: "/dashboard/deadlines",
    icon: CalendarClock,
    badge: { value: "3", tone: "clay" },
  },
  {
    label: "Lexnet",
    href: "/dashboard/notifications",
    icon: Inbox,
    badge: { value: "12", tone: "dark" },
  },
  { label: "Agenda", href: "/dashboard/agenda", icon: Calendar },
  { label: "Clientes", href: "/dashboard/clients", icon: Users },
  { label: "Minutas", href: "/dashboard/billing", icon: Receipt },
  { label: "Honorarios", href: "/dashboard/time", icon: Euro },
  { label: "Documentos", href: "/dashboard/contacts", icon: FileText },
]

const settingsItems: NavItem[] = [
  { label: "Ajustes", href: "/dashboard/settings", icon: Settings },
  { label: "Ayuda", href: "/dashboard/help", icon: LifeBuoy },
]

export function Sidebar({
  user,
  onNavigate,
}: {
  user: { name: string | null; email: string; initials: string; firmName?: string; firmMeta?: string }
  onNavigate?: () => void
}) {
  const pathname = usePathname()

  return (
    <aside className="w-[240px] shrink-0 bg-[#F5F1EA] border-r border-[#E5E5E5] flex flex-col h-full">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-baseline gap-1.5">
          <Logo size="md" />
          <span className="jur-mono text-[10px] text-[#A0A0A0]">v26.1</span>
        </div>
        <button
          type="button"
          className="mt-2 w-full flex items-center gap-2 text-left group"
        >
          <div className="flex-1 min-w-0">
            <div className="jur-mono text-[10.5px] text-[#6B6B6B] uppercase tracking-wider truncate">
              {user.firmName ?? "Despacho"}
            </div>
            <div className="jur-mono text-[10.5px] text-[#A0A0A0] truncate">
              {user.firmMeta ?? "MADRID"}
            </div>
          </div>
          <ChevronsUpDown className="w-3.5 h-3.5 text-[#A0A0A0] group-hover:text-[#0A0A0A]" />
        </button>
      </div>

      <div className="mx-5 border-t border-[#E5E5E5]" />

      <div className="px-3 pt-4 flex-1 overflow-y-auto jur-nice-scroll">
        <div className="px-3 pb-2 jur-mono text-[10px] text-[#A0A0A0] tracking-wider uppercase">
          Navegación
        </div>
        <nav className="space-y-0.5">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} onClick={onNavigate} />
          ))}
        </nav>

        <div className="mx-3 mt-5 mb-3 border-t border-[#E5E5E5]" />

        <nav className="space-y-0.5">
          {settingsItems.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} onClick={onNavigate} />
          ))}
        </nav>
      </div>

      <div className="p-3 border-t border-[#E5E5E5]">
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <span className="w-8 h-8 rounded-full bg-[#0A0A0A] text-white text-[11px] font-medium flex items-center justify-center shrink-0">
            {user.initials}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] text-[#0A0A0A] font-medium truncate">
              {user.name ?? user.email.split("@")[0]}
            </div>
            <div className="jur-mono text-[10.5px] text-[#A0A0A0] truncate">
              SOCIA · COLEG. 82.144
            </div>
          </div>
          <button
            type="button"
            className="text-[#A0A0A0] hover:text-[#0A0A0A]"
            aria-label="Salir"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}

function NavLink({
  item,
  pathname,
  onClick,
}: {
  item: NavItem
  pathname: string
  onClick?: () => void
}) {
  const Icon = item.icon
  const active = pathname === item.href
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`jur-nav-item${active ? " is-active" : ""}`}
    >
      <Icon className="w-4 h-4" />
      <span>{item.label}</span>
      {item.count !== undefined && <span className="jur-nav-count">{item.count}</span>}
      {item.badge && (
        <span className={`jur-nav-badge ${item.badge.tone}`}>{item.badge.value}</span>
      )}
    </Link>
  )
}
