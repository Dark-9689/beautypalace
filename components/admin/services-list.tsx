"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Clock, DollarSign } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ServiceDialog } from "@/components/admin/service-dialog"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

type Service = {
  id: number
  name: string
  description: string
  price: number
  duration: number
  image: string
}

const initialServices: Service[] = [
  {
    id: 1,
    name: "Haircut & Styling",
    description: "Professional haircut and styling tailored to your face shape and preferences.",
    price: 60,
    duration: 60,
    image: "https://ik.imagekit.io/beautypalace/services/haircut.jpg",
  },
  {
    id: 2,
    name: "Facial Treatment",
    description: "Rejuvenating facial treatment to cleanse, exfoliate, and hydrate your skin.",
    price: 85,
    duration: 75,
    image: "https://ik.imagekit.io/beautypalace/services/facial.jpg",
  },
  {
    id: 3,
    name: "Hair Smoothing",
    description: "Smooth and silky hair treatment to eliminate frizz and add shine.",
    price: 120,
    duration: 120,
    image: "https://ik.imagekit.io/beautypalace/services/smoothing.jpg",
  },
  {
    id: 4,
    name: "Keratin Treatment",
    description: "Long-lasting keratin treatment to strengthen and repair damaged hair.",
    price: 150,
    duration: 150,
    image: "https://ik.imagekit.io/beautypalace/services/keratin.jpg",
  },
  {
    id: 5,
    name: "Waxing Services",
    description: "Professional waxing services for smooth and hair-free skin.",
    price: 40,
    duration: 30,
    image: "https://ik.imagekit.io/beautypalace/services/waxing.jpg",
  },
  {
    id: 6,
    name: "Professional Makeup",
    description: "Expert makeup application for special occasions or everyday glamour.",
    price: 75,
    duration: 60,
    image: "https://ik.imagekit.io/beautypalace/services/makeup.jpg",
  },
]

export function ServicesList() {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const handleEdit = (service: Service) => {
    setSelectedService(service)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (service: Service) => {
    setSelectedService(service)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedService) {
      setServices(services.filter((service) => service.id !== selectedService.id))
      toast({
        title: "Service Deleted",
        description: `${selectedService.name} has been removed from your services.`,
      })
    }
    setIsDeleteDialogOpen(false)
  }

  const handleServiceUpdate = (updatedService: Service) => {
    setServices(services.map((service) => (service.id === updatedService.id ? updatedService : service)))
    toast({
      title: "Service Updated",
      description: `${updatedService.name} has been updated successfully.`,
    })
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="overflow-hidden bg-white/90 backdrop-blur-md">
            <div className="h-48 overflow-hidden">
              <img
                src={service.image || "/placeholder.svg"}
                alt={`${service.name} - Beauty Palace service`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{service.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-muted-foreground">
                  <Clock size={16} className="mr-1" />
                  <span>{service.duration} min</span>
                </div>
                <div className="flex items-center font-semibold">
                  <DollarSign size={16} className="mr-1" />
                  <span>{service.price}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(service)}>
                  <Pencil size={16} className="mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(service)}
                >
                  <Trash2 size={16} className="mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the service "{selectedService?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedService && (
        <ServiceDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          service={selectedService}
          onSave={handleServiceUpdate}
        />
      )}

      <Toaster />
    </>
  )
}
