"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { gsap } from "@/lib/gsap"
import { ArrowRight } from "lucide-react"

const heroSlides = [
  {
    image: "https://ik.imagekit.io/Beautypalace/default-image.jpg",
    title: "Premium Beauty",
    subtitle: "Care for Women",
    description:
      "Experience luxury treatments and expert care at Beauty Palace. Transform your look with our skilled professionals.",
  },
  {
    image: "https://ik.imagekit.io/Beautypalace/default-image.jpg",
    title: "Luxury Salon",
    subtitle: "Experience",
    description: "Indulge in our world-class beauty services designed to enhance your natural radiance and confidence.",
  },
  {
    image: "https://ik.imagekit.io/Beautypalace/default-image.jpg",
    title: "Expert Beauty",
    subtitle: "Professionals",
    description:
      "Our skilled team of beauty experts is dedicated to providing personalized care and exceptional results.",
  },
  {
    image: "https://ik.imagekit.io/Beautypalace/default-image.jpg",
    title: "Transform Your",
    subtitle: "Beauty Journey",
    description: "Discover the perfect blend of relaxation and transformation in our premium beauty sanctuary.",
  },
]

export function HeroSection() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLSpanElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const indicatorsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      tl.fromTo(
        titleRef.current,
        {
          y: 100,
          opacity: 0,
          scale: 0.8,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
        },
      )
        .fromTo(
          subtitleRef.current,
          {
            y: 50,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.8",
        )
        .fromTo(
          descriptionRef.current,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6",
        )
        .fromTo(
          buttonRef.current,
          {
            y: 30,
            opacity: 0,
            scale: 0.9,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4",
        )
        .fromTo(
          indicatorsRef.current,
          {
            y: 20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.2",
        )

      gsap.to(heroRef.current, {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })
    }, heroRef)

    // Increased slide duration to 8 seconds
    const interval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => {
        const newIndex = prevIndex === heroSlides.length - 1 ? 0 : prevIndex + 1
        return newIndex
      })
    }, 8000)

    return () => {
      ctx.revert()
      clearInterval(interval)
    }
  }, [])

  // Animate text changes when slide changes
  useEffect(() => {
    if (titleRef.current && subtitleRef.current && descriptionRef.current) {
      const tl = gsap.timeline()

      tl.to([titleRef.current, subtitleRef.current, descriptionRef.current], {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: "power2.in",
      }).to([titleRef.current, subtitleRef.current, descriptionRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.2,
      })
    }
  }, [currentSlideIndex])

  const handleBookNowClick = () => {
    const bookingSection = document.getElementById("book-appointment")
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const currentSlide = heroSlides[currentSlideIndex]

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center text-white overflow-hidden"
    >
      {/* Dynamic background with smooth transitions */}
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ${
            index === currentSlideIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <img
            src={slide.image || "/placeholder.svg"}
            alt={`Beauty Palace salon interior ${index + 1}`}
            className="w-full h-full object-cover"
            loading={index === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-transparent to-pink-900/40" />
        </div>
      ))}

      {/* Content */}
      <div className="container mx-auto px-4 py-32 md:py-40 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-2 font-serif leading-tight"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {currentSlide.title}
          </h1>

          <span
            ref={subtitleRef}
            className="block text-3xl sm:text-4xl md:text-6xl font-bold mb-6 font-serif leading-tight"
            style={{
              background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {currentSlide.subtitle}
          </span>

          <p
            ref={descriptionRef}
            className="text-lg sm:text-xl md:text-2xl mb-10 opacity-90 leading-relaxed max-w-2xl mx-auto px-4"
          >
            {currentSlide.description}
          </p>

          <div ref={buttonRef} className="flex justify-center px-4">
            <Button
              size="lg"
              className="modern-btn-primary text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-2xl group w-full sm:w-auto"
              onClick={handleBookNowClick}
            >
              Book Your Appointment
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced slider indicators */}
      <div ref={indicatorsRef} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlideIndex(index)}
            className={`relative overflow-hidden rounded-full transition-all duration-300 ${
              index === currentSlideIndex ? "w-12 h-3 bg-white" : "w-3 h-3 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === currentSlideIndex && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </section>
  )
}
