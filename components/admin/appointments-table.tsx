"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Calendar, Clock, User, MessageCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

type Client = {
  id: string
  name: string
  phone: string
  email?: string
  totalAppointments: number
  lastVisit?: Date
  preferredServices: string[]
  totalSpent: number
}

type Appointment = {
  id: string
  clientId: string
  client: Client
  service: string
  serviceName: string
  date: Date
  time: string
  status: "upcoming" | "completed" | "cancelled"
  price: number
  notes?: string
}

// Generate sample clients with appointment history
const generateClients = (): Client[] => {
  return [
    {
      id: "client-1",
      name: "Sarah Johnson",
      phone: "+1234567890",
      email: "sarah@email.com",
      totalAppointments: 8,
      lastVisit: new Date("2024-12-01"),
      preferredServices: ["haircut", "facial"],
      totalSpent: 680,
    },
    {
      id: "client-2",
      name: "Emily Davis",
      phone: "+1234567891",
      email: "emily@email.com",
      totalAppointments: 5,
      lastVisit: new Date("2024-11-28"),
      preferredServices: ["facial", "makeup"],
      totalSpent: 425,
    },
    {
      id: "client-3",
      name: "Michelle Wong",
      phone: "+1234567892",
      totalAppointments: 12,
      lastVisit: new Date("2024-12-05"),
      preferredServices: ["keratin", "smoothing"],
      totalSpent: 1800,
    },
    {
      id: "client-4",
      name: "Jessica Smith",
      phone: "+1234567893",
      totalAppointments: 3,
      lastVisit: new Date("2024-11-15"),
      preferredServices: ["waxing"],
      totalSpent: 120,
    },
    {
      id: "client-5",
      name: "Amanda Lee",
      phone: "+1234567894",
      totalAppointments: 6,
      lastVisit: new Date("2024-12-03"),
      preferredServices: ["makeup", "haircut"],
      totalSpent: 450,
    },
  ]
}

// Generate sample appointments
const generateAppointments = (clients: Client[]): Appointment[] => {
  const appointments: Appointment[] = []
  const services = [
    { value: "haircut", label: "Haircut & Styling", price: 60 },
    { value: "facial", label: "Facial Treatment", price: 85 },
    { value: "smoothing", label: "Hair Smoothing", price: 120 },
    { value: "keratin", label: "Keratin Treatment", price: 150 },
    { value: "waxing", label: "Waxing Services", price: 40 },
    { value: "makeup", label: "Professional Makeup", price: 75 },
  ]
  const times = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"]

  // Generate appointments for the next 7 days
  for (let i = 0; i < 25; i++) {
    const today = new Date()
    const appointmentDate = new Date(today)
    appointmentDate.setDate(today.getDate() + Math.floor(Math.random() * 7))

    const client = clients[Math.floor(Math.random() * clients.length)]
    const service = services[Math.floor(Math.random() * services.length)]
    const time = times[Math.floor(Math.random() * times.length)]

    appointments.push({
      id: `app-${i + 1}`,
      clientId: client.id,
      client,
      service: service.value,
      serviceName: service.label,
      date: appointmentDate,
      time,
      status: "upcoming",
      price: service.price,
      notes: Math.random() > 0.7 ? "First time client" : undefined,
    })
  }

  return appointments
}

interface AppointmentsTableProps {
  selectedDate?: Date
  selectedService?: string
}

export function AppointmentsTable({ selectedDate, selectedService }: AppointmentsTableProps) {
  const [clients] = useState<Client[]>(generateClients())
  const [appointments, setAppointments] = useState<Appointment[]>(generateAppointments(clients))
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  const filteredAppointments = appointments.filter((appointment) => {
    let matchesDate = true
    let matchesService = true

    if (selectedDate) {
      matchesDate = appointment.date.toDateString() === selectedDate.toDateString()
    }

    if (selectedService) {
      matchesService = appointment.service === selectedService
    }

    return matchesDate && matchesService
  })

  // Group appointments by client
  const groupedAppointments = filteredAppointments.reduce(
    (acc, appointment) => {
      const clientId = appointment.clientId
      if (!acc[clientId]) {
        acc[clientId] = {
          client: appointment.client,
          appointments: [],
        }
      }
      acc[clientId].appointments.push(appointment)
      return acc
    },
    {} as Record<string, { client: Client; appointments: Appointment[] }>,
  )

  const handleStatusChange = (id: string, status: "upcoming" | "completed" | "cancelled") => {
    setAppointments((prev) =>
      prev.map((appointment) => (appointment.id === id ? { ...appointment, status } : appointment)),
    )

    const statusMessages = {
      completed: "Appointment marked as completed",
      cancelled: "Appointment has been cancelled",
      upcoming: "Appointment status updated to upcoming",
    }

    toast({
      title: "Status Updated",
      description: statusMessages[status],
    })
  }

  const sendWhatsAppReminder = (appointment: Appointment) => {
    const message = encodeURIComponent(
      `Hi ${appointment.client.name}! This is a reminder for your ${appointment.serviceName} appointment tomorrow at ${appointment.time}. We look forward to seeing you at Beauty Palace! 💄✨`,
    )
    const phoneNumber = appointment.client.phone.replace(/[^\d]/g, "")
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")

    toast({
      title: "Reminder Sent",
      description: `WhatsApp reminder sent to ${appointment.client.name}`,
    })
  }

  const sendWhatsAppConfirmation = (appointment: Appointment) => {
    const message = encodeURIComponent(
      `Hello ${appointment.client.name}! Your appointment for ${appointment.serviceName} has been confirmed for ${format(appointment.date, "MMMM d, yyyy")} at ${appointment.time}. Thank you for choosing Beauty Palace! 💄`,
    )
    const phoneNumber = appointment.client.phone.replace(/[^\d]/g, "")
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")

    toast({
      title: "Confirmation Sent",
      description: `WhatsApp confirmation sent to ${appointment.client.name}`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Client Insights */}
        {selectedClient && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={20} />
                Client Profile: {selectedClient.name}
              </CardTitle>
              <CardDescription>Detailed client information and appointment history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedClient.totalAppointments}</div>
                  <div className="text-sm text-blue-600">Total Appointments</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">${selectedClient.totalSpent}</div>
                  <div className="text-sm text-green-600">Total Spent</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{selectedClient.preferredServices.length}</div>
                  <div className="text-sm text-purple-600">Preferred Services</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {selectedClient.lastVisit ? format(selectedClient.lastVisit, "MMM d") : "N/A"}
                  </div>
                  <div className="text-sm text-orange-600">Last Visit</div>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Contact Information</h4>
                <div className="flex gap-4">
                  <span className="text-sm text-muted-foreground">Phone: {selectedClient.phone}</span>
                  {selectedClient.email && (
                    <span className="text-sm text-muted-foreground">Email: {selectedClient.email}</span>
                  )}
                </div>
              </div>
              <Button variant="outline" onClick={() => setSelectedClient(null)} className="mt-4">
                Close Profile
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Grouped Appointments Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Info</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.values(groupedAppointments).length > 0 ? (
                Object.values(groupedAppointments).map(({ client, appointments }) => (
                  <>
                    {/* Client Header Row */}
                    <TableRow key={`client-${client.id}`} className="bg-muted/50">
                      <TableCell colSpan={6}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                              <span className="text-white font-bold text-sm">{client.name.charAt(0)}</span>
                            </div>
                            <div>
                              <div className="font-medium">{client.name}</div>
                              <div className="text-sm text-muted-foreground">{client.phone}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{appointments.length} appointments</Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedClient(client)}
                              className="text-xs"
                            >
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                    {/* Client's Appointments */}
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id} className="border-l-4 border-l-purple-200">
                        <TableCell className="pl-12">
                          {appointment.notes && (
                            <Badge variant="secondary" className="text-xs">
                              {appointment.notes}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{appointment.serviceName}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-1 text-muted-foreground" />
                              {format(appointment.date, "MMM d, yyyy")}
                            </div>
                            <div className="flex items-center">
                              <Clock size={14} className="mr-1 text-muted-foreground" />
                              {appointment.time}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>${appointment.price}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal size={16} />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, "completed")}>
                                Mark as Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, "cancelled")}>
                                Cancel Appointment
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => sendWhatsAppReminder(appointment)}>
                                <MessageCircle size={14} className="mr-2" />
                                Send Reminder
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => sendWhatsAppConfirmation(appointment)}>
                                <MessageCircle size={14} className="mr-2" />
                                Send Confirmation
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No appointments found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <Toaster />
    </>
  )
}
