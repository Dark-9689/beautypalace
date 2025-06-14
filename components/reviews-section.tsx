"use client"

import type React from "react"
import { useState } from "react"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { Star, Quote, X, ChevronLeft, ChevronRight, Heart, Camera, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    comment:
      "Absolutely amazing experience! The staff is incredibly professional and the results exceeded my expectations. I love my new look!",
    images: [
      "https://your-supabase-url.supabase.co/storage/v1/object/public/reviews/review-1-img1.jpg",
      "https://your-supabase-url.supabase.co/storage/v1/object/public/reviews/review-1-img2.jpg",
    ],
    service: "Haircut & Styling",
    date: "2 weeks ago",
  },
  {
    id: 2,
    name: "Emily Davis",
    rating: 5,
    comment:
      "The facial treatment was so relaxing and my skin feels incredible. Highly recommend their skincare services!",
    images: ["https://your-supabase-url.supabase.co/storage/v1/object/public/reviews/review-2-img1.jpg"],
    service: "Luxury Facial",
    date: "1 month ago",
  },
  {
    id: 3,
    name: "Michelle Wong",
    rating: 5,
    comment: "Best keratin treatment I've ever had. My hair has never looked better! The staff was so knowledgeable.",
    images: [],
    service: "Keratin Therapy",
    date: "3 weeks ago",
  },
  {
    id: 4,
    name: "Jessica Smith",
    rating: 4,
    comment: "Great service and clean environment. Will definitely be coming back! Professional and friendly staff.",
    images: ["https://your-supabase-url.supabase.co/storage/v1/object/public/reviews/review-4-img1.jpg"],
    service: "Smooth Skin",
    date: "2 months ago",
  },
  {
    id: 5,
    name: "Amanda Lee",
    rating: 5,
    comment: "The makeup artist was incredibly talented. Received so many compliments! Perfect for my special day.",
    images: [
      "https://your-supabase-url.supabase.co/storage/v1/object/public/reviews/review-5-img1.jpg",
      "https://your-supabase-url.supabase.co/storage/v1/object/public/reviews/review-5-img2.jpg",
    ],
    service: "Glamour Makeup",
    date: "1 week ago",
  },
  {
    id: 6,
    name: "Rachel Green",
    rating: 5,
    comment: "Professional staff and amazing results. The hair smoothing treatment was perfect! Highly recommended.",
    images: [],
    service: "Hair Transformation",
    date: "1 month ago",
  },
]

function StarRating({
  rating,
  interactive = false,
  onRatingChange,
}: { rating: number; interactive?: boolean; onRatingChange?: (rating: number) => void }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 cursor-pointer transition-colors ${
            i < rating ? "fill-purple-400 text-purple-400" : "text-gray-300 hover:text-purple-300"
          }`}
          onClick={() => interactive && onRatingChange && onRatingChange(i + 1)}
        />
      ))}
    </div>
  )
}

function ReviewImageViewer({ images, name }: { images: string[]; name: string }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (images.length === 0) return null

  return (
    <div className="relative">
      <img
        src={images[currentImageIndex] || "/placeholder.svg"}
        alt={`Review by ${name} - Image ${currentImageIndex + 1}`}
        className="w-full h-48 object-cover rounded-lg"
        loading="lazy"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function ReviewsSection() {
  const sectionRef = useScrollReveal()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<(typeof reviews)[0] | null>(null)
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 5,
    comment: "",
    images: [] as File[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + newReview.images.length > 2) {
      alert("Maximum 2 images allowed")
      return
    }
    setNewReview((prev) => ({ ...prev, images: [...prev.images, ...files].slice(0, 2) }))
  }

  const removeImage = (index: number) => {
    setNewReview((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReview.name || !newReview.comment) {
      alert("Please fill in your name and review")
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setShowThankYou(true)
    setTimeout(() => {
      setNewReview({ name: "", rating: 5, comment: "", images: [] })
      setIsDialogOpen(false)
      setShowThankYou(false)
    }, 3000)
    setIsSubmitting(false)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <section ref={sectionRef} id="reviews" className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16 reveal-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary-foreground font-serif px-4">
            What Our Clients Say
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 px-4">
            Real experiences from our valued clients who trust us with their beauty journey
          </p>

          <div className="flex justify-center px-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="modern-btn flex items-center gap-2 w-full sm:w-auto">
                  <MessageSquare size={16} />
                  Share Your Experience
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg mx-4 max-h-[90vh] overflow-y-auto bg-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-center text-primary-foreground mb-2">
                    Share Your Experience
                  </DialogTitle>
                  <p className="text-center text-muted-foreground text-sm">
                    Help others discover the Beauty Palace experience
                  </p>
                </DialogHeader>

                {!showThankYou ? (
                  <div className="mt-6 px-2">
                    <form onSubmit={handleSubmitReview} className="space-y-6">
                      {/* Name Input */}
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-primary-foreground font-medium">
                          Your Name *
                        </Label>
                        <Input
                          id="name"
                          value={newReview.name}
                          onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                          placeholder="Enter your full name"
                          className="h-12 border-2 border-purple-100 focus:border-purple-400 focus:ring-0 rounded-xl bg-white"
                          required
                        />
                      </div>

                      {/* Rating */}
                      <div className="space-y-3">
                        <Label className="text-primary-foreground font-medium">Rate Your Experience *</Label>
                        <div className="flex items-center justify-center p-4 bg-purple-50 rounded-xl">
                          <StarRating
                            rating={newReview.rating}
                            interactive
                            onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
                          />
                          <span className="ml-3 text-primary-foreground font-medium">
                            {newReview.rating} star{newReview.rating !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      {/* Review Comment */}
                      <div className="space-y-2">
                        <Label htmlFor="comment" className="text-primary-foreground font-medium">
                          Your Review *
                        </Label>
                        <Textarea
                          id="comment"
                          value={newReview.comment}
                          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          placeholder="Tell us about your experience at Beauty Palace..."
                          rows={4}
                          className="border-2 border-purple-100 focus:border-purple-400 focus:ring-0 rounded-xl bg-white resize-none"
                          required
                        />
                      </div>

                      {/* Image Upload */}
                      <div className="space-y-3">
                        <Label className="text-primary-foreground font-medium">Add Photos (Optional - Max 2)</Label>

                        <div className="border-2 border-dashed border-purple-200 rounded-xl p-6 bg-purple-50/50">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                            disabled={newReview.images.length >= 2}
                          />
                          <label
                            htmlFor="image-upload"
                            className={`flex flex-col items-center cursor-pointer ${
                              newReview.images.length >= 2 ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          >
                            <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center mb-3">
                              <Camera className="w-6 h-6 text-purple-600" />
                            </div>
                            <span className="text-purple-600 font-medium text-center">
                              {newReview.images.length >= 2 ? "Maximum 2 images reached" : "Click to add photos"}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">Show off your amazing results!</span>
                          </label>
                        </div>

                        {newReview.images.length > 0 && (
                          <div className="flex gap-3 justify-center">
                            {newReview.images.map((file, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(file) || "/placeholder.svg"}
                                  alt={`Upload ${index + 1}`}
                                  className="w-20 h-20 object-cover rounded-lg border-2 border-purple-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Submit Buttons */}
                      <div className="flex gap-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                          className="flex-1 h-12 border-2 border-gray-200 hover:border-gray-300"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Submitting...
                            </div>
                          ) : (
                            "Submit Review"
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Heart className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-primary-foreground">Thank You! 💕</h3>
                    <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                      Your valuable feedback means the world to us! We're so grateful you took the time to share your
                      experience. Your review helps us continue providing exceptional beauty care. ✨
                    </p>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((review, index) => (
            <ReviewCard
              key={review.id}
              review={review}
              index={index}
              onCardClick={setSelectedReview}
              getInitials={getInitials}
            />
          ))}
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="sm:hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-4">
            {reviews.map((review, index) => (
              <div key={review.id} className="flex-shrink-0 w-80">
                <ReviewCard review={review} index={index} onCardClick={setSelectedReview} getInitials={getInitials} />
              </div>
            ))}
          </div>
        </div>

        {/* Review Detail Modal */}
        <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
          <DialogContent className="sm:max-w-lg mx-4 bg-white">
            {selectedReview && (
              <div className="space-y-6 p-2">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                      {selectedReview.images.length > 0 ? (
                        <img
                          src={selectedReview.images[0] || "/placeholder.svg"}
                          alt={selectedReview.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">{getInitials(selectedReview.name)}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-primary-foreground">{selectedReview.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={selectedReview.rating} />
                        <span className="text-sm text-muted-foreground">• {selectedReview.date}</span>
                      </div>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                {selectedReview.images.length > 0 && (
                  <div className="rounded-xl overflow-hidden">
                    <ReviewImageViewer images={selectedReview.images} name={selectedReview.name} />
                  </div>
                )}

                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <p className="text-primary-foreground leading-relaxed italic">"{selectedReview.comment}"</p>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-purple-600 font-medium bg-purple-100 px-3 py-1 rounded-full">
                      {selectedReview.service}
                    </span>
                    <span className="text-muted-foreground">{selectedReview.date}</span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}

function ReviewCard({
  review,
  index,
  onCardClick,
  getInitials,
}: {
  review: any
  index: number
  onCardClick: (review: any) => void
  getInitials: (name: string) => string
}) {
  return (
    <div
      className={`stagger-item group cursor-pointer ${
        index % 3 === 0 ? "reveal-left" : index % 3 === 1 ? "reveal-up" : "reveal-right"
      }`}
      onClick={() => onCardClick(review)}
    >
      <div className="modern-card h-full p-4 sm:p-6 relative hover:scale-105 transition-transform">
        <Quote className="absolute top-4 right-4 text-purple-200 w-6 h-6 sm:w-8 sm:h-8" />

        <div className="flex items-center mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mr-3 sm:mr-4 flex-shrink-0">
            {review.images.length > 0 ? (
              <img
                src={review.images[0] || "/placeholder.svg"}
                alt={`${review.name} - Beauty Palace client`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{getInitials(review.name)}</span>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-primary-foreground text-sm sm:text-base truncate">{review.name}</h4>
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} />
              <span className="text-xs text-muted-foreground">{review.date}</span>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground mb-4 leading-relaxed text-sm line-clamp-3">"{review.comment}"</p>

        <div className="flex justify-between items-center">
          <div className="text-xs text-purple-600 font-medium bg-purple-100 px-2 py-1 rounded-full">
            {review.service}
          </div>
          {review.images.length > 0 && (
            <div className="text-xs text-purple-500 flex items-center gap-1">
              <Camera size={12} />
              {review.images.length} photo{review.images.length > 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
