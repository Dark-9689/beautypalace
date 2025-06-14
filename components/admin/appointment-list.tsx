"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Appointment = {
  id: string
  client: {
    name: string
    image?: string
  }
  service: string
  time: string
  status: "upcoming" | "completed" | "cancelled"
}

const appointments: Appointment[] = [
  {
    id: "1",
    client: {
      name: "Sarah Johnson",
      image: "https://ik.imagekit.io/beautypalace/reviews/client-1.jpg",
    },
    service: "Haircut & Styling",
    time: "10:00 AM",
    status: "upcoming",
  },
  {
    id: "2",
    client: {
      name: "Emily Davis",
      image: "https://ik.imagekit.io/beautypalace/reviews/client-2.jpg",
    },
    service: "Facial Treatment",
    time: "11:30 AM",
    status: "upcoming",
  },
  {
    id: "3",
    client: {
      name: "Michelle Wong",
      image: "https://ik.imagekit.io/beautypalace/reviews/client-3.jpg",
    },
    service: "Keratin Treatment",
    time: "1:00 PM",
    status: "upcoming",
  },
  {
    id: "4",
    client: {
      name: "Jessica Smith",
      image: "https://ik.imagekit.io/beautypalace/reviews/client-4.jpg",
    },
    service: "Waxing Services",
    time: "2:30 PM",
    status: "upcoming",
  },
  {
    id: "5",
    client: {
      name: "Amanda Lee",
      image: "https://ik.imagekit.io/beautypalace/reviews/client-5.jpg",
    },
    service: "Professional Makeup",
    time: "4:00 PM",
    status: "upcoming",
  },
]

export function AppointmentList() {
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>(appointments)

  const handleStatusChange = (id: string, status: "upcoming" | "completed" | "cancelled") => {
    setAppointmentsList((prev) =>
      prev.map((appointment) => (appointment.id === id ? { ...appointment, status } : appointment)),
    )
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
    <div className="space-y-4">
      {appointmentsList.map((appointment) => (
        <div
          key={appointment.id}
          className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage
                src={appointment.client.image || "/placeholder.svg"}
                alt={`${appointment.client.name} - Beauty Palace client`}
              />
              <AvatarFallback>{appointment.client.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{appointment.client.name}</p>
              <p className="text-sm text-muted-foreground">{appointment.service}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center text-sm text-muted-foreground">
              <Clock size={14} className="mr-1" />
              <span>{appointment.time}</span>
            </div>

            <Badge className={getStatusColor(appointment.status)}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical size={16} />
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
                <DropdownMenuItem>Edit Details</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )
}
