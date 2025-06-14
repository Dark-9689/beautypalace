import { Suspense, lazy } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Lazy load components
const ServicesSection = lazy(() => import("@/components/services-section"))
const OffersSection = lazy(() => import("@/components/offers-section"))
const BookingSection = lazy(() => import("@/components/booking-section"))
const ReviewsSection = lazy(() => import("@/components/reviews-section"))
const ContactSection = lazy(() => import("@/components/contact-section"))
const Footer = lazy(() => import("@/components/footer"))

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />

      <Suspense fallback={<LoadingSection title="Our Services" />}>
        <ServicesSection />
      </Suspense>

      <Suspense fallback={<LoadingSection title="Special Offers" />}>
        <OffersSection />
      </Suspense>

      <Suspense fallback={<LoadingSection title="Book Appointment" />}>
        <BookingSection />
      </Suspense>

      <Suspense fallback={<LoadingSection title="Client Reviews" />}>
        <ReviewsSection />
      </Suspense>

      <Suspense fallback={<LoadingSection title="Contact Us" />}>
        <ContactSection />
      </Suspense>

      <Suspense fallback={<div className="h-40 bg-primary-foreground" />}>
        <Footer />
      </Suspense>
    </main>
  )
}

function LoadingSection({ title }: { title: string }) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-primary-foreground">{title}</h2>
          <LoadingSpinner />
        </div>
      </div>
    </section>
  )
}
