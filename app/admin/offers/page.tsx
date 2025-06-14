"use client"

import { useState } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { OffersList } from "@/components/admin/offers-list"
import { OfferDialog } from "@/components/admin/offer-dialog"

export default function OffersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="p-6">
      <AdminHeader
        title="Offers Management"
        description="Manage special offers and promotions"
        action={{
          label: "Add Offer",
          onClick: () => setIsDialogOpen(true),
        }}
      />

      <OffersList />

      <OfferDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}
