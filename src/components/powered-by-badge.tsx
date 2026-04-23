import Link from "next/link"

export function PoweredByBadge({
  appName,
  appUrl,
}: {
  appName: string
  appUrl: string
}) {
  return (
    <Link
      href={appUrl}
      target="_blank"
      rel="noopener"
      className="fixed bottom-4 right-4 z-50 rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground shadow-sm transition-colors hover:text-foreground"
    >
      Powered by {appName}
    </Link>
  )
}
