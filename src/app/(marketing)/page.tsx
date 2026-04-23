import { Hero } from "@/components/landing/hero"
import { Marquee } from "@/components/landing/marquee"
import { StatusQuo } from "@/components/landing/status-quo"
import { Features } from "@/components/landing/features"
import { Security } from "@/components/landing/security"
import { Spain } from "@/components/landing/spain"
import { Pricing } from "@/components/landing/pricing"
import { Testimonials } from "@/components/landing/testimonials"
import { FAQ } from "@/components/landing/faq"
import { CTA } from "@/components/landing/cta"

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <StatusQuo />
      <Features />
      <Security />
      <Spain />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  )
}
