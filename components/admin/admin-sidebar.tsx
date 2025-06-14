"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Scissors, Calendar, Star, Settings, LogOut, Menu, X, Gift, ImageIcon } from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Services", href: "/admin/services", icon: Scissors },
    { name: "Offers", href: "/admin/offers", icon: Gift },
    { name: "Appointments", href: "/admin/appointments", icon: Calendar },
    { name: "Reviews", href: "/admin/reviews", icon: Star },
    { name: "Media", href: "/admin/media", icon: ImageIcon },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  const isActive = (href: string) => {
    if (href === "/admin" && pathname === "/admin") {
      return true
    }
    return pathname?.startsWith(href) && href !== "/admin"
  }

  const handleLogoClick = () => {
    router.push("/")
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white shadow-md"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar for desktop - RIGHT SIDE */}
      <aside className="hidden md:flex flex-col w-64 bg-white/90 backdrop-blur-md border-l border-gray-200 fixed right-0 h-full shadow-xl">
        <div className="p-4 border-b">
          <button onClick={handleLogoClick} className="flex items-center gap-2 cursor-pointer">
            <div className="bg-primary-foreground text-white p-1 rounded">
              <Scissors size={18} />
            </div>
            <span className="font-bold text-lg">Beauty Palace</span>
          </button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            onClick={() => (window.location.href = "/admin/login")}
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 md:hidden">
          <div className="flex flex-col h-full pt-16">
            <div className="p-4 border-b">
              <button
                onClick={() => {
                  handleLogoClick()
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center gap-2"
              >
                <div className="bg-primary-foreground text-white p-1 rounded">
                  <Scissors size={18} />
                </div>
                <span className="font-bold text-lg">Beauty Palace</span>
              </button>
            </div>

            <nav className="flex-1 p-4">
              <ul className="space-y-3">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-4 rounded-xl transition-all ${
                        isActive(item.href)
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          : "text-gray-700 hover:bg-purple-50"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon size={22} />
                      <span className="text-lg font-medium">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-4 border-t">
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 py-4"
                onClick={() => (window.location.href = "/admin/login")}
              >
                <LogOut size={18} className="mr-2" />
                <span className="text-lg">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
