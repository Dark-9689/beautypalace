"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Clock } from "lucide-react"
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
import { OfferDialog } from "@/components/admin/offer-dialog"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

type Offer = {
  id: number
  title: string
  description: string
  discount: string
  validUntil: string
  terms: string
  isActive: boolean
}

const initialOffers: Offer[] = [
  {
    id: 1,
    title: "New Client Special",
    description: "Get 20% off your first visit to Beauty Palace",
    discount: "20% OFF",
    validUntil: "Dec 31, 2024",
    terms: "Valid for first-time clients only",
    isActive: true,
  },
  {
    id: 2,
    title: "Bridal Package",
    description: "Complete bridal makeover including hair, makeup, and skincare",
    discount: "30% OFF",
    validUntil: "Jan 15, 2025",
    terms: "Book 2 weeks in advance",
    isActive: true,
  },
  {
    id: 3,
    title: "Weekend Wellness",
    description: "Facial + Hair treatment combo every Saturday & Sunday",
    discount: "25% OFF",
    validUntil: "Ongoing",
    terms: "Weekends only",
    isActive: false,
  },
]

export function OffersList() {
  const [offers, setOffers] = useState<Offer[]>(initialOffers)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)

  const handleEdit = (offer: Offer) => {
    setSelectedOffer(offer)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (offer: Offer) => {
    setSelectedOffer(offer)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedOffer) {
      setOffers(offers.filter((offer) => offer.id !== selectedOffer.id))
      toast({
        title: "Offer Deleted",
        description: `${selectedOffer.title} has been removed.`,
      })
    }
    setIsDeleteDialogOpen(false)
  }

  const handleOfferUpdate = (updatedOffer: Offer) => {
    setOffers(offers.map((offer) => (offer.id === updatedOffer.id ? updatedOffer : offer)))
    toast({
      title: "Offer Updated",
      description: `${updatedOffer.title} has been updated successfully.`,
    })
  }

  const toggleOfferStatus = (offerId: number) => {
    setOffers(offers.map((offer) => (offer.id === offerId ? { ...offer, isActive: !offer.isActive } : offer)))
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <Card key={offer.id} className="overflow-hidden bg-white/90 backdrop-blur-md">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <Badge className={offer.isActive ? "bg-green-500" : "bg-gray-500"}>
                  {offer.isActive ? "Active" : "Inactive"}
                </Badge>
                <Badge className="bg-red-500 text-white font-bold">{offer.discount}</Badge>
              </div>

              <h3 className="font-semibold text-lg mb-2">{offer.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{offer.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock size={14} className="mr-2" />
                  Valid until: {offer.validUntil}
                </div>
                <p className="text-xs text-muted-foreground italic">*{offer.terms}</p>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => toggleOfferStatus(offer.id)}>
                  {offer.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEdit(offer)}>
                  <Pencil size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(offer)}
                >
                  <Trash2 size={16} />
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
              This will permanently delete the offer "{selectedOffer?.title}". This action cannot be undone.
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

      {selectedOffer && (
        <OfferDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          offer={selectedOffer}
          onSave={handleOfferUpdate}
        />
      )}

      <Toaster />
    </>
  )
}
