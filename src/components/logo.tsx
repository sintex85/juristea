type Props = { className?: string; mark?: boolean; size?: "sm" | "md" | "lg" }

const SIZES = {
  sm: { mark: 22, font: 18 },
  md: { mark: 26, font: 22 },
  lg: { mark: 36, font: 32 },
} as const

/**
 * Juristea logo — sans-serif "J" wordmark with terracotta dot.
 * <Logo /> renders the full wordmark, <Logo mark /> renders just the icon.
 * `className` controls color (e.g. "text-[#0A0A0A]" or "text-white").
 */
export function Logo({ className = "text-[#0A0A0A]", mark = false, size = "md" }: Props) {
  const s = SIZES[size]
  return (
    <span
      className={`inline-flex items-baseline gap-1 leading-none ${className}`}
      style={{ fontFamily: "var(--font-geist), system-ui, sans-serif" }}
      aria-label="Juristea"
    >
      <LogoMark pixelSize={s.mark} />
      {!mark && (
        <span
          style={{
            fontSize: s.font,
            fontWeight: 500,
            letterSpacing: "-0.04em",
          }}
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
        x="20"
        y="50"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        fontSize="60"
        fontWeight="500"
        fill="currentColor"
        letterSpacing="-0.04em"
      >
        J
      </text>
      <circle cx="44" cy="48" r="4" fill="#B54534" />
    </svg>
  )
}
