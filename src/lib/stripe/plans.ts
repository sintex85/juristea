export const PLANS = {
  free: {
    name: "Solo",
    price: 0,
    description: "Para abogados individuales",
    maxCases: 5,
    maxNotifications: 20,
    timeTracking: false,
    aiSummaries: false,
    features: [
      "5 expedientes",
      "20 notificaciones/mes",
      "Cálculo de plazos",
      "Alertas por email",
      "Soporte por email",
    ],
  },
  pro: {
    name: "Despacho",
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    price: 29,
    description: "Para despachos profesionales",
    maxCases: Infinity,
    maxNotifications: Infinity,
    timeTracking: true,
    aiSummaries: true,
    features: [
      "Expedientes ilimitados",
      "Notificaciones ilimitadas",
      "Resúmenes con IA",
      "Email + Telegram",
      "Control de tiempo",
      "Exportar facturación",
      "Sin branding Juristea",
    ],
  },
} as const

export type PlanKey = keyof typeof PLANS
