"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

type Service = {
  id: number
  name: string
  description: string
  price: number
  duration: number
  image: string
}

interface ServiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  service?: Service
  onSave?: (service: Service) => void
}

export function ServiceDialog({ open, onOpenChange, service, onSave }: ServiceDialogProps) {
  const [formData, setFormData] = useState<Partial<Service>>({
    name: "",
    description: "",
    price: 0,
    duration: 0,
    image: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (service) {
      setFormData(service)
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        duration: 0,
        image: "",
      })
    }
  }, [service, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "duration" ? Number.parseFloat(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.description || !formData.price || !formData.duration) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedService = {
        id: service?.id || Math.floor(Math.random() * 1000),
        name: formData.name!,
        description: formData.description!,
        price: formData.price!,
        duration: formData.duration!,
        image: formData.image || "/placeholder.svg",
      }

      if (onSave) {
        onSave(updatedService)
      } else {
        toast({
          title: "Service Added",
          description: `${updatedService.name} has been added to your services.`,
        })
      }

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save service. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{service ? "Edit Service" : "Add New Service"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Service Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              placeholder="Enter service name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Enter service description"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price || ""}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (min) *</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="0"
                step="5"
                value={formData.duration || ""}
                onChange={handleChange}
                placeholder="60"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              name="image"
              value={formData.image || ""}
              onChange={handleChange}
              placeholder="Enter image URL"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : service ? "Update Service" : "Add Service"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
