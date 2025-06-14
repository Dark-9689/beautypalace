import type React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="flex-1 md:mr-64">{children}</div>
      <AdminSidebar />
    </div>
  )
}
