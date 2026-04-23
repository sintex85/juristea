export function Logo({ className = "h-7" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoIcon className="h-full w-auto" />
      <span
        className="font-bold tracking-tight text-[currentColor] leading-none"
        style={{ fontSize: "1.1em" }}
      >
        Juristea
      </span>
    </span>
  )
}

export function LogoIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Juristea"
    >
      <defs>
        <linearGradient
          id="bg-grad"
          x1="0"
          y1="0"
          x2="120"
          y2="120"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4f46e5" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="28" fill="url(#bg-grad)" />
      {/* Scales of justice */}
      <line x1="60" y1="30" x2="60" y2="95" stroke="white" strokeWidth="6" strokeLinecap="round" />
      <line x1="40" y1="95" x2="80" y2="95" stroke="white" strokeWidth="6" strokeLinecap="round" />
      <line x1="30" y1="42" x2="90" y2="42" stroke="white" strokeWidth="5" strokeLinecap="round" />
      <path d="M22 62 C22 70 30 76 38 76 C46 76 54 70 54 62 L38 56 Z" fill="white" fillOpacity="0.5" />
      <line x1="30" y1="42" x2="22" y2="62" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <line x1="30" y1="42" x2="54" y2="62" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <path d="M66 62 C66 70 74 76 82 76 C90 76 98 70 98 62 L82 56 Z" fill="white" fillOpacity="0.5" />
      <line x1="90" y1="42" x2="66" y2="62" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <line x1="90" y1="42" x2="98" y2="62" stroke="white" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}
