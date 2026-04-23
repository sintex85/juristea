import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function VerifyPage() {
  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle>Check your email</CardTitle>
        <CardDescription>
          We sent you a sign-in link. Click the link in your email to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Didn&apos;t receive it? Check your spam folder or try again.
        </p>
      </CardContent>
    </Card>
  )
}
