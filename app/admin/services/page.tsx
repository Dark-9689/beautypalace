"use client"

import { useState } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { ServicesList } from "@/components/admin/services-list"
import { ServiceDialog } from "@/components/admin/service-dialog"

export default function ServicesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="p-6">
      <AdminHeader
        title="Services Management"
        description="Manage your salon's service offerings"
        action={{
          label: "Add Service",
          onClick: () => setIsDialogOpen(true),
        }}
      />

      <ServicesList />

      <ServiceDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}
