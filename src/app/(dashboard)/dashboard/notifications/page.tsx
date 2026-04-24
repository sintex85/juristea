import { Inbox } from "lucide-react"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { lexnetNotifications, cases } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { LexnetUploader } from "./uploader"

export default async function NotificationsPage() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return null

  const notifications = await db
    .select({
      id: lexnetNotifications.id,
      subject: lexnetNotifications.subject,
      sender: lexnetNotifications.sender,
      type: lexnetNotifications.type,
      receivedAt: lexnetNotifications.receivedAt,
      read: lexnetNotifications.read,
      caseTitle: cases.title,
    })
    .from(lexnetNotifications)
    .leftJoin(cases, eq(lexnetNotifications.caseId, cases.id))
    .where(eq(lexnetNotifications.userId, userId))
    .orderBy(desc(lexnetNotifications.receivedAt))

  const unread = notifications.filter((n) => !n.read).length

  return (
    <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-10 lg:py-12">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="jur-mono-label">LEXNET</div>
          <h1 className="jur-display text-[48px] sm:text-[56px] text-[#0A0A0A] mt-3">
            Notificaciones de <em>LexNET</em>.
          </h1>
          <p className="mt-3 text-[14.5px] text-[#6B6B6B]">
            {notifications.length} total ·{" "}
            <span className="text-[#B54534] font-medium">{unread} sin clasificar</span>
          </p>
        </div>
        <LexnetUploader />
      </div>

      <div className="mt-8 jur-card overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-14 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-[#F6E9E5] flex items-center justify-center mb-4">
              <Inbox className="h-6 w-6 text-[#B54534]" />
            </div>
            <p className="jur-serif text-[22px] text-[#0A0A0A]">No hay notificaciones todavía.</p>
            <p className="mt-2 text-[14px] text-[#6B6B6B] max-w-md mx-auto">
              Descarga el ZIP de LexNET y súbelo aquí. Extraemos los datos, asociamos el expediente y
              calculamos los plazos automáticamente.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[#EFEFEF]">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`flex items-center gap-4 px-6 py-4 jur-row-hover ${
                  !n.read ? "bg-[#FAF6F2]" : ""
                }`}
              >
                {!n.read && <span className="jur-urg-dot bg-[#B54534] shrink-0" />}
                {n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#E5E5E5] shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] text-[#0A0A0A] font-medium truncate">
                    {n.subject}
                  </div>
                  <div className="jur-mono text-[10.5px] text-[#6B6B6B] tracking-wider uppercase mt-1 truncate">
                    {n.sender ?? "REMITENTE DESCONOCIDO"}
                    {n.caseTitle && <> · {n.caseTitle}</>}
                  </div>
                </div>
                {n.type && (
                  <span className="jur-badge jur-badge-gray capitalize shrink-0">{n.type}</span>
                )}
                <span className="jur-mono text-[11px] text-[#6B6B6B] shrink-0">
                  {new Date(n.receivedAt).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
