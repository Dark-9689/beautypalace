"use client"

import { useEffect, useRef } from "react"
import { gsap, ScrollTrigger } from "@/lib/gsap"

export function useScrollReveal() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Reveal up animation
    const revealUpElements = element.querySelectorAll(".reveal-up")
    revealUpElements.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )
    })

    // Reveal left animation
    const revealLeftElements = element.querySelectorAll(".reveal-left")
    revealLeftElements.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )
    })

    // Reveal right animation
    const revealRightElements = element.querySelectorAll(".reveal-right")
    revealRightElements.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )
    })

    // Reveal scale animation
    const revealScaleElements = element.querySelectorAll(".reveal-scale")
    revealScaleElements.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )
    })

    // Stagger animation for multiple elements
    const staggerElements = element.querySelectorAll(".stagger-item")
    if (staggerElements.length > 0) {
      gsap.fromTo(
        staggerElements,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: staggerElements[0],
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return ref
}
