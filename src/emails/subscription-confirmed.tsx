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

interface SubscriptionEmailProps {
  name: string
  appName: string
  appUrl: string
  planName: string
}

export function SubscriptionConfirmedEmail({
  name,
  appName,
  appUrl,
  planName,
}: SubscriptionEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Your {planName} plan is active on {appName}
      </Preview>
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
            You&apos;re on {planName}!
          </Text>
          <Text style={{ color: "#71717a", lineHeight: "1.6" }}>
            Hey {name}, your {planName} plan on {appName} is now active. You
            have access to all premium features.
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
            Explore Premium Features
          </Button>
        </Container>
      </Body>
    </Html>
  )
}
