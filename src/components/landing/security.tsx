import { Server, Eye, HardDrive, Fingerprint } from "lucide-react"

export function Security() {
  return (
    <section className="py-28 lg:py-36 bg-[#F2ECE1] border-y border-[#E5E5E5]">
      <div className="max-w-[1360px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-14">
          <div className="lg:col-span-7 reveal">
            <div className="section-num">§ 06 — SEGURIDAD</div>
            <h2 className="h2-display text-[56px] sm:text-[84px] lg:text-[104px] text-ink mt-4">
              Confidencialidad.
              <br />
              <em>No</em> una feature.
            </h2>
          </div>
          <div className="lg:col-span-5 reveal">
            <p className="text-[17px] text-[#1a1a1a]">
              Es el cimiento. Y lo construimos desde el primer commit. Cada
              línea de código pasa por revisión de seguridad.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-6 lg:grid-cols-12 gap-4 reveal">
          <div className="col-span-6 lg:col-span-6 bento bg-ink text-white rounded-[10px] p-8 lg:p-10 flex flex-col justify-between min-h-[280px]">
            <div>
              <div className="font-mono-j text-[10.5px] text-[#9A9A9A] tracking-wider">
                CIFRADO · AES-256
              </div>
              <h4 className="serif text-[36px] sm:text-[48px] mt-3 tracking-tight">
                Cifrado extremo <em>a extremo</em>.
              </h4>
            </div>
            <div className="flex items-center gap-5 mt-8">
              <div className="font-mono-j text-[11px] text-[#9A9A9A]">en tránsito</div>
              <div className="flex-1 h-px bg-white/15"></div>
              <div className="font-mono-j text-[11px] text-[#9A9A9A]">en reposo</div>
            </div>
          </div>

          <div className="col-span-6 lg:col-span-6 bento landing-card p-8 lg:p-10 min-h-[280px] flex flex-col justify-between">
            <div>
              <div className="mono-label">LOCALIZACIÓN</div>
              <h4 className="serif text-[36px] sm:text-[48px] text-ink mt-3 tracking-tight">
                Servidores en <em>la UE</em>.
              </h4>
            </div>
            <div className="flex items-center gap-4 mt-8">
              <div className="w-10 h-10 rounded-md bg-[#F9F9F9] border border-[#E5E5E5] flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[13.5px] text-ink">Hetzner · Frankfurt, DE</div>
                <div className="font-mono-j text-[11px] text-[#6B6B6B]">
                  sin transferencias internacionales
                </div>
              </div>
            </div>
          </div>

          <SmallBento
            icon={<Eye className="w-4 h-4" />}
            title="Auditoría"
            em="completa"
            desc="Log inmutable de cada acceso y modificación."
          />
          <SmallBento
            icon={<HardDrive className="w-4 h-4" />}
            title="Backups"
            em="diarios"
            desc="Recuperación granular. Nunca perderás un expediente."
          />
          <SmallBento
            icon={<Fingerprint className="w-4 h-4" />}
            title="SSO +"
            em="2FA"
            desc="Acceso con Google, Microsoft y segundo factor."
          />
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono-j text-[11px] text-[#1a1a1a]">
          <span className="uppercase tracking-wider text-[#6B6B6B]">compliance stack —</span>
          <Compliance label="LOPDGDD" />
          <Compliance label="RGPD · art. 32" />
          <Compliance label="ENS · nivel medio" />
          <Compliance label="ISO/IEC 27001 en curso" />
          <Compliance label="SLA 99.9%" />
        </div>
      </div>
    </section>
  )
}

function SmallBento({
  icon,
  title,
  em,
  desc,
}: {
  icon: React.ReactNode
  title: string
  em: string
  desc: string
}) {
  return (
    <div className="col-span-6 lg:col-span-4 bento landing-card p-7">
      <div className="w-9 h-9 rounded-md bg-ink text-white flex items-center justify-center mb-4">
        {icon}
      </div>
      <h4 className="serif text-[24px] text-ink tracking-tight">
        {title} <em>{em}</em>
      </h4>
      <p className="text-[13.5px] text-[#6B6B6B] mt-2">{desc}</p>
    </div>
  )
}

function Compliance({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="status-dot bg-[#10B981]"></span> {label}
    </span>
  )
}
