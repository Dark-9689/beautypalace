"use client"

import { Phone, Clock, MapPin, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useScrollReveal } from "@/hooks/useScrollReveal"

export default function ContactSection() {
  const sectionRef = useScrollReveal()

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Hi Beauty Palace! I'm interested in booking an appointment. Could you please help me with the available slots and services?",
    )
    const phoneNumber = "1234567890"
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
  }

  const handleCallClick = () => {
    window.location.href = "tel:+1234567890"
  }

  return (
    <section ref={sectionRef} id="contact" className="py-16 sm:py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16 reveal-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary-foreground font-serif px-4">
            Get In Touch
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Ready to transform your look? Contact us today to schedule your appointment or ask any questions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-6 reveal-left">
            {/* Location Card */}
            <div className="modern-card p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 font-serif text-primary-foreground">Visit Our Salon</h3>
                  <p className="text-muted-foreground mb-4">
                    Beauty Palace Saswad
                    <br />
                    Pune, Maharashtra, India
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Located in the heart of Saswad, easily accessible with parking available.
                  </p>
                </div>
              </div>
            </div>

            {/* Hours Card */}
            <div className="modern-card p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-2xl">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 font-serif text-primary-foreground">Opening Hours</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monday - Friday</span>
                      <span className="font-medium">9:00 AM - 7:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saturday</span>
                      <span className="font-medium">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sunday</span>
                      <span className="font-medium">10:00 AM - 4:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Actions - Smaller Icons */}
            <div className="modern-card p-6">
              <h3 className="text-xl font-bold mb-6 font-serif text-primary-foreground text-center">
                Contact Us Directly
              </h3>
              <div className="flex gap-4">
                {/* WhatsApp Button - Smaller */}
                <Button
                  onClick={handleWhatsAppClick}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <MessageCircle size={18} />
                  <span>WhatsApp</span>
                </Button>

                {/* Call Button - Smaller */}
                <Button
                  onClick={handleCallClick}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Phone size={18} />
                  <span>Call Now</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="reveal-right">
            <div className="modern-card p-2 h-full min-h-[500px]">
              <div className="h-full rounded-2xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3786.9457599877355!2d74.02212947436364!3d18.349758774371242!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2ef7ed6aaa8c7%3A0xf1e503b9eb70e8db!2sBeauty%20Palace%20saswad!5e0!3m2!1sen!2sin!4v1749835756248!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "450px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Beauty Palace Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
