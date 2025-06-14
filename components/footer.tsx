"use client"

import { Facebook, Instagram, Twitter } from "lucide-react"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Footer() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const quickLinks = [
    { name: "Home", id: "home" },
    { name: "Services", id: "services" },
    { name: "Book Appointment", id: "book-appointment" },
    { name: "Reviews", id: "reviews" },
    { name: "Contact", id: "contact" },
  ]

  const services = [
    "Haircut & Styling",
    "Facial Treatment",
    "Hair Smoothing",
    "Keratin Treatment",
    "Waxing Services",
    "Professional Makeup",
  ]

  return (
    <footer className="bg-primary-foreground text-white py-8">
      <div className="container mx-auto px-4">
        {/* Desktop footer */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Beauty Palace</h3>
            <p className="text-white/80 mb-4">
              Premium beauty care services for women. Experience luxury and expert care at our salon.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-primary transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className="text-white/80 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service}>
                  <button
                    onClick={() => handleNavClick("services")}
                    className="text-white/80 hover:text-primary transition-colors"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <address className="not-italic text-white/80 space-y-2">
              <p>123 Beauty Street, Fashion District</p>
              <p>New York, NY 10001</p>
              <p>Phone: (123) 456-7890</p>
              <p>Email: info@beautypalace.com</p>
            </address>
          </div>
        </div>

        {/* Mobile footer - simplified and collapsible */}
        <div className="md:hidden">
          <div className="flex justify-center mb-6">
            <h3 className="text-xl font-bold">Beauty Palace</h3>
          </div>

          {/* Social icons */}
          <div className="flex justify-center space-x-6 mb-8">
            <a href="#" className="text-white hover:text-primary transition-colors">
              <Facebook size={24} />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="#" className="text-white hover:text-primary transition-colors">
              <Instagram size={24} />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="#" className="text-white hover:text-primary transition-colors">
              <Twitter size={24} />
              <span className="sr-only">Twitter</span>
            </a>
          </div>

          {/* Collapsible sections */}
          <div className="space-y-4 border-t border-white/20 pt-6">
            {/* Quick Links Section */}
            <div className="border-b border-white/20 pb-2">
              <button className="flex items-center justify-between w-full py-2" onClick={() => toggleSection("links")}>
                <span className="font-medium">Quick Links</span>
                <ChevronDown
                  className={cn("h-5 w-5 transition-transform", expandedSection === "links" && "transform rotate-180")}
                />
              </button>

              {expandedSection === "links" && (
                <div className="grid grid-cols-2 gap-2 py-2">
                  {quickLinks.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className="text-white/80 text-left py-1"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Section - Always visible */}
            <div className="py-2">
              <div className="font-medium mb-2">Contact Us</div>
              <address className="not-italic text-white/80 text-sm">
                <p>123 Beauty Street, NY 10001</p>
                <p className="mt-1">Phone: (123) 456-7890</p>
              </address>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-6 pt-6 text-center text-white/60 text-sm">
          <p>&copy; {new Date().getFullYear()} Beauty Palace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
