import type { EventType } from "./types"

/** Per-event-type palette: solid (chip background), bg (light fill), text */
export const TYPE_COLORS: Record<
  EventType,
  { solid: string; bg: string; text: string; ring: string; label: string }
> = {
  vista: {
    solid: "#B54534",
    bg: "#F6E9E5",
    text: "#8A2F22",
    ring: "rgba(181,69,52,0.35)",
    label: "Vista",
  },
  juicio: {
    solid: "#8A2F22",
    bg: "#F6E9E5",
    text: "#8A2F22",
    ring: "rgba(138,47,34,0.35)",
    label: "Juicio",
  },
  reunion: {
    solid: "#1B3A4B",
    bg: "#E8EEF1",
    text: "#0E2531",
    ring: "rgba(27,58,75,0.35)",
    label: "Reunión",
  },
  llamada: {
    solid: "#6B7280",
    bg: "#F1F1F1",
    text: "#374151",
    ring: "rgba(107,114,128,0.35)",
    label: "Llamada",
  },
  plazo: {
    solid: "#F59E0B",
    bg: "#FEF4E2",
    text: "#8A5A0B",
    ring: "rgba(245,158,11,0.35)",
    label: "Plazo",
  },
  declaracion: {
    solid: "#10B981",
    bg: "#E6F5EE",
    text: "#0B6B4F",
    ring: "rgba(16,185,129,0.35)",
    label: "Declaración",
  },
  mediacion: {
    solid: "#7C3AED",
    bg: "#EDE7F8",
    text: "#5A2BA3",
    ring: "rgba(124,58,237,0.35)",
    label: "Mediación",
  },
  otro: {
    solid: "#0A0A0A",
    bg: "#F2F2F2",
    text: "#0A0A0A",
    ring: "rgba(10,10,10,0.35)",
    label: "Otro",
  },
}

export function colorFor(type: EventType) {
  return TYPE_COLORS[type] ?? TYPE_COLORS.otro
}
