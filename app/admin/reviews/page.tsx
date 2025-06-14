"use client"
import { AdminHeader } from "@/components/admin/admin-header"
import { ReviewsGrid } from "@/components/admin/reviews-grid"

export default function ReviewsPage() {
  return (
    <div className="p-6">
      <AdminHeader title="Review Management" description="Manage client reviews and testimonials" />

      <div className="mt-6">
        <ReviewsGrid />
      </div>
    </div>
  )
}
