"use client"
import { AdminHeader } from "@/components/admin/admin-header"
import { MediaManager } from "@/components/admin/media-manager"

export default function MediaPage() {
  return (
    <div className="p-6">
      <AdminHeader title="Media Management" description="Manage ImageKit.io URLs for website images" />

      <div className="mt-6">
        <MediaManager />
      </div>
    </div>
  )
}
