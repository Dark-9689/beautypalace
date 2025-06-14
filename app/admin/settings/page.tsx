"use client"
import { AdminHeader } from "@/components/admin/admin-header"
import { SettingsForm } from "@/components/admin/settings-form"

export default function SettingsPage() {
  return (
    <div className="p-6">
      <AdminHeader title="Settings" description="Configure your salon's notification and system settings" />

      <div className="mt-6 max-w-2xl">
        <SettingsForm />
      </div>
    </div>
  )
}
