"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, StarHalf, Check, X, Flag } from "lucide-react"
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
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

type Review = {
  id: number
  name: string
  rating: number
  comment: string
  image?: string
  date: string
  status: "approved" | "pending" | "rejected"
}

const initialReviews: Review[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    comment:
      "Absolutely loved my haircut and styling! The staff was professional and friendly. Will definitely be coming back.",
    image: "https://ik.imagekit.io/Beautypalace/high-fashion-look-glamor-closeup-portrait-beautiful-sexy-stylish-blond-caucasian-young-woman-model-with-bright-makeup.jpg",
    date: "2 weeks ago",
    status: "approved",
  },
  {
    id: 2,
    name: "Emily Davis",
    rating: 4.5,
    comment:
      "The facial treatment was so relaxing and my skin feels amazing. Highly recommend their skincare services.",
    image: "https://ik.imagekit.io/beautypalace/reviews/client-2.jpg",
    date: "1 month ago",
    status: "approved",
  },
  {
    id: 3,
    name: "Michelle Wong",
    rating: 5,
    comment: "I got the keratin treatment and my hair has never looked better. Worth every penny!",
    image: "https://ik.imagekit.io/beautypalace/reviews/client-3.jpg",
    date: "3 weeks ago",
    status: "pending",
  },
  {
    id: 4,
    name: "Jessica Smith",
    rating: 4,
    comment: "Great waxing service, quick and relatively painless. The salon is clean and well-maintained.",
    image: "https://ik.imagekit.io/beautypalace/reviews/client-4.jpg",
    date: "2 months ago",
    status: "pending",
  },
  {
    id: 5,
    name: "Amanda Lee",
    rating: 5,
    comment:
      "Had my makeup done for a special event and received so many compliments. The makeup artist was talented and listened to what I wanted.",
    image: "https://ik.imagekit.io/beautypalace/reviews/client-5.jpg",
    date: "1 week ago",
    status: "approved",
  },
  {
    id: 6,
    name: "Rachel Green",
    rating: 4.5,
    comment:
      "The hair smoothing treatment transformed my frizzy hair. The staff was knowledgeable and gave me great tips for maintenance.",
    image: "https://ik.imagekit.io/beautypalace/reviews/client-6.jpg",
    date: "1 month ago",
    status: "pending",
  },
]

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-purple-400 text-purple-400" />
      ))}
      {hasHalfStar && <StarHalf className="w-4 h-4 fill-purple-400 text-purple-400" />}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => (
        <Star key={i + fullStars + (hasHalfStar ? 1 : 0)} className="w-4 h-4 text-gray-300" />
      ))}
    </div>
  )
}

export function ReviewsGrid() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all")

  const handleApprove = (review: Review) => {
    setReviews((prev) => prev.map((r) => (r.id === review.id ? { ...r, status: "approved" } : r)))

    toast({
      title: "Review Approved",
      description: "The review is now visible on the public site.",
    })
  }

  const handleReject = (review: Review) => {
    setReviews((prev) => prev.map((r) => (r.id === review.id ? { ...r, status: "rejected" } : r)))

    toast({
      title: "Review Rejected",
      description: "The review has been rejected and won't be displayed.",
    })
  }

  const handleDelete = (review: Review) => {
    setSelectedReview(review)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedReview) {
      setReviews(reviews.filter((review) => review.id !== selectedReview.id))
      toast({
        title: "Review Deleted",
        description: "The review has been permanently deleted.",
      })
    }
    setIsDeleteDialogOpen(false)
  }

  const filteredReviews = reviews.filter((review) => {
    if (filter === "all") return review.status !== "rejected"
    return review.status === filter
  })

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            All Reviews
          </Button>
          <Button
            variant={filter === "approved" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("approved")}
          >
            Approved
          </Button>
          <Button variant={filter === "pending" ? "default" : "outline"} size="sm" onClick={() => setFilter("pending")}>
            Pending
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="overflow-hidden bg-white/90 backdrop-blur-md">
            <div className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                    {review.image ? (
                      <img
                        src={review.image || "/placeholder.svg"}
                        alt={`${review.name} - Beauty Palace client`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">{review.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium truncate">{review.name}</h4>
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} />
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                  </div>
                </div>

                {review.status === "pending" && (
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 flex-shrink-0">
                    <Flag size={12} className="mr-1" />
                    Pending
                  </span>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{review.comment}</p>

              <div className="flex space-x-2">
                {review.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => handleApprove(review)}
                    >
                      <Check size={16} className="mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleReject(review)}
                    >
                      <X size={16} className="mr-1" />
                      Reject
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className={review.status === "pending" ? "flex-none" : "flex-1"}
                  onClick={() => handleDelete(review)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No reviews found matching your filter.</p>
        </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this review. This action cannot be undone.
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

      <Toaster />
    </>
  )
}
