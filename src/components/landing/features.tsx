import {
  Search,
  ShieldCheck,
  History,
  CalendarCheck,
  MapPin,
  Calendar,
  DownloadCloud,
  ScanText,
  Link2,
  Receipt as ReceiptIcon,
  Wallet,
  CreditCard,
  Folders,
  RefreshCw,
  Bell,
  Inbox,
  FileText,
  Sparkles,
  Folder,
  CheckCheck,
  CalendarClock as CalendarClockIcon,
  BadgeCheck,
  PenTool,
} from "lucide-react"

export function Features() {
  return (
    <section id="producto">
      <FeatureExpedientes />
      <FeaturePlazos />
      <FeatureLexnet />
      <FeatureMinutas />
    </section>
  )
}

function FeatureExpedientes() {
  return (
    <div className="max-w-[1360px] mx-auto px-6 lg:px-10 py-24 lg:py-32 border-t border-[#EFEFEF]">
      <div className="grid lg:grid-cols-12 gap-14 items-center">
        <div className="lg:col-span-5 reveal">
          <div className="section-num">§ 02 — EXPEDIENTES</div>
          <h3 className="h2-display text-[46px] sm:text-[64px] text-ink mt-3">
            Cada asunto,
            <br />
            <em>perfectamente</em> ordenado.
          </h3>
          <p className="mt-6 text-[16.5px] text-[#6B6B6B] max-w-md">
            Una única fuente de verdad por expediente. Partes, documentación,
            actuaciones, plazos y honorarios. Sin saltar entre carpetas.
          </p>
          <ul className="mt-8 space-y-3.5 text-[14.5px] text-[#1a1a1a]">
            <li className="flex gap-3">
              <Search className="w-4 h-4 text-[#B54534] mt-0.5" />
              Búsqueda semántica en documentos
            </li>
            <li className="flex gap-3">
              <ShieldCheck className="w-4 h-4 text-[#B54534] mt-0.5" />
              Control de acceso por rol
            </li>
            <li className="flex gap-3">
              <History className="w-4 h-4 text-[#B54534] mt-0.5" />
              Historial completo y auditable
            </li>
          </ul>
        </div>

        <div className="lg:col-span-7 reveal">
          <div className="rounded-[10px] border border-[#E5E5E5] bg-white overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5E5E5] bg-[#F9F9F9]">
              <div className="flex items-center gap-2">
                <Folders className="w-4 h-4" />
                <span className="text-[13px] font-medium">Expedientes</span>
                <span className="font-mono-j text-[11px] text-[#6B6B6B]">148</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 border border-[#E5E5E5] bg-white rounded px-2 py-1 text-[11.5px] text-[#6B6B6B] font-mono-j">
                  <Search className="w-3 h-3" /> buscar...
                  <kbd className="ml-2 text-[10px] border border-[#E5E5E5] px-1 rounded">⌘K</kbd>
                </div>
              </div>
            </div>
            <div className="divide-y divide-[#E5E5E5]">
              <div className="grid grid-cols-12 items-center px-5 py-3 text-[12px] font-mono-j text-[#6B6B6B] uppercase tracking-wider bg-[#F9F9F9]/40">
                <div className="col-span-2">Nº</div>
                <div className="col-span-4">Asunto</div>
                <div className="col-span-2">Jurisd.</div>
                <div className="col-span-2">Actualizado</div>
                <div className="col-span-2 text-right">Letrado</div>
              </div>
              {EXPEDIENTES.map((e, i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 items-center px-5 py-3 hover:bg-[#F9F9F9]/50"
                >
                  <div className="col-span-2 font-mono-j text-[12px] text-ink">{e.id}</div>
                  <div className="col-span-4 text-[13px] text-ink">{e.title}</div>
                  <div className="col-span-2">
                    <span className={`tag ${e.tagClass}`}>{e.tag}</span>
                  </div>
                  <div className="col-span-2 text-[12px] text-[#6B6B6B]">{e.ago}</div>
                  <div className="col-span-2 flex justify-end">
                    <span className={`w-6 h-6 rounded-full ${e.initialsBg} text-white text-[10px] flex items-center justify-center`}>
                      {e.initials}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const EXPEDIENTES = [
  {
    id: "EXP-2026-247",
    title: "Ruiz Martínez c. Banco Sabadell",
    tag: "CIVIL",
    tagClass: "tag-civ",
    ago: "hace 2 h",
    initials: "JF",
    initialsBg: "bg-ink",
  },
  {
    id: "EXP-2026-189",
    title: "García-López · despido improcedente",
    tag: "SOCIAL",
    tagClass: "tag-soc",
    ago: "ayer",
    initials: "MG",
    initialsBg: "bg-[#B54534]",
  },
  {
    id: "EXP-2026-412",
    title: "Industrias Medil · contrato de distribución",
    tag: "MERCANTIL",
    tagClass: "tag-mer",
    ago: "3 d",
    initials: "CO",
    initialsBg: "bg-[#6B6B6B]",
  },
  {
    id: "EXP-2026-302",
    title: "Pérez · seguridad vial",
    tag: "PENAL",
    tagClass: "tag-pen",
    ago: "3 d",
    initials: "JF",
    initialsBg: "bg-ink",
  },
  {
    id: "EXP-2026-158",
    title: "Aseguradora Zafiro · reclamación cantidad",
    tag: "CIVIL",
    tagClass: "tag-civ",
    ago: "5 d",
    initials: "MG",
    initialsBg: "bg-[#B54534]",
  },
]

function FeaturePlazos() {
  return (
    <div
      id="plazos"
      className="max-w-[1360px] mx-auto px-6 lg:px-10 py-24 lg:py-32 border-t border-[#EFEFEF]"
    >
      <div className="grid lg:grid-cols-12 gap-14 items-center">
        <div className="lg:col-span-7 order-2 lg:order-1 reveal">
          <div className="rounded-[10px] border border-[#E5E5E5] bg-white overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5E5E5]">
              <div className="flex items-center gap-2">
                <CalendarClockIcon className="w-4 h-4" />
                <span className="text-[13px] font-medium">Plazos procesales</span>
              </div>
              <span className="font-mono-j text-[11px] text-[#6B6B6B] inline-flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3" /> sync · Google Calendar
              </span>
            </div>
            <div className="p-6 space-y-5">
              <PlazoRow
                days="5"
                color="text-[#B54534]"
                urg="urg-hi"
                unit="días hábiles"
                title="Ramo de prueba · EXP-2026-247"
                sub="Vence viernes 08/05 · Art. 429 LEC"
                chips={[
                  { label: "15d", active: false },
                  { label: "7d", active: false },
                  { label: "3d · activo", active: true },
                ]}
              />
              <PlazoRow
                days="12"
                color="text-[#F59E0B]"
                urg="urg-md"
                unit="días"
                title="Vista oral · EXP-2026-247"
                sub="15/05 · 10:30 · Juzg. 1ª Inst. nº 4 Madrid"
              />
              <PlazoRow
                days="18"
                color="text-[#10B981]"
                urg="urg-lo"
                unit="días hábiles"
                title="Contestación · EXP-2026-412"
                sub="Festivos del partido judicial de Barcelona aplicados."
              />
            </div>
            <div className="px-5 py-3 border-t border-[#E5E5E5] bg-[#F9F9F9] flex items-center justify-between text-[11.5px] text-[#6B6B6B] font-mono-j">
              <span>· 3 plazos activos · 2 esta semana</span>
              <span className="inline-flex items-center gap-1.5">
                <Bell className="w-3 h-3" /> Slack · Email · Push
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 order-1 lg:order-2 reveal">
          <div className="section-num">§ 03 — PLAZOS</div>
          <h3 className="h2-display text-[46px] sm:text-[64px] text-ink mt-3">
            Los plazos,
            <br />
            <em>resueltos</em>.
          </h3>
          <p className="mt-6 text-[16.5px] text-[#6B6B6B] max-w-md">
            Cómputo automático según LEC, LECrim o LRJS. Alertas escalonadas en
            el canal que prefieras. Duermes tranquilo.
          </p>
          <ul className="mt-8 space-y-3.5 text-[14.5px] text-[#1a1a1a]">
            <li className="flex gap-3">
              <CalendarCheck className="w-4 h-4 text-[#B54534] mt-0.5" /> Días hábiles automáticos
            </li>
            <li className="flex gap-3">
              <MapPin className="w-4 h-4 text-[#B54534] mt-0.5" /> Festivos por partido judicial
            </li>
            <li className="flex gap-3">
              <Calendar className="w-4 h-4 text-[#B54534] mt-0.5" /> Integración nativa con tu calendario
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function PlazoRow({
  days,
  color,
  urg,
  unit,
  title,
  sub,
  chips,
}: {
  days: string
  color: string
  urg: string
  unit: string
  title: string
  sub: string
  chips?: { label: string; active: boolean }[]
}) {
  return (
    <div className="flex items-start gap-5">
      <div className="text-right w-20 shrink-0">
        <div className={`serif text-[56px] leading-none ${color}`}>{days}</div>
        <div className="font-mono-j text-[10.5px] text-[#6B6B6B] mt-1">{unit}</div>
      </div>
      <div className="flex-1 border-l border-[#E5E5E5] pl-5">
        <div className="flex items-center gap-2">
          <span className={`status-dot ${urg}`}></span>
          <span className="text-[13.5px] font-medium">{title}</span>
        </div>
        <div className="text-[12.5px] text-[#6B6B6B] mt-1">{sub}</div>
        {chips && (
          <div className="mt-2 flex gap-2">
            {chips.map((c) => (
              <span
                key={c.label}
                className={
                  c.active
                    ? "font-mono-j text-[10.5px] text-[#B54534] border border-[#B54534]/40 bg-[#B54534]/5 rounded px-1.5 py-0.5"
                    : "font-mono-j text-[10.5px] text-[#6B6B6B] border border-[#E5E5E5] rounded px-1.5 py-0.5"
                }
              >
                {c.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FeatureLexnet() {
  return (
    <div
      id="lexnet"
      className="max-w-[1360px] mx-auto px-6 lg:px-10 py-24 lg:py-32 border-t border-[#EFEFEF]"
    >
      <div className="grid lg:grid-cols-12 gap-14 items-center">
        <div className="lg:col-span-5 reveal">
          <div className="section-num">§ 04 — LEXNET</div>
          <h3 className="h2-display text-[46px] sm:text-[64px] text-ink mt-3">
            Lexnet, <em>sin</em>
            <br />
            el dolor de Lexnet.
          </h3>
          <p className="mt-6 text-[16.5px] text-[#6B6B6B] max-w-md">
            Descarga, clasificación y vinculación automática de notificaciones
            al expediente correspondiente. El tiempo que recuperas compensa la
            suscripción.
          </p>
          <ul className="mt-8 space-y-3.5 text-[14.5px] text-[#1a1a1a]">
            <li className="flex gap-3">
              <DownloadCloud className="w-4 h-4 text-[#B54534] mt-0.5" /> Descarga desatendida
            </li>
            <li className="flex gap-3">
              <ScanText className="w-4 h-4 text-[#B54534] mt-0.5" /> Extracción OCR
            </li>
            <li className="flex gap-3">
              <Link2 className="w-4 h-4 text-[#B54534] mt-0.5" /> Vinculación automática por NIG
            </li>
          </ul>
        </div>

        <div className="lg:col-span-7 reveal">
          <div className="rounded-[10px] border border-[#E5E5E5] bg-white overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5E5E5] bg-[#F9F9F9]">
              <div className="flex items-center gap-2">
                <Inbox className="w-4 h-4" />
                <span className="text-[13px] font-medium">Bandeja Lexnet</span>
                <span className="font-mono-j text-[11px] text-[#B54534] bg-[#B54534]/10 rounded px-1.5 py-0.5">
                  7 nuevas
                </span>
              </div>
              <span className="font-mono-j text-[11px] text-[#6B6B6B]">auto-sync · hace 12 min</span>
            </div>
            <ul className="divide-y divide-[#E5E5E5]">
              <li className="px-5 py-3.5 flex items-start gap-4 relative">
                <span className="absolute left-0 top-0 h-full w-0.5 bg-[#B54534]"></span>
                <span className="w-8 h-8 rounded-md bg-[#B54534]/10 text-[#B54534] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13.5px] text-ink font-medium truncate">
                      Diligencia de ordenación · Vista señalada
                    </span>
                    <span className="font-mono-j text-[11px] text-[#6B6B6B] shrink-0">hoy · 09:14</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-[11.5px] text-[#6B6B6B] font-mono-j flex-wrap">
                    <span className="inline-flex items-center gap-1 border border-[#E5E5E5] bg-white rounded px-1.5 py-0.5">
                      <Folder className="w-3 h-3 text-ink" /> EXP-2026-247
                    </span>
                    <span className="inline-flex items-center gap-1 text-[#10B981]">
                      <Sparkles className="w-3 h-3" /> vinculado automáticamente
                    </span>
                  </div>
                </div>
              </li>
              <LexnetItem
                title="Auto admitiendo recurso de reposición"
                time="hoy · 08:42"
                exp="EXP-2026-189"
                meta="Juzg. Social nº 3 Valencia"
              />
              <LexnetItem
                title="Emplazamiento al demandado"
                time="ayer"
                exp="EXP-2026-412"
                meta="NIG 08019-42-1-2026-014"
              />
              <li className="px-5 py-3.5 flex items-start gap-4 opacity-70">
                <span className="w-8 h-8 rounded-md bg-[#F9F9F9] text-[#6B6B6B] flex items-center justify-center shrink-0">
                  <CheckCheck className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] text-[#6B6B6B] truncate">
                      Providencia · Traslado a las partes
                    </span>
                    <span className="font-mono-j text-[11px] text-[#6B6B6B] shrink-0">23/04</span>
                  </div>
                  <div className="mt-1 text-[11.5px] text-[#6B6B6B] font-mono-j">
                    archivada · EXP-2026-302
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function LexnetItem({
  title,
  time,
  exp,
  meta,
}: {
  title: string
  time: string
  exp: string
  meta: string
}) {
  return (
    <li className="px-5 py-3.5 flex items-start gap-4">
      <span className="w-8 h-8 rounded-md bg-[#F9F9F9] text-[#1a1a1a] flex items-center justify-center shrink-0">
        <FileText className="w-4 h-4" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[13.5px] text-ink font-medium truncate">{title}</span>
          <span className="font-mono-j text-[11px] text-[#6B6B6B] shrink-0">{time}</span>
        </div>
        <div className="mt-1.5 flex items-center gap-2 text-[11.5px] text-[#6B6B6B] font-mono-j">
          <span className="inline-flex items-center gap-1 border border-[#E5E5E5] bg-white rounded px-1.5 py-0.5">
            <Folder className="w-3 h-3" /> {exp}
          </span>
          <span>{meta}</span>
        </div>
      </div>
    </li>
  )
}

function FeatureMinutas() {
  return (
    <div className="max-w-[1360px] mx-auto px-6 lg:px-10 py-24 lg:py-32 border-t border-[#EFEFEF]">
      <div className="grid lg:grid-cols-12 gap-14 items-center">
        <div className="lg:col-span-7 order-2 lg:order-1 reveal">
          <div className="rounded-[10px] border border-[#E5E5E5] bg-white overflow-hidden">
            <div className="grid grid-cols-12">
              <div className="col-span-12 md:col-span-8 border-r border-[#E5E5E5]">
                <div className="p-6 border-b border-[#E5E5E5]">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-mono-j text-[10.5px] text-[#6B6B6B] tracking-wider">
                        MINUTA · #2026/0214
                      </div>
                      <div className="serif text-[28px] text-ink mt-1 tracking-tight">
                        Antonio Martínez Ruiz
                      </div>
                      <div className="font-mono-j text-[11px] text-[#6B6B6B] mt-0.5">
                        Emitida 22/04/2026 · vence 22/05
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="serif text-[40px] leading-none text-ink">1.932,10 €</div>
                      <div className="font-mono-j text-[11px] text-[#6B6B6B] mt-1">IVA incl.</div>
                    </div>
                  </div>
                </div>
                <div className="p-6 text-[12.5px]">
                  <div className="grid grid-cols-12 gap-2 pb-2 border-b border-[#E5E5E5] font-mono-j text-[10px] text-[#6B6B6B] tracking-wider uppercase">
                    <div className="col-span-6">Concepto</div>
                    <div className="col-span-2 text-right">Horas</div>
                    <div className="col-span-2 text-right">€/h</div>
                    <div className="col-span-2 text-right">Subtotal</div>
                  </div>
                  <MinutaRow concept="Estudio y preparación de la demanda" hours="8,50" rate="120,00" total="1.020,00" />
                  <MinutaRow concept="Asistencia a vista y alegaciones" hours="4,00" rate="150,00" total="600,00" />
                  <MinutaRow concept="Redacción y seguimiento" hours="3,25" rate="120,00" total="390,00" noBorder />
                </div>
              </div>
              <div className="col-span-12 md:col-span-4 bg-[#F9F9F9]/60">
                <div className="p-5 border-b border-[#E5E5E5]">
                  <div className="font-mono-j text-[10.5px] text-[#6B6B6B] tracking-wider mb-2">
                    ESTADO DEL COBRO
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-ink">
                    <span className="status-dot bg-[#10B981]"></span> Enviada · pendiente
                  </div>
                  <div className="mt-4 h-1 w-full bg-[#E5E5E5] rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-ink rounded-full"></div>
                  </div>
                  <div className="mt-2 flex items-center justify-between font-mono-j text-[10.5px] text-[#6B6B6B]">
                    <span>provisión</span>
                    <span>envío</span>
                    <span className="text-ink">cobro</span>
                  </div>
                </div>
                <div className="p-5 border-b border-[#E5E5E5] space-y-2 text-[12.5px]">
                  <div className="flex justify-between">
                    <span className="text-[#6B6B6B]">Provisión</span>
                    <span className="text-ink">500,00 €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B6B6B]">Pendiente</span>
                    <span className="text-ink">1.432,10 €</span>
                  </div>
                </div>
                <div className="p-5 space-y-2 text-[12px]">
                  <div className="flex items-center gap-2 text-[#6B6B6B]">
                    <BadgeCheck className="w-3.5 h-3.5 text-[#10B981]" /> Verifactu · AEAT
                  </div>
                  <div className="flex items-center gap-2 text-[#6B6B6B]">
                    <PenTool className="w-3.5 h-3.5" /> Firma digital
                  </div>
                  <div className="flex items-center gap-2 text-[#6B6B6B]">
                    <CreditCard className="w-3.5 h-3.5" /> Pago online
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 order-1 lg:order-2 reveal">
          <div className="section-num">§ 05 — MINUTAS</div>
          <h3 className="h2-display text-[46px] sm:text-[64px] text-ink mt-3">
            Factura lo que trabajas.
            <br />
            <em>Cobra</em> lo que facturas.
          </h3>
          <p className="mt-6 text-[16.5px] text-[#6B6B6B] max-w-md">
            Cronómetro por expediente, generación de minutas profesionales y
            envío con firma digital. Con seguimiento de cobros integrado.
          </p>
          <ul className="mt-8 space-y-3.5 text-[14.5px] text-[#1a1a1a]">
            <li className="flex gap-3">
              <ReceiptIcon className="w-4 h-4 text-[#B54534] mt-0.5" /> Verifactu compatible
            </li>
            <li className="flex gap-3">
              <Wallet className="w-4 h-4 text-[#B54534] mt-0.5" /> Provisiones de fondos
            </li>
            <li className="flex gap-3">
              <CreditCard className="w-4 h-4 text-[#B54534] mt-0.5" /> Pago online integrado
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function MinutaRow({
  concept,
  hours,
  rate,
  total,
  noBorder,
}: {
  concept: string
  hours: string
  rate: string
  total: string
  noBorder?: boolean
}) {
  return (
    <div
      className={`grid grid-cols-12 gap-2 py-2.5 ${noBorder ? "" : "border-b border-[#EFEFEF]"}`}
    >
      <div className="col-span-6 text-ink">{concept}</div>
      <div className="col-span-2 text-right text-[#1a1a1a]">{hours}</div>
      <div className="col-span-2 text-right text-[#1a1a1a]">{rate}</div>
      <div className="col-span-2 text-right text-ink">{total}</div>
    </div>
  )
}
