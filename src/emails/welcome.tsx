import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Button,
  Hr,
  Preview,
} from "@react-email/components"

interface WelcomeEmailProps {
  name: string
  appName: string
  appUrl: string
}

export function WelcomeEmail({ name, appName, appUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to {appName}</Preview>
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f4f4f5" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "40px",
            borderRadius: "8px",
            margin: "40px auto",
            maxWidth: "480px",
          }}
        >
          <Text style={{ fontSize: "20px", fontWeight: "bold" }}>
            Welcome to {appName}, {name}!
          </Text>
          <Text style={{ color: "#71717a", lineHeight: "1.6" }}>
            You&apos;re all set. Your account is ready and you can start using{" "}
            {appName} right away.
          </Text>
          <Hr style={{ borderColor: "#e4e4e7", margin: "24px 0" }} />
          <Button
            href={`${appUrl}/dashboard`}
            style={{
              backgroundColor: "#18181b",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: "6px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Go to Dashboard
          </Button>
        </Container>
      </Body>
    </Html>
  )
}
