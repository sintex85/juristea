import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { LandingEffects } from "@/components/landing/landing-effects"
import { MobileNav } from "@/components/landing/mobile-nav"

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.778 13.019H3.555V9h3.56v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.543C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  )
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-ink">
      <LandingEffects />

      <header
        id="landing-nav"
        className="sticky top-0 z-40 border-b border-[#E5E5E5] bg-white"
      >
        <div className="max-w-[1360px] mx-auto px-6 lg:px-10 relative">
          <div className="flex items-center justify-between h-[64px]">
            <Link href="/" className="flex items-baseline gap-1.5">
              <span className="serif text-[24px] tracking-tight text-ink">
                Juristea
              </span>
              <span className="font-mono-j text-[10px] text-[#6B6B6B]">v26.1</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-[13.5px] text-[#1a1a1a]">
              <a href="#producto" className="navlink hover:text-ink">Producto</a>
              <a href="#plazos" className="navlink hover:text-ink">Plazos</a>
              <a href="#lexnet" className="navlink hover:text-ink">Lexnet</a>
              <a href="#precios" className="navlink hover:text-ink">Precios</a>
              <a href="#recursos" className="navlink hover:text-ink">Recursos</a>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="text-[13.5px] text-[#1a1a1a] hover:text-ink"
              >
                Entrar
              </Link>
              <Link
                href="/login"
                className="btn-solid py-2 px-4 text-[13.5px]"
              >
                Empezar <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <MobileNav />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-white border-t border-[#E5E5E5]">
        <div className="max-w-[1360px] mx-auto px-6 lg:px-10 py-14">
          <div className="grid md:grid-cols-5 gap-10">
            <div className="md:col-span-1">
              <div className="serif text-[26px] text-ink">Juristea</div>
              <p className="mt-3 text-[12.5px] text-[#6B6B6B]">
                Software legal moderno para despachos en España.
              </p>
            </div>
            <FooterCol
              title="PRODUCTO"
              items={[
                { href: "#producto", label: "Expedientes" },
                { href: "#plazos", label: "Plazos" },
                { href: "#lexnet", label: "Lexnet" },
                { href: "#producto", label: "Minutas" },
                { href: "#precios", label: "Precios" },
              ]}
            />
            <FooterCol
              title="EMPRESA"
              items={[
                { href: "#", label: "Sobre Juristea" },
                { href: "#", label: "Blog" },
                { href: "mailto:hola@juristea.com", label: "Contacto" },
                { href: "#", label: "Empleo" },
              ]}
            />
            <FooterCol
              title="LEGAL"
              items={[
                { href: "/legal", label: "Aviso legal" },
                { href: "/privacy", label: "Privacidad" },
                { href: "/cookies", label: "Cookies" },
                { href: "/terms", label: "Condiciones" },
              ]}
            />
            <FooterCol
              title="SOPORTE"
              items={[
                { href: "#", label: "Centro de ayuda" },
                { href: "#", label: "Formación" },
                { href: "#", label: "Estado del servicio" },
              ]}
            />
          </div>

          <div className="mt-14 pt-6 border-t border-[#E5E5E5] flex items-center justify-between flex-wrap gap-3">
            <div className="text-[12px] text-[#6B6B6B]">© 2026 Juristea</div>
            <div className="font-mono-j text-[11px] text-[#6B6B6B]">
              Hecho en Valencia · Servidores en Frankfurt
            </div>
            <div className="flex items-center gap-3 text-[#6B6B6B]">
              <a href="#" className="hover:text-ink" aria-label="LinkedIn">
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-ink" aria-label="Twitter">
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-ink" aria-label="GitHub">
                <GithubIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <section className="bg-white border-t border-[#E5E5E5] overflow-hidden">
        <div className="py-10 text-center">
          <div className="serif outline-text text-[120px] sm:text-[200px] lg:text-[280px] leading-none tracking-tighter">
            Juristea
          </div>
          <div className="font-mono-j text-[11px] text-[#6B6B6B] mt-2">
            — LEGAL SOFTWARE FOR SPAIN · EST. 2026 —
          </div>
        </div>
      </section>
    </div>
  )
}

function FooterCol({
  title,
  items,
}: {
  title: string
  items: { href: string; label: string }[]
}) {
  return (
    <div>
      <div className="font-mono-j text-[10.5px] text-[#6B6B6B] tracking-wider mb-3">
        {title}
      </div>
      <ul className="space-y-2 text-[13px] text-[#1a1a1a]">
        {items.map((it) => (
          <li key={it.href + it.label}>
            <Link href={it.href} className="hover:text-ink">
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
