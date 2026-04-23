"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { signOut } from "next-auth/react"
import { Menu, X } from "lucide-react"
import { Sidebar, navItems } from "./sidebar"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { UserWithSubscription } from "@/types"

export function DashboardShell({
  user,
  children,
}: {
  user: UserWithSubscription
  children: React.ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase()

  const firstName = user.name?.split(" ")[0] ?? user.email.split("@")[0]

  return (
    <div className="flex min-h-screen bg-gray-50/40">
      <Sidebar />

      <div className="flex flex-1 flex-col min-w-0">
        {/* Top header */}
        <header className="flex h-14 items-center justify-between border-b border-gray-100 bg-white px-4 md:justify-end shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-colors outline-none">
              <div className="relative">
                <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-[11px] font-bold text-indigo-700">{initials}</span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-indigo-400" />
              </div>
              <span className="hidden sm:inline text-sm font-medium text-foreground/80">
                {firstName}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => window.location.href = "/dashboard/settings"}>
                Ajustes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = "/dashboard/billing"}>
                Facturación
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="fixed inset-y-0 left-0 z-50 flex w-56 flex-col bg-sidebar border-r border-sidebar-border shadow-xl">
            <div className="flex h-16 items-center justify-between px-5 border-b border-sidebar-border">
              <Link href="/dashboard" className="flex items-center text-white" onClick={() => setMobileOpen(false)}>
                <Logo className="h-7" />
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-1 text-white/40 hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-1 p-3 mt-2">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-all",
                      active
                        ? "bg-indigo-500 text-white shadow-[0_0_16px_rgba(79,70,229,0.30)]"
                        : "text-white/50 hover:bg-white/8 hover:text-white/90"
                    )}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", active ? "text-white" : "text-white/30")} />
                    {label}
                  </Link>
                )
              })}
            </div>
          </nav>
        </>
      )}
    </div>
  )
}
