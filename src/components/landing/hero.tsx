import Link from "next/link"
import {
  ArrowRight,
  Lock,
  ChevronsUpDown,
  LayoutDashboard,
  Folders,
  CalendarClock,
  Inbox,
  Receipt,
  Users,
  ChevronRight,
} from "lucide-react"

export function Hero() {
  return (
    <section className="relative hero-bg overflow-hidden">
      <div className="absolute inset-0 grain pointer-events-none"></div>
      <div className="max-w-[1360px] mx-auto px-6 lg:px-10 pt-20 lg:pt-28 pb-10 relative">
        <div className="flex items-center justify-between text-[11px] font-mono-j text-[#6B6B6B] mb-10 reveal">
          <span>— ESTABLISHED 2026 · VALENCIA, ES</span>
          <span className="hidden sm:inline">LEGAL PRACTICE SOFTWARE / ESP</span>
          <span>№ 001</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-9 reveal">
            <span className="micropill">
              <span className="dot"></span>
              <span className="font-mono-j text-[11px]">NEW · 2026</span>
              <span className="text-[#1a1a1a]">Integración nativa con Lexnet</span>
            </span>
            <h1 className="display text-[68px] sm:text-[112px] lg:text-[168px] text-ink mt-8">
              Software legal
              <br />
              <em>moderno</em>, <span className="serif-u">por fin</span>.
            </h1>
          </div>

          <div className="lg:col-span-3 reveal">
            <div className="border-l-2 border-[#B54534] pl-5 max-w-xs ml-auto">
              <p className="text-[15.5px] text-[#1a1a1a] leading-relaxed">
                Expedientes, plazos procesales y minutas. Sin la fricción del
                software de los 2000.
              </p>
              <div className="mt-6 flex flex-col gap-3 items-start">
                <Link href="/login" className="btn-clay">
                  Empezar gratis <ArrowRight className="w-4 h-4 arr" />
                </Link>
                <a href="#producto" className="btn-ghost !p-0">
                  <span className="u">Ver cómo funciona</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="mt-5 font-mono-j text-[11px] text-[#6B6B6B]">
                30 días · sin tarjeta · migración incluida
              </p>
            </div>
          </div>
        </div>

        <HeroMockup />
      </div>
    </section>
  )
}

function HeroMockup() {
  return (
    <div className="mt-20 lg:mt-24 reveal">
      <div className="flex items-center justify-between mb-4">
        <div className="font-mono-j text-[11px] text-[#6B6B6B]">
          FIG. 01 — VISTA DE EXPEDIENTE
        </div>
        <div className="font-mono-j text-[11px] text-[#6B6B6B]">
          app.juristea.com
        </div>
      </div>
      <div className="rounded-[12px] border border-[#E5E5E5] bg-white overflow-hidden shadow-[0_1px_0_rgba(0,0,0,0.02),0_40px_80px_-40px_rgba(0,0,0,0.22)]">
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[#E5E5E5] bg-[#F9F9F9]">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E5]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E5]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E5]"></span>
          </div>
          <div className="mx-auto font-mono-j text-[11px] text-[#6B6B6B] flex items-center gap-1.5">
            <Lock className="w-3 h-3" /> app.juristea.com/expedientes/EXP-2026-247
          </div>
          <div className="w-16"></div>
        </div>

        <div className="grid grid-cols-12">
          <aside className="hidden md:flex col-span-3 lg:col-span-2 border-r border-[#E5E5E5] flex-col py-4 px-3">
            <div className="flex items-center gap-2 px-2 pb-4 border-b border-[#E5E5E5]">
              <span className="w-6 h-6 rounded bg-ink text-white text-[11px] flex items-center justify-center serif">
                J
              </span>
              <span className="text-[13px] font-medium">González &amp; Asoc.</span>
              <ChevronsUpDown className="w-3 h-3 text-[#6B6B6B] ml-auto" />
            </div>
            <div className="mt-3 text-[11px] font-mono-j text-[#6B6B6B] px-2 mb-1.5">
              NAVEGACIÓN
            </div>
            <nav className="space-y-0.5 text-[12.5px]">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded text-[#1a1a1a]">
                <LayoutDashboard className="w-3.5 h-3.5" /> Escritorio
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-[#F9F9F9] text-ink font-medium">
                <Folders className="w-3.5 h-3.5" /> Expedientes
                <span className="ml-auto font-mono-j text-[10px] text-[#6B6B6B]">148</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded text-[#1a1a1a]">
                <CalendarClock className="w-3.5 h-3.5" /> Plazos
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded text-[#1a1a1a]">
                <Inbox className="w-3.5 h-3.5" /> Lexnet
                <span className="ml-auto font-mono-j text-[10px] bg-[#B54534]/10 text-[#B54534] rounded px-1">
                  7
                </span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded text-[#1a1a1a]">
                <Receipt className="w-3.5 h-3.5" /> Minutas
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded text-[#1a1a1a]">
                <Users className="w-3.5 h-3.5" /> Clientes
              </div>
            </nav>
          </aside>

          <div className="col-span-12 md:col-span-9 lg:col-span-7 border-r border-[#E5E5E5]">
            <div className="px-6 py-4 border-b border-[#E5E5E5]">
              <div className="flex items-center gap-1.5 text-[11.5px] text-[#6B6B6B] font-mono-j">
                <span>Expedientes</span>
                <ChevronRight className="w-3 h-3" />
                <span>Civil</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-ink">EXP-2026-247</span>
              </div>
              <div className="flex items-start justify-between mt-3 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-j text-[11px] text-[#6B6B6B]">EXP-2026-247</span>
                    <span className="tag tag-civ">CIVIL</span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#10B981]">
                      <span className="status-dot bg-[#10B981]"></span> En trámite
                    </span>
                  </div>
                  <h3 className="serif text-[26px] text-ink mt-1 tracking-tight">
                    Ruiz Martínez c. Banco Sabadell
                  </h3>
                  <div className="text-[12px] text-[#6B6B6B] mt-1 font-mono-j">
                    Juzgado 1ª Inst. nº 4 · Madrid · NIG 28079-42-1-2026-0023047
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn-ghost !py-1.5 !px-3 border border-[#E5E5E5] !text-[12.5px]">
                    Compartir
                  </button>
                  <button className="btn-solid !py-1.5 !px-3 !text-[12.5px]">
                    Nueva actuación
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-5 mt-4 text-[12.5px]">
                <span className="pb-2.5 border-b-2 border-ink text-ink font-medium">Resumen</span>
                <span className="pb-2.5 text-[#6B6B6B]">Actuaciones</span>
                <span className="pb-2.5 text-[#6B6B6B]">
                  Documentos <span className="font-mono-j text-[10px]">18</span>
                </span>
                <span className="pb-2.5 text-[#6B6B6B]">Plazos</span>
                <span className="pb-2.5 text-[#6B6B6B]">Minutas</span>
              </div>
            </div>
            <div className="px-6 py-5">
              <div className="text-[11px] font-mono-j text-[#6B6B6B] mb-3">
                ACTUACIONES · ÚLTIMAS 4
              </div>
              <div className="space-y-4">
                <TimelineRow
                  dotClass="bg-[#B54534]"
                  withLine
                  title="Vista señalada para el 15/05/2026"
                  time="hoy · 09:14"
                  desc="Notificación Lexnet vinculada automáticamente."
                  titleBold
                />
                <TimelineRow
                  dotClass="bg-[#1a1a1a]"
                  withLine
                  title="Contestación a la demanda presentada"
                  time="04/04 · 17:22"
                  desc="Escrito + 7 documentos · firmado por J. Fernández"
                  titleBold
                />
                <TimelineRow
                  dotClass="bg-[#E5E5E5]"
                  withLine
                  title="Emplazamiento recibido"
                  time="18/03"
                  desc="Plazo de 20 días hábiles · calculado auto."
                />
                <TimelineRow
                  dotClass="bg-[#E5E5E5]"
                  title="Demanda presentada"
                  time="12/02"
                  desc="Admitida a trámite."
                />
              </div>
            </div>
          </div>

          <aside className="hidden lg:flex col-span-3 flex-col bg-[#F9F9F9]/50">
            <div className="px-5 py-4 border-b border-[#E5E5E5]">
              <div className="text-[11px] font-mono-j text-[#6B6B6B] mb-3">PRÓXIMOS PLAZOS</div>
              <div className="space-y-3">
                <DeadlineRow urg="urg-hi" title="Ramo de prueba" sub="vence 08/05" num="5" color="text-[#B54534]" />
                <DeadlineRow urg="urg-md" title="Vista oral" sub="15/05 · 10:30" num="12" color="text-[#F59E0B]" />
                <DeadlineRow urg="urg-lo" title="Conclusiones" sub="03/06" num="31" color="text-[#10B981]" />
              </div>
            </div>
            <div className="px-5 py-4 border-b border-[#E5E5E5]">
              <div className="text-[11px] font-mono-j text-[#6B6B6B] mb-3">CLIENTE</div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-ink text-white text-[11px] flex items-center justify-center font-medium">
                  AM
                </span>
                <div>
                  <div className="text-[13px] text-ink">Antonio Martínez Ruiz</div>
                  <div className="font-mono-j text-[11px] text-[#6B6B6B]">NIF · 12345678-A</div>
                </div>
              </div>
            </div>
            <div className="px-5 py-4">
              <div className="text-[11px] font-mono-j text-[#6B6B6B] mb-3">EQUIPO</div>
              <div className="flex -space-x-2">
                <span className="w-7 h-7 rounded-full bg-[#B54534] text-white text-[10px] flex items-center justify-center ring-2 ring-white">MG</span>
                <span className="w-7 h-7 rounded-full bg-ink text-white text-[10px] flex items-center justify-center ring-2 ring-white">JF</span>
                <span className="w-7 h-7 rounded-full bg-[#6B6B6B] text-white text-[10px] flex items-center justify-center ring-2 ring-white">+2</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function TimelineRow({
  dotClass,
  withLine,
  title,
  time,
  desc,
  titleBold,
}: {
  dotClass: string
  withLine?: boolean
  title: string
  time: string
  desc: string
  titleBold?: boolean
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <span className={`w-2 h-2 rounded-full ${dotClass}`}></span>
        {withLine && <span className="w-px flex-1 bg-[#E5E5E5] mt-1"></span>}
      </div>
      <div className="flex-1 -mt-0.5">
        <div className="flex items-center justify-between">
          <span
            className={
              titleBold
                ? "text-[13.5px] text-ink font-medium"
                : "text-[13.5px] text-[#1a1a1a]"
            }
          >
            {title}
          </span>
          <span className="font-mono-j text-[11px] text-[#6B6B6B]">{time}</span>
        </div>
        <p className="text-[12.5px] text-[#6B6B6B] mt-0.5">{desc}</p>
      </div>
    </div>
  )
}

function DeadlineRow({
  urg,
  title,
  sub,
  num,
  color,
}: {
  urg: string
  title: string
  sub: string
  num: string
  color: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className={`status-dot ${urg} mt-1.5`}></span>
      <div className="flex-1">
        <div className="text-[13px] text-ink">{title}</div>
        <div className="font-mono-j text-[11px] text-[#6B6B6B]">{sub}</div>
      </div>
      <span className={`serif text-[28px] leading-none ${color}`}>{num}</span>
    </div>
  )
}
