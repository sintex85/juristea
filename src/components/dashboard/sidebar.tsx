"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Briefcase,
  Bell,
  CalendarClock,
  Calendar,
  Users,
  Contact,
  Clock,
  Settings,
  CreditCard,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"

export const navItems: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Inicio",          href: "/dashboard",              icon: LayoutDashboard },
  { label: "Agenda",          href: "/dashboard/agenda",       icon: Calendar },
  { label: "Expedientes",     href: "/dashboard/cases",        icon: Briefcase },
  { label: "Notificaciones",  href: "/dashboard/notifications", icon: Bell },
  { label: "Plazos",          href: "/dashboard/deadlines",    icon: CalendarClock },
  { label: "Clientes",        href: "/dashboard/clients",      icon: Users },
  { label: "Contactos",       href: "/dashboard/contacts",     icon: Contact },
  { label: "Tiempo",          href: "/dashboard/time",         icon: Clock },
  { label: "Ajustes",         href: "/dashboard/settings",     icon: Settings },
  { label: "Facturación",     href: "/dashboard/billing",      icon: CreditCard },
]

export function Sidebar({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname()

  return (
    <aside className={cn(
      "w-56 shrink-0 flex-col bg-sidebar text-sidebar-foreground",
      mobile ? "flex h-full" : "hidden md:flex border-r border-sidebar-border"
    )}>
      <div className="flex h-16 items-center px-5 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center text-white">
          <Logo className="h-7" />
        </Link>
      </div>

      <nav className="flex flex-col gap-1 p-3 flex-1 mt-2">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-all",
                active
                  ? "bg-indigo-500 text-white shadow-[0_0_16px_rgba(79,70,229,0.30)]"
                  : "text-white/50 hover:bg-white/8 hover:text-white/90"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  active ? "text-white" : "text-white/30 group-hover:text-white/70"
                )}
              />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
