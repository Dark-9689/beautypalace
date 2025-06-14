"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

type Offer = {
  id: number
  title: string
  description: string
  discount: string
  validUntil: string
  terms: string
  isActive: boolean
}

interface OfferDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  offer?: Offer
  onSave?: (offer: Offer) => void
}

export function OfferDialog({ open, onOpenChange, offer, onSave }: OfferDialogProps) {
  const [formData, setFormData] = useState<Partial<Offer>>({
    title: "",
    description: "",
    discount: "",
    validUntil: "",
    terms: "",
    isActive: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (offer) {
      setFormData(offer)
    } else {
      setFormData({
        title: "",
        description: "",
        discount: "",
        validUntil: "",
        terms: "",
        isActive: true,
      })
    }
  }, [offer, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.discount || !formData.validUntil) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedOffer = {
        id: offer?.id || Math.floor(Math.random() * 1000),
        title: formData.title!,
        description: formData.description!,
        discount: formData.discount!,
        validUntil: formData.validUntil!,
        terms: formData.terms || "",
        isActive: formData.isActive!,
      }

      if (onSave) {
        onSave(updatedOffer)
      } else {
        toast({
          title: "Offer Added",
          description: `${updatedOffer.title} has been added successfully.`,
        })
      }

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save offer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>{offer ? "Edit Offer" : "Add New Offer"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Offer Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              placeholder="Enter offer title"
              className="bg-white"
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
              placeholder="Enter offer description"
              rows={3}
              className="bg-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount">Discount *</Label>
              <Input
                id="discount"
                name="discount"
                value={formData.discount || ""}
                onChange={handleChange}
                placeholder="e.g., 20% OFF"
                className="bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="validUntil">Valid Until *</Label>
              <Input
                id="validUntil"
                name="validUntil"
                value={formData.validUntil || ""}
                onChange={handleChange}
                placeholder="e.g., Dec 31, 2024"
                className="bg-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Input
              id="terms"
              name="terms"
              value={formData.terms || ""}
              onChange={handleChange}
              placeholder="Enter terms and conditions"
              className="bg-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="isActive">Active Offer</Label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : offer ? "Update Offer" : "Add Offer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
