type Props = { className?: string; mark?: boolean; size?: "sm" | "md" | "lg" }

const SIZES = {
  sm: { mark: 22, font: 18 },
  md: { mark: 26, font: 24 },
  lg: { mark: 36, font: 34 },
} as const

/**
 * Juristea logo — italic serif "J" with terracotta dot.
 * Use `<Logo />` for the full wordmark, or `<Logo mark />` for the icon only.
 * `className` should set the text color (e.g. "text-[#0A0A0A]" or "text-white").
 */
export function Logo({ className = "text-[#0A0A0A]", mark = false, size = "md" }: Props) {
  const s = SIZES[size]
  return (
    <span
      className={`inline-flex items-baseline gap-1.5 leading-none ${className}`}
      style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
      aria-label="Juristea"
    >
      <LogoMark className={mark ? "" : ""} pixelSize={s.mark} />
      {!mark && (
        <span
          className="font-normal"
          style={{ fontSize: s.font, letterSpacing: "-0.02em" }}
        >
          uristea
        </span>
      )}
    </span>
  )
}

export function LogoMark({
  className = "text-[#0A0A0A]",
  pixelSize = 26,
}: {
  className?: string
  pixelSize?: number
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={pixelSize}
      height={pixelSize}
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      <text
        x="34"
        y="50"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', Times, serif"
        fontSize="60"
        fontWeight="400"
        fontStyle="italic"
        fill="currentColor"
      >
        J
      </text>
      <circle cx="48" cy="48" r="3.5" fill="#B54534" />
    </svg>
  )
}
