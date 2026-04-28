import type { Metadata } from "next"
import { Geist, Instrument_Serif, JetBrains_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/components/providers"
import "./globals.css"

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
})

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  // icons resolved automatically from src/app/icon.svg + apple-icon.svg
  title: {
    default: "Juristea — Gestiona tu despacho y controla tus plazos",
    template: "%s | Juristea",
  },
  description:
    "Juristea centraliza expedientes, notificaciones de LexNET y plazos procesales. Cálculo automático de plazos, alertas y gestión de expedientes para abogados. Desde 0 EUR/mes.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    siteName: "Juristea",
    title: "Juristea — Gestiona tu despacho y controla tus plazos",
    description:
      "Expedientes, notificaciones LexNET y plazos procesales en una sola plataforma. Para abogados que no quieren perder ni un plazo.",
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Juristea — Gestión de despachos y plazos procesales",
    description:
      "Centraliza expedientes y notificaciones de LexNET. Cálculo automático de plazos. Alertas por email y Telegram.",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${geist.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
