"use client"

import { useScrollReveal } from "@/hooks/useScrollReveal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Percent, Gift, ArrowRight, Sparkles } from "lucide-react"

const offers = [
  {
    id: 1,
    title: "New Client Special",
    description: "Get 20% off your first visit to Beauty Palace and experience our premium services",
    discount: "20% OFF",
    validUntil: "Dec 31, 2024",
    terms: "Valid for first-time clients only",
    gradient: "gradient-bg",
    icon: Gift,
  },
  {
    id: 2,
    title: "Bridal Package",
    description: "Complete bridal makeover including hair, makeup, and skincare for your special day",
    discount: "30% OFF",
    validUntil: "Jan 15, 2025",
    terms: "Book 2 weeks in advance",
    gradient: "gradient-bg-2",
    icon: Gift,
  },
  {
    id: 3,
    title: "Weekend Wellness",
    description: "Facial + Hair treatment combo every Saturday & Sunday for ultimate relaxation",
    discount: "25% OFF",
    validUntil: "Ongoing",
    terms: "Weekends only",
    gradient: "gradient-bg-3",
    icon: Percent,
  },
]

export default function OffersSection() {
  const sectionRef = useScrollReveal()

  const handleBookOffer = () => {
    const bookingSection = document.getElementById("book-appointment")
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section ref={sectionRef} id="offers" className="py-16 sm:py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16 reveal-up">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-pink-100 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-red-600" />
            <span className="text-red-600 font-medium">Special Offers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary-foreground font-serif px-4">
            Exclusive Deals
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Don't miss out on our exclusive deals and limited-time offers
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {offers.map((offer, index) => (
            <OfferCard key={offer.id} offer={offer} index={index} onBook={handleBookOffer} />
          ))}
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="sm:hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {offers.map((offer, index) => (
              <div key={offer.id} className="flex-shrink-0 w-80">
                <OfferCard offer={offer} index={index} onBook={handleBookOffer} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function OfferCard({ offer, index, onBook }: { offer: any; index: number; onBook: () => void }) {
  return (
    <div className={`stagger-item group ${index % 2 === 0 ? "reveal-scale" : "reveal-up"}`}>
      <div className="modern-card h-full relative overflow-hidden rounded-3xl">
        <div className={`absolute inset-0 ${offer.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />

        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-2xl ${offer.gradient} text-white`}>
              <offer.icon size={24} />
            </div>
            <Badge className="bg-red-500 text-white font-bold px-3 py-1">{offer.discount}</Badge>
          </div>

          <h3 className="text-xl font-bold mb-2 text-primary-foreground font-serif">{offer.title}</h3>

          <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{offer.description}</p>

          <div className="space-y-2 mb-6">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock size={14} className="mr-2" />
              Valid until: {offer.validUntil}
            </div>
            <p className="text-xs text-muted-foreground italic">*{offer.terms}</p>
          </div>

          <Button
            onClick={onBook}
            className="w-full modern-btn group-hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            Claim Offer
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  )
}
