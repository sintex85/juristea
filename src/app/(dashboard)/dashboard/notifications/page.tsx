import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { lexnetNotifications, cases } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notificaciones LexNET</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{notifications.length} notificacion{notifications.length !== 1 ? "es" : ""}</p>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-10 text-center text-muted-foreground">
          <p className="text-sm">No hay notificaciones aún.</p>
          <p className="text-sm mt-1">Sube un ZIP de LexNET para importar notificaciones.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm divide-y divide-gray-50 overflow-hidden">
          {notifications.map((n) => (
            <div key={n.id} className={`flex items-center gap-4 px-5 py-4 ${!n.read ? "bg-indigo-50/30" : ""}`}>
              <div className={`h-2 w-2 rounded-full shrink-0 ${n.read ? "bg-gray-200" : "bg-indigo-500"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground/90 truncate">{n.subject}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {n.sender && `${n.sender} · `}
                  {n.caseTitle && `${n.caseTitle} · `}
                  {new Date(n.receivedAt).toLocaleDateString("es-ES")}
                </p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0 capitalize">{n.type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
