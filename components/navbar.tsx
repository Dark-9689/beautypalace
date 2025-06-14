"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Phone, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { gsap } from "@/lib/gsap"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuContentRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuContentRef.current && !menuContentRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false)
    }
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen, handleClickOutside])

  useEffect(() => {
    if (isMenuOpen && menuRef.current && menuContentRef.current) {
      gsap.fromTo(menuRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" })

      gsap.fromTo(
        menuContentRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", delay: 0.1 },
      )
    }
  }, [isMenuOpen])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleNavClick = (id: string) => {
    setIsMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleLogoClick = () => {
    router.push("/")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-lg" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 py-3 max-w-7xl">
        <div className="flex items-center justify-between">
          <button onClick={handleLogoClick} className="flex items-center cursor-pointer">
            <span
              className={cn(
                "text-2xl font-bold font-serif transition-colors",
                isScrolled ? "text-primary-foreground" : "text-white",
              )}
            >
              Beauty Palace
            </span>
          </button>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white bg-primary-foreground/90 p-2 rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {[
              { name: "Home", id: "home" },
              { name: "Services", id: "services" },
              { name: "Offers", id: "offers" },
              { name: "Book", id: "book-appointment" },
              { name: "Reviews", id: "reviews" },
              { name: "Contact", id: "contact" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary-foreground",
                  isScrolled ? "text-foreground" : "text-white",
                )}
              >
                {item.name}
              </button>
            ))}
            <Button className="modern-btn" onClick={() => (window.location.href = "tel:+1234567890")}>
              <Phone size={16} />
              <span>Call Now</span>
            </Button>
          </nav>
        </div>
      </div>

      {isMenuOpen && (
        <div ref={menuRef} className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 pt-20 px-4">
          <div ref={menuContentRef} className="modern-card rounded-2xl p-6 mx-auto max-w-sm w-full">
            <nav className="flex flex-col space-y-6 items-center">
              {[
                { name: "Home", id: "home" },
                { name: "Services", id: "services" },
                { name: "Offers", id: "offers" },
                { name: "Book Appointment", id: "book-appointment" },
                { name: "Reviews", id: "reviews" },
                { name: "Contact", id: "contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="text-lg font-medium text-primary-foreground hover:text-primary-foreground/80 font-serif"
                >
                  {item.name}
                </button>
              ))}
              <Button
                className="modern-btn w-full py-6 rounded-lg flex items-center justify-center gap-2 mt-4"
                onClick={() => {
                  window.location.href = "tel:+1234567890"
                  setIsMenuOpen(false)
                }}
              >
                <Phone size={18} />
                <span className="text-lg">Call Now</span>
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
