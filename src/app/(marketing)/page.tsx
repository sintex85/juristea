import { Hero } from "@/components/landing/hero"
import { Stats } from "@/components/landing/stats"
import { Problem } from "@/components/landing/problem"
import { Solution } from "@/components/landing/solution"
import { Showcase } from "@/components/landing/showcase"
import { Comparison } from "@/components/landing/comparison"
import { Agitation } from "@/components/landing/agitation"
import { Testimonials } from "@/components/landing/testimonials"
import { Pricing } from "@/components/landing/pricing"
import { FAQ } from "@/components/landing/faq"
import { CTA } from "@/components/landing/cta"

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Problem />
      <Solution />
      <Showcase />
      <Agitation />
      <Comparison />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  )
}
