"use client"

import { useEffect, useState } from "react"
import { Check, AlertTriangle, X, RefreshCw, Send, Loader2 } from "lucide-react"

type CheckStatus = "ok" | "warn" | "fail" | "skip"
type Check = {
  id: string
  label: string
  status: CheckStatus
  detail: string
  testable?: boolean
  testEndpoint?: string
}

type TestResult = {
  ok: boolean
  message?: string
  detail?: string
  error?: string
}

export function DiagnosticsRunner() {
  const [checks, setChecks] = useState<Check[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, TestResult>>({})
  const [phone, setPhone] = useState<string>("")

  async function refresh() {
    setLoading(true)
    try {
      const res = await fetch("/api/diagnostics", { cache: "no-store" })
      const data = await res.json()
      setChecks(data.checks ?? [])
    } catch (err) {
      console.error(err)
      setChecks([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function runTest(check: Check) {
    if (!check.testEndpoint) return
    setRunning(check.id)
    try {
      const body =
        check.id === "whatsapp" ? JSON.stringify({ phone }) : undefined
      const res = await fetch(check.testEndpoint, {
        method: "POST",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body,
      })
      const data: TestResult = await res.json()
      setResults((r) => ({ ...r, [check.id]: data }))
    } catch (err) {
      setResults((r) => ({
        ...r,
        [check.id]: { ok: false, error: err instanceof Error ? err.message : "Error" },
      }))
    } finally {
      setRunning(null)
    }
  }

  if (loading && !checks) {
    return (
      <div className="text-[13.5px] text-[#6B6B6B] flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Comprobando…
      </div>
    )
  }
  if (!checks?.length) {
    return <div className="text-[13.5px] text-[#B54534]">No se pudo cargar el diagnóstico.</div>
  }

  return (
    <div>
      <ul className="divide-y divide-[#EFEFEF]">
        {checks.map((c) => (
          <li key={c.id} className="py-4 flex items-start gap-4">
            <StatusBadge status={c.status} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[14px] text-[#0A0A0A] font-medium">{c.label}</span>
                <span className={`jur-badge ${badgeClass(c.status)}`}>
                  {labelFor(c.status)}
                </span>
              </div>
              <div className="text-[12.5px] text-[#6B6B6B] mt-1">{c.detail}</div>
              {results[c.id] && (
                <div
                  className={`mt-2 inline-block text-[12.5px] px-3 py-1.5 rounded ${
                    results[c.id].ok
                      ? "bg-[#E6F5EE] text-[#0B6B4F]"
                      : "bg-[#F6E9E5] text-[#8A2F22]"
                  }`}
                >
                  {results[c.id].ok ? "✓ " : "✗ "}
                  {results[c.id].message ?? results[c.id].error}
                  {results[c.id].detail && (
                    <span className="block mt-0.5 jur-mono text-[10.5px] opacity-70">
                      {results[c.id].detail}
                    </span>
                  )}
                </div>
              )}
            </div>

            {c.testable && c.testEndpoint && (
              <div className="flex items-center gap-2 shrink-0">
                {c.id === "whatsapp" && (
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+34 600 000 000"
                    className="w-[180px] rounded-md border border-[#E5E5E5] bg-white px-3 py-2 text-[12.5px] text-[#0A0A0A] placeholder:text-[#A0A0A0] focus:outline-none focus:border-[#B54534] focus:ring-2 focus:ring-[#B54534]/20"
                  />
                )}
                <button
                  type="button"
                  onClick={() => runTest(c)}
                  disabled={running === c.id}
                  className="jur-btn-solid disabled:opacity-50"
                >
                  {running === c.id ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Probando…
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Probar
                    </>
                  )}
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-5 pt-4 border-t border-[#EFEFEF] flex items-center justify-between gap-3">
        <p className="text-[12.5px] text-[#6B6B6B]">
          Última comprobación: {new Date().toLocaleString("es-ES")}
        </p>
        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="jur-btn-ghost"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Actualizar estado
        </button>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: CheckStatus }) {
  const cls =
    status === "ok"
      ? "bg-[#E6F5EE] text-[#0B6B4F]"
      : status === "warn"
      ? "bg-[#FEF4E2] text-[#8A5A0B]"
      : status === "fail"
      ? "bg-[#F6E9E5] text-[#B54534]"
      : "bg-[#F9F9F9] text-[#6B6B6B]"
  const Icon =
    status === "ok" ? Check : status === "fail" ? X : AlertTriangle
  return (
    <span
      className={`w-9 h-9 rounded-md shrink-0 flex items-center justify-center ${cls}`}
    >
      <Icon className="w-4 h-4" strokeWidth={status === "ok" ? 3 : 2} />
    </span>
  )
}

function badgeClass(status: CheckStatus) {
  if (status === "ok") return "jur-badge-ok"
  if (status === "warn") return "jur-badge-warn"
  if (status === "fail") return "jur-badge-clay"
  return "jur-badge-gray"
}
function labelFor(status: CheckStatus) {
  if (status === "ok") return "OK"
  if (status === "warn") return "Atención"
  if (status === "fail") return "Falla"
  return "—"
}
