// Mock home content — copy of dashboard/page.tsx body with static values.
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Gavel,
  Phone,
  User,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react"

type BadgeTone = "ok" | "warn" | "gray" | "clay"

const MONTHS_ES = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"]

export function MockHomeContent() {
  const now = new Date()

  const DEADLINES = [
    { id: "1", title: "Contestación a la demanda", days: 0, area: "civil",
      caseNumber: "EXP-2026-0247", caseTitle: "Ruiz Martínez c. BBVA · Juzg. 1ª Inst. nº 4 Madrid" },
    { id: "2", title: "Recurso de apelación", days: 1, area: "penal",
      caseNumber: "EXP-2026-0198", caseTitle: "Asoc. Vecinos Las Palmas · Audiencia Provincial Madrid" },
    { id: "3", title: "Presentación de pruebas", days: 3, area: "social",
      caseNumber: "EXP-2026-0211", caseTitle: "Hernández Pérez c. Logística Ibérica" },
    { id: "4", title: "Conclusiones", days: 5, area: "contencioso",
      caseNumber: "EXP-2026-0156", caseTitle: "Constructora Levante c. Ayto. Pozuelo" },
    { id: "5", title: "Vista señalada", days: 8, area: "mercantil",
      caseNumber: "EXP-2026-0203", caseTitle: "García & Cía SL · Juzg. Mercantil nº 6 Madrid" },
  ]
  const CASES = [
    { id: "1", caseNumber: "EXP-2026-0247", title: "Ruiz Martínez", area: "civil", activity: "hace 2 h", status: "active" },
    { id: "2", caseNumber: "EXP-2026-0211", title: "Hernández Pérez", area: "social", activity: "hace 4 h", status: "pending" },
    { id: "3", caseNumber: "EXP-2026-0198", title: "Asoc. Vecinos Las Palmas", area: "penal", activity: "ayer", status: "active" },
    { id: "4", caseNumber: "EXP-2026-0156", title: "Constructora Levante", area: "contencioso", activity: "ayer", status: "paused" },
    { id: "5", caseNumber: "EXP-2026-0203", title: "García & Cía SL", area: "mercantil", activity: "2 días", status: "active" },
    { id: "6", caseNumber: "EXP-2025-0489", title: "López López", area: "civil", activity: "3 días", status: "pending" },
  ]

  return (
    <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-10 lg:py-12">
      <section>
        <span className="jur-pill">
          <span className="dot" />
          <span className="jur-mono">TODO EN ORDEN</span>
          <span className="text-[#6B6B6B]">· Última sync Lexnet hace 4 min</span>
        </span>
        <h1 className="jur-display text-[56px] sm:text-[72px] text-[#0A0A0A] mt-5">
          Buenos días, <em>María</em>.
        </h1>
        <p className="mt-4 text-[15.5px] text-[#6B6B6B] max-w-2xl leading-relaxed">
          Hoy tienes <span className="text-[#0A0A0A] font-medium">3 plazos críticos</span>,{" "}
          <span className="text-[#0A0A0A] font-medium">12 notificaciones</span> sin clasificar y{" "}
          <span className="text-[#0A0A0A] font-medium">2 vistas señaladas</span>.
        </p>
      </section>

      <section className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="jur-card p-6">
          <div className="jur-mono-label">EXPEDIENTES ACTIVOS</div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-[44px] font-semibold tracking-[-0.02em] text-[#0A0A0A] leading-none">47</span>
          </div>
          <div className="mt-3 text-[12.5px] text-[#6B6B6B] flex items-center gap-1.5">
            <ArrowUpRight className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="text-[#10B981] font-medium">3 este mes</span>
            <span className="text-[#A0A0A0]">·</span>
            <span>12 cerrados</span>
          </div>
        </div>
        <div className="jur-card p-6">
          <div className="jur-mono-label">PLAZOS ESTA SEMANA</div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-[44px] font-semibold tracking-[-0.02em] text-[#0A0A0A] leading-none">8</span>
          </div>
          <div className="mt-3 text-[12.5px] text-[#6B6B6B] flex items-center gap-1.5">
            <span className="jur-urg-dot bg-[#B54534]" />
            <span className="text-[#B54534] font-medium">3 críticos</span>
            <span className="text-[#A0A0A0]">·</span>
            <span>5 normales</span>
          </div>
        </div>
        <div className="jur-card p-6">
          <div className="jur-mono-label">LEXNET SIN CLASIFICAR</div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-[44px] font-semibold tracking-[-0.02em] text-[#0A0A0A] leading-none">12</span>
          </div>
          <div className="mt-3">
            <Link href="#" className="jur-btn-ghost clay text-[12.5px]">
              Clasificar <ArrowRight className="w-3.5 h-3.5 arr" />
            </Link>
          </div>
        </div>
        <div className="jur-card p-6">
          <div className="jur-mono-label">POR FACTURAR</div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-[44px] font-semibold tracking-[-0.02em] text-[#0A0A0A] leading-none">8.450</span>
            <span className="text-[18px] text-[#0A0A0A] font-medium">€</span>
          </div>
          <div className="mt-3 text-[12.5px] text-[#6B6B6B]">en 14 minutas pendientes</div>
        </div>
      </section>

      <section className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 jur-card p-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="jur-serif text-[30px] text-[#0A0A0A]">Plazos <em>próximos</em></h2>
              <p className="mt-1 text-[13px] text-[#6B6B6B]">Los próximos 15 días · ordenados por urgencia</p>
            </div>
            <Link href="#" className="jur-btn-ghost">Ver calendario <ArrowRight className="w-3.5 h-3.5 arr" /></Link>
          </div>
          <ul className="mt-5">
            {DEADLINES.map((d, i) => {
              const chip = d.days <= 1 ? "clay" : d.days <= 5 ? "warn" : "gray"
              const tone: BadgeTone = d.area === "civil" ? "clay" : d.area === "social" ? "ok" : d.area === "mercantil" ? "warn" : "gray"
              const due = new Date(now.getTime() + d.days * 24 * 3600 * 1000)
              const isLast = i === DEADLINES.length - 1
              return (
                <li key={d.id} className={`jur-row-hover ${isLast ? "" : "jur-row-sep"} py-4 flex items-center gap-4 cursor-pointer`}>
                  <div className={`jur-date-chip is-${chip}`}>
                    <span className="m">{MONTHS_ES[due.getMonth()]}</span>
                    <span className="d">{String(due.getDate()).padStart(2,"0")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] text-[#0A0A0A] font-semibold truncate">{d.title}</span>
                      <span className={`jur-badge jur-badge-${tone}`}>{d.area.charAt(0).toUpperCase() + d.area.slice(1)}</span>
                    </div>
                    <div className="jur-mono text-[11px] text-[#6B6B6B] mt-1 truncate">
                      {d.caseNumber} · {d.caseTitle}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className={`text-[15px] font-semibold tracking-tight ${chip==="clay"?"text-[#B54534]":"text-[#0A0A0A]"}`}>
                        {d.days===0?"HOY":d.days===1?"MAÑANA":`${d.days} días`}
                      </div>
                      <div className="jur-mono text-[10.5px] text-[#6B6B6B] mt-0.5">
                        {d.days===0?"14:30 cierre":d.days===1?"1 día":["dom","lun","mar","mié","jue","vie","sáb"][due.getDay()]}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#A0A0A0]" />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="jur-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h3 className="jur-serif text-[26px] text-[#0A0A0A]">Lexnet</h3>
                <span className="jur-badge jur-badge-clay">12 sin clasificar</span>
              </div>
            </div>
            <p className="mt-0.5 text-[12.5px] text-[#6B6B6B]">Últimas notificaciones recibidas</p>
            <ul className="mt-4 divide-y divide-[#EFEFEF]">
              <li className="py-3"><div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="jur-mono text-[10px] text-[#6B6B6B] tracking-wider uppercase truncate">JUZGADO 1ª INST. Nº 4 MADRID</div>
                  <div className="text-[13px] text-[#0A0A0A] font-medium mt-0.5 truncate">Diligencia de ordenación</div>
                  <div className="jur-mono text-[10.5px] text-[#6B6B6B] mt-1">hace 23 min</div>
                </div>
                <span className="jur-urg-dot bg-[#B54534] mt-1.5 shrink-0" />
              </div></li>
              <li className="py-3"><div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="jur-mono text-[10px] text-[#6B6B6B] tracking-wider uppercase truncate">AUDIENCIA PROV. MADRID · SEC. 4</div>
                  <div className="text-[13px] text-[#0A0A0A] font-medium mt-0.5 truncate">Auto resolviendo recurso</div>
                  <div className="jur-mono text-[10.5px] text-[#6B6B6B] mt-1">hace 1 h 12 min</div>
                </div>
                <span className="jur-urg-dot bg-[#B54534] mt-1.5 shrink-0" />
              </div></li>
            </ul>
            <Link href="#" className="jur-btn-ghost mt-4">Clasificar todas <ArrowRight className="w-3.5 h-3.5 arr" /></Link>
          </div>

          <div className="jur-card p-6">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="jur-serif text-[26px] text-[#0A0A0A]">Agenda</h3>
                <div className="jur-mono text-[11px] text-[#6B6B6B] mt-0.5">MARTES, 23 ABRIL</div>
              </div>
              <div className="jur-mono text-[11px] text-[#6B6B6B]">4 eventos</div>
            </div>
            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-4">
                <div className="w-12 shrink-0">
                  <div className="jur-mono text-[14px] text-[#0A0A0A] font-medium leading-none">10:00</div>
                  <div className="jur-mono text-[10px] text-[#6B6B6B] mt-1">90 min</div>
                </div>
                <div className="flex-1 min-w-0 border-l border-[#E5E5E5] pl-4">
                  <div className="flex items-center gap-2"><Gavel className="w-3.5 h-3.5 text-[#B54534]" /><span className="text-[13.5px] text-[#0A0A0A] font-medium">Vista oral</span></div>
                  <div className="jur-mono text-[10.5px] text-[#6B6B6B] mt-1 truncate">EXP-2026-0198 · Juzg. Penal nº 3</div>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-12 shrink-0">
                  <div className="jur-mono text-[14px] text-[#0A0A0A] font-medium leading-none">12:30</div>
                  <div className="jur-mono text-[10px] text-[#6B6B6B] mt-1">45 min</div>
                </div>
                <div className="flex-1 min-w-0 border-l border-[#E5E5E5] pl-4">
                  <div className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-[#1a1a1a]" /><span className="text-[13.5px] text-[#0A0A0A] font-medium">Reunión cliente</span></div>
                  <div className="jur-mono text-[10.5px] text-[#6B6B6B] mt-1">Carlos Méndez · despacho</div>
                </div>
              </li>
            </ul>
            <Link href="#" className="jur-btn-ghost mt-5">Ver agenda <ArrowRight className="w-3.5 h-3.5 arr" /></Link>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="jur-card p-7">
          <div className="flex items-end justify-between gap-4">
            <h3 className="jur-serif text-[28px] text-[#0A0A0A]">Expedientes recientes</h3>
            <Link href="#" className="jur-btn-ghost">Ver todos <ArrowRight className="w-3.5 h-3.5 arr" /></Link>
          </div>
          <div className="mt-5">
            <div className="grid grid-cols-12 gap-3 pb-2 jur-mono text-[10px] text-[#6B6B6B] tracking-wider uppercase border-b border-[#E5E5E5]">
              <div className="col-span-3">Nº</div>
              <div className="col-span-4">Cliente</div>
              <div className="col-span-2">Jurisd.</div>
              <div className="col-span-2">Actividad</div>
              <div className="col-span-1 text-right">Estado</div>
            </div>
            <div className="divide-y divide-[#EFEFEF]">
              {CASES.map(c => {
                const tone: BadgeTone = c.status==="active"?"ok":c.status==="pending"?"warn":"gray"
                const label = c.status==="active"?"En trámite":c.status==="pending"?"Plazo":"En espera"
                return (
                  <div key={c.id} className="grid grid-cols-12 gap-3 py-3 jur-row-hover cursor-pointer items-center">
                    <div className="col-span-3 jur-mono text-[11.5px] text-[#0A0A0A]">{c.caseNumber}</div>
                    <div className="col-span-4 text-[13px] text-[#0A0A0A] truncate">{c.title}</div>
                    <div className="col-span-2 text-[12.5px] text-[#6B6B6B]">{c.area.charAt(0).toUpperCase()+c.area.slice(1)}</div>
                    <div className="col-span-2 text-[12.5px] text-[#6B6B6B]">{c.activity}</div>
                    <div className="col-span-1 flex justify-end"><span className={`jur-badge jur-badge-${tone}`}>{label}</span></div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="jur-card p-7">
          <div className="flex items-end justify-between gap-4">
            <h3 className="jur-serif text-[28px] text-[#0A0A0A]">Facturación <em>del mes</em></h3>
            <div className="jur-mono text-[11px] text-[#6B6B6B]">ABRIL 2026</div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <div className="jur-mono-label">FACTURADO</div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-[40px] font-semibold tracking-[-0.02em] text-[#0A0A0A] leading-none">14.820</span>
                <span className="text-[16px] text-[#0A0A0A] font-medium">€</span>
              </div>
              <div className="mt-2 text-[12px] text-[#10B981] font-medium flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> +18% vs marzo</div>
            </div>
            <div>
              <div className="jur-mono-label">PENDIENTE DE COBRO</div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-[40px] font-semibold tracking-[-0.02em] text-[#B54534] leading-none">8.450</span>
                <span className="text-[16px] text-[#B54534] font-medium">€</span>
              </div>
              <div className="mt-2 text-[12px] text-[#6B6B6B]">14 minutas · media 32 días</div>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between jur-mono text-[10.5px] text-[#6B6B6B] uppercase tracking-wider mb-1.5">
              <span>Objetivo mensual · 20.000 €</span>
              <span>74%</span>
            </div>
            <div className="jur-bar"><span style={{ width: "74%" }} /></div>
          </div>
          <div className="mt-6 pt-5 border-t border-[#EFEFEF]">
            <div className="jur-mono-label mb-3">ÚLTIMAS MINUTAS</div>
            <ul className="divide-y divide-[#EFEFEF]">
              <li className="py-3 flex items-center gap-3 jur-row-hover cursor-pointer">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><span className="jur-mono text-[11px] text-[#0A0A0A]">MIN-2026-0082</span><span className="text-[13px] text-[#0A0A0A] truncate">· Ruiz Martínez</span></div>
                  <div className="jur-mono text-[10.5px] text-[#6B6B6B] mt-0.5">pagada hoy</div>
                </div>
                <div className="text-right shrink-0"><div className="text-[13.5px] text-[#0A0A0A] font-medium">2.400 €</div><span className="jur-badge jur-badge-ok mt-0.5">Pagada</span></div>
              </li>
              <li className="py-3 flex items-center gap-3 jur-row-hover cursor-pointer">
                <Clock className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><span className="jur-mono text-[11px] text-[#0A0A0A]">MIN-2026-0081</span><span className="text-[13px] text-[#0A0A0A] truncate">· Constructora Levante</span></div>
                  <div className="jur-mono text-[10.5px] text-[#6B6B6B] mt-0.5">vence en 15 días</div>
                </div>
                <div className="text-right shrink-0"><div className="text-[13.5px] text-[#0A0A0A] font-medium">3.800 €</div><span className="jur-badge jur-badge-warn mt-0.5">15 días</span></div>
              </li>
              <li className="py-3 flex items-center gap-3 jur-row-hover cursor-pointer">
                <AlertCircle className="w-4 h-4 text-[#B54534] shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><span className="jur-mono text-[11px] text-[#0A0A0A]">MIN-2026-0080</span><span className="text-[13px] text-[#0A0A0A] truncate">· García &amp; Cía</span></div>
                  <div className="jur-mono text-[10.5px] text-[#6B6B6B] mt-0.5">vencida hace 3 días</div>
                </div>
                <div className="text-right shrink-0"><div className="text-[13.5px] text-[#0A0A0A] font-medium">1.850 €</div><span className="jur-badge jur-badge-clay mt-0.5">Vencida</span></div>
              </li>
            </ul>
          </div>
          <Link href="#" className="jur-btn-ghost mt-5">Gestionar minutas <ArrowRight className="w-3.5 h-3.5 arr" /></Link>
        </div>
      </section>

      <footer className="mt-16 pt-6 border-t border-[#E5E5E5] flex items-center justify-between jur-mono text-[10.5px] text-[#A0A0A0] uppercase tracking-wider">
        <span>Juristea · v26.1 · Madrid</span>
        <span>servidores en Frankfurt, DE</span>
      </footer>
    </div>
  )
}
