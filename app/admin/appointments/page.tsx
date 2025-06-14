"use client"

import { useState } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AppointmentsTable } from "@/components/admin/appointments-table"
import { AppointmentFilters } from "@/components/admin/appointment-filters"

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined)

  return (
    <div className="p-6">
      <AdminHeader title="Appointment Management" description="View and manage all client appointments" />

      <AppointmentFilters
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        selectedService={selectedService}
        onServiceChange={setSelectedService}
      />

      <div className="mt-6">
        <AppointmentsTable selectedDate={selectedDate} selectedService={selectedService} />
      </div>
    </div>
  )
}
