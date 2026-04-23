import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { lexnetNotifications, deadlines, cases } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import {
  parseXmlMetadata,
  calculateDeadline,
  detectNotificationType,
} from "@/lib/lexnet/parser"

export const maxDuration = 60

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id)
    return Response.json({ error: "No autorizado" }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return Response.json(
        { error: "No se ha proporcionado ningún archivo" },
        { status: 400 }
      )
    }

    const fileName = file.name.toLowerCase()

    // Handle ZIP files
    if (fileName.endsWith(".zip")) {
      // Dynamic import to avoid bundling issues
      const JSZip = (await import("jszip")).default
      const buffer = Buffer.from(await file.arrayBuffer())
      const zip = await JSZip.loadAsync(buffer)

      const results: Array<{
        notificationId: string
        deadlineId: string | null
        subject: string
      }> = []

      // Find XML files in the ZIP
      const xmlFiles = Object.keys(zip.files).filter((name) =>
        name.toLowerCase().endsWith(".xml")
      )
      const pdfFiles = Object.keys(zip.files).filter((name) =>
        name.toLowerCase().endsWith(".pdf")
      )

      if (xmlFiles.length === 0) {
        // No XML, try to create notification from PDF filename
        for (const pdfName of pdfFiles) {
          const notification = await createNotificationFromPdf(
            session.user.id,
            pdfName,
            file.name
          )
          results.push(notification)
        }

        if (results.length === 0) {
          return Response.json(
            {
              error:
                "El ZIP no contiene archivos XML ni PDF válidos de LexNET",
            },
            { status: 400 }
          )
        }
      } else {
        // Parse each XML file
        for (const xmlName of xmlFiles) {
          const xmlContent = await zip.files[xmlName].async("string")
          const parsed = parseXmlMetadata(xmlContent)

          // Try to match with a case by NIG or case number
          let caseId: string | null = null
          if (parsed.nig || parsed.caseNumber) {
            const matchingCase = await db.query.cases.findFirst({
              where: and(
                eq(cases.userId, session.user.id),
                parsed.nig
                  ? eq(cases.nig, parsed.nig)
                  : parsed.caseNumber
                    ? eq(cases.caseNumber, parsed.caseNumber)
                    : undefined
              ),
            })
            if (matchingCase) caseId = matchingCase.id
          }

          // Create notification
          const [notification] = await db
            .insert(lexnetNotifications)
            .values({
              userId: session.user.id,
              caseId,
              lexnetId: parsed.lexnetId || null,
              type: parsed.type || "other",
              subject: parsed.subject || `Notificación de ${xmlName}`,
              sender: parsed.sender || parsed.court || null,
              receivedAt: parsed.receivedAt || new Date(),
              metadata: xmlContent,
            })
            .returning()

          // Calculate and create deadline if we have a case
          let deadlineId: string | null = null
          if (caseId) {
            const deadline = calculateDeadline(
              notification.receivedAt,
              notification.type,
              notification.subject
            )

            const [dl] = await db
              .insert(deadlines)
              .values({
                userId: session.user.id,
                caseId,
                notificationId: notification.id,
                title: deadline.title,
                description: `${deadline.businessDays} días hábiles desde notificación efectiva`,
                dueDate: deadline.dueDate,
                alertDays: deadline.businessDays <= 5 ? 2 : 3,
              })
              .returning()

            deadlineId = dl.id
          }

          results.push({
            notificationId: notification.id,
            deadlineId,
            subject: notification.subject,
          })
        }
      }

      return Response.json({
        success: true,
        count: results.length,
        notifications: results,
      })
    }

    // Handle individual XML file
    if (fileName.endsWith(".xml")) {
      const xmlContent = await file.text()
      const parsed = parseXmlMetadata(xmlContent)

      const [notification] = await db
        .insert(lexnetNotifications)
        .values({
          userId: session.user.id,
          lexnetId: parsed.lexnetId || null,
          type: parsed.type || "other",
          subject: parsed.subject || "Notificación LexNET",
          sender: parsed.sender || null,
          receivedAt: parsed.receivedAt || new Date(),
          metadata: xmlContent,
        })
        .returning()

      return Response.json({
        success: true,
        count: 1,
        notifications: [
          {
            notificationId: notification.id,
            deadlineId: null,
            subject: notification.subject,
          },
        ],
      })
    }

    return Response.json(
      { error: "Formato no soportado. Sube un archivo ZIP o XML de LexNET." },
      { status: 400 }
    )
  } catch (error) {
    console.error("[lexnet-upload]", error)
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Error al procesar archivo",
      },
      { status: 500 }
    )
  }
}

async function createNotificationFromPdf(
  userId: string,
  pdfName: string,
  zipName: string
) {
  const type = detectNotificationType(pdfName)
  const [notification] = await db
    .insert(lexnetNotifications)
    .values({
      userId,
      type,
      subject: pdfName.replace(/\.pdf$/i, "").replace(/_/g, " "),
      sender: null,
      receivedAt: new Date(),
    })
    .returning()

  return {
    notificationId: notification.id,
    deadlineId: null,
    subject: notification.subject,
  }
}
