import { Hero } from "@/components/landing/hero"
import { Marquee } from "@/components/landing/marquee"
import { StatusQuo } from "@/components/landing/status-quo"
import { InPractice } from "@/components/landing/in-practice"
import { Features } from "@/components/landing/features"
import { Security } from "@/components/landing/security"
import { Spain } from "@/components/landing/spain"
import { Pricing } from "@/components/landing/pricing"
import { Testimonials } from "@/components/landing/testimonials"
import { FAQ } from "@/components/landing/faq"
import { Contact } from "@/components/landing/contact"
import { CTA } from "@/components/landing/cta"

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <StatusQuo />
      <InPractice />
      <Features />
      <Security />
      <Spain />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Contact />
      <CTA />
    </>
  )
}
