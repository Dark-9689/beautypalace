"use client"

import { useScrollReveal } from "@/hooks/useScrollReveal"
import { Button } from "@/components/ui/button"
import { Clock, ArrowRight, Sparkles } from "lucide-react"

const services = [
  {
    id: 1,
    name: "Signature Haircut",
    description: "Personalized cut and styling that complements your unique features and lifestyle",
    duration: 60,
    image: "https://ik.imagekit.io/beautypalace/services/haircut.jpg",
    gradient: "gradient-bg",
    features: ["Consultation", "Wash & Cut", "Styling", "Finishing"],
  },
  {
    id: 2,
    name: "Luxury Facial",
    description: "Deep cleansing and rejuvenating treatment for radiant, healthy skin",
    duration: 75,
    image: "https://ik.imagekit.io/beautypalace/services/facial.jpg",
    gradient: "gradient-bg-2",
    features: ["Deep Cleansing", "Exfoliation", "Mask Treatment", "Moisturizing"],
  },
  {
    id: 3,
    name: "Hair Transformation",
    description: "Complete hair makeover with smoothing and professional styling",
    duration: 120,
    image: "https://ik.imagekit.io/beautypalace/services/smoothing.jpg",
    gradient: "gradient-bg-3",
    features: ["Hair Analysis", "Smoothing Treatment", "Styling", "Care Tips"],
  },
  {
    id: 4,
    name: "Keratin Therapy",
    description: "Professional treatment for stronger, healthier, and more manageable hair",
    duration: 150,
    image: "https://ik.imagekit.io/beautypalace/services/keratin.jpg",
    gradient: "gradient-bg",
    features: ["Hair Assessment", "Keratin Application", "Heat Treatment", "Aftercare"],
  },
  {
    id: 5,
    name: "Smooth Skin",
    description: "Professional waxing services for silky smooth, long-lasting results",
    duration: 30,
    image: "https://ik.imagekit.io/beautypalace/services/waxing.jpg",
    gradient: "gradient-bg-2",
    features: ["Skin Preparation", "Professional Waxing", "Soothing Treatment", "Aftercare"],
  },
  {
    id: 6,
    name: "Glamour Makeup",
    description: "Professional makeup artistry for your most special moments and occasions",
    duration: 60,
    image: "https://ik.imagekit.io/beautypalace/services/makeup.jpg",
    gradient: "gradient-bg-3",
    features: ["Consultation", "Base Application", "Eye & Lip Makeup", "Final Touch-ups"],
  },
]

export default function ServicesSection() {
  const sectionRef = useScrollReveal()

  const handleBookService = () => {
    const bookingSection = document.getElementById("book-appointment")
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section ref={sectionRef} id="services" className="py-16 sm:py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16 reveal-up">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-purple-600 font-medium">Our Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary-foreground font-serif px-4">
            Premium Beauty Treatments
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Discover our carefully curated beauty treatments designed to bring out your natural radiance
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} onBook={handleBookService} />
          ))}
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="sm:hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {services.map((service, index) => (
              <div key={service.id} className="flex-shrink-0 w-80">
                <ServiceCard service={service} index={index} onBook={handleBookService} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ service, index, onBook }: { service: any; index: number; onBook: () => void }) {
  return (
    <div
      className={`stagger-item group relative overflow-hidden rounded-3xl w-full ${
        index % 2 === 0 ? "reveal-left" : "reveal-right"
      }`}
    >
      <div className="modern-card h-full">
        <div className="relative h-48 sm:h-56 md:h-48 overflow-hidden rounded-t-3xl">
          <img
            src={service.image || "/placeholder.svg"}
            alt={`${service.name} - Beauty Palace service`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div
            className={`absolute inset-0 ${service.gradient} opacity-20 group-hover:opacity-30 transition-opacity`}
          />
        </div>

        <div className="p-4 md:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-2 text-primary-foreground font-serif group-hover:text-purple-600 transition-colors">
            {service.name}
          </h3>
          <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{service.description}</p>

          <div className="mb-4">
            <div className="flex items-center text-muted-foreground mb-3">
              <Clock size={16} className="mr-2" />
              <span className="text-sm">{service.duration} minutes</span>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-purple-600 mb-2">What's Included:</p>
              <div className="grid grid-cols-2 gap-1">
                {service.features.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-center text-xs text-muted-foreground">
                    <div className="w-1 h-1 bg-purple-400 rounded-full mr-2"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={onBook}
            className="w-full modern-btn group-hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            Book Now
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  )
}
