"use client"

import { useEffect } from "react"

export function LandingEffects() {
  useEffect(() => {
    const nav = document.getElementById("landing-nav")
    const onScroll = () => {
      if (!nav) return
      if (window.scrollY > 8) nav.classList.add("nav-bg")
      else nav.classList.remove("nav-bg")
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in")
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => io.observe(el))

    return () => {
      window.removeEventListener("scroll", onScroll)
      io.disconnect()
    }
  }, [])

  return null
}
