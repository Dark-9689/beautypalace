"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { Star, Quote, PlusCircle, X, ChevronLeft, ChevronRight, Upload, Heart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { gsap } from "@/lib/gsap"

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    comment:
      "Absolutely amazing experience! The staff is incredibly professional and the results exceeded my expectations. I love my new look!",
    images: ["/api/uploads/review-1-img1.jpg", "/api/uploads/review-1-img2.jpg"],
    service: "Haircut & Styling",
    date: "2 weeks ago",
  },
  {
    id: 2,
    name: "Emily Davis",
    rating: 5,
    comment:
      "The facial treatment was so relaxing and my skin feels incredible. Highly recommend their skincare services!",
    images: ["/api/uploads/review-2-img1.jpg"],
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
    images: ["/api/uploads/review-4-img1.jpg"],
    service: "Smooth Skin",
    date: "2 months ago",
  },
  {
    id: 5,
    name: "Amanda Lee",
    rating: 5,
    comment: "The makeup artist was incredibly talented. Received so many compliments! Perfect for my special day.",
    images: ["/api/uploads/review-5-img1.jpg", "/api/uploads/review-5-img2.jpg"],
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
  const starsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (interactive && starsRef.current) {
      const stars = starsRef.current.querySelectorAll(".star")
      gsap.fromTo(
        stars,
        { scale: 0, rotation: -180 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
      )
    }
  }, [interactive])

  const handleStarClick = (starIndex: number) => {
    if (interactive && onRatingChange && starsRef.current) {
      const stars = starsRef.current.querySelectorAll(".star")
      gsap.to(stars[starIndex], {
        scale: 1.3,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      })
      onRatingChange(starIndex + 1)
    }
  }

  return (
    <div ref={starsRef} className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`star w-6 h-6 cursor-pointer transition-colors ${
            i < rating ? "fill-purple-400 text-purple-400" : "text-gray-300 hover:text-purple-300"
          }`}
          onClick={() => handleStarClick(i)}
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

  const formRef = useRef<HTMLFormElement>(null)
  const thankYouRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isDialogOpen && formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" },
      )
    }
  }, [isDialogOpen])

  useEffect(() => {
    if (showThankYou && thankYouRef.current) {
      gsap.fromTo(
        thankYouRef.current,
        { opacity: 0, scale: 0.8, rotationY: 90 },
        { opacity: 1, scale: 1, rotationY: 0, duration: 0.6, ease: "back.out(1.7)" },
      )
    }
  }, [showThankYou])

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

    // Animate form submission
    if (formRef.current) {
      gsap.to(formRef.current, {
        scale: 0.95,
        opacity: 0.7,
        duration: 0.3,
        ease: "power2.inOut",
      })
    }

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setShowThankYou(true)
    setTimeout(() => {
      setNewReview({ name: "", rating: 5, comment: "", images: [] })
      setIsDialogOpen(false)
      setShowThankYou(false)
    }, 4000)
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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-purple-600 font-medium">Client Reviews</span>
          </div>
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
                  <PlusCircle size={16} />
                  Share Your Experience
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-purple-50 border-purple-200">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ✨ Share Your Experience
                  </DialogTitle>
                </DialogHeader>

                {!showThankYou ? (
                  <form ref={formRef} onSubmit={handleSubmitReview} className="space-y-6 mt-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-purple-700 font-medium flex items-center gap-2">
                        <Sparkles size={16} />
                        Your Name
                      </Label>
                      <Input
                        id="name"
                        value={newReview.name}
                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                        placeholder="Enter your beautiful name"
                        className="border-purple-200 focus:border-purple-400 bg-white/80 backdrop-blur-sm"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-purple-700 font-medium flex items-center gap-2">
                        <Star size={16} />
                        How was your experience?
                      </Label>
                      <div className="flex justify-center">
                        <StarRating
                          rating={newReview.rating}
                          interactive
                          onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="comment" className="text-purple-700 font-medium flex items-center gap-2">
                        <Quote size={16} />
                        Tell us about your experience
                      </Label>
                      <Textarea
                        id="comment"
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        placeholder="Share your wonderful experience with us..."
                        rows={4}
                        className="border-purple-200 focus:border-purple-400 bg-white/80 backdrop-blur-sm resize-none"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-purple-700 font-medium flex items-center gap-2">
                        <Upload size={16} />
                        Share your photos (Optional - Max 2)
                      </Label>
                      <div className="border-2 border-dashed border-purple-200 rounded-xl p-6 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300">
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
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-3">
                            <Upload className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-sm text-purple-600 font-medium">
                            {newReview.images.length >= 2 ? "Maximum 2 images reached" : "Click to upload your photos"}
                          </span>
                          <span className="text-xs text-purple-400 mt-1">JPG, PNG up to 5MB each</span>
                        </label>
                      </div>

                      {newReview.images.length > 0 && (
                        <div className="flex gap-3 mt-4">
                          {newReview.images.map((file, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={URL.createObjectURL(file) || "/placeholder.svg"}
                                alt={`Upload ${index + 1}`}
                                className="w-20 h-20 object-cover rounded-lg border-2 border-purple-200 group-hover:border-purple-400 transition-colors"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors shadow-lg"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        className="border-purple-200 text-purple-600 hover:bg-purple-50"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Submitting...
                          </div>
                        ) : (
                          "Submit Review ✨"
                        )}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div ref={thankYouRef} className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Heart className="w-10 h-10 text-white animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Thank You! 💕
                    </h3>
                    <p className="text-purple-600 leading-relaxed text-lg">
                      Your valuable feedback means the world to us! ✨
                    </p>
                    <p className="text-purple-500 mt-2">
                      We're so grateful you took the time to share your experience. Your review helps us continue
                      providing exceptional beauty care! 🌟
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
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {reviews.map((review, index) => (
              <div key={review.id} className="flex-shrink-0 w-80">
                <ReviewCard review={review} index={index} onCardClick={setSelectedReview} getInitials={getInitials} />
              </div>
            ))}
          </div>
        </div>

        {/* Review Detail Modal */}
        <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
          <DialogContent className="sm:max-w-lg mx-4 bg-gradient-to-br from-white to-purple-50 border-purple-200">
            {selectedReview && (
              <div className="space-y-4">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      {selectedReview.images.length > 0 ? (
                        <img
                          src={selectedReview.images[0] || "/placeholder.svg"}
                          alt={selectedReview.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                          <span className="text-white font-bold">{getInitials(selectedReview.name)}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-purple-700">{selectedReview.name}</h3>
                      <StarRating rating={selectedReview.rating} />
                    </div>
                  </DialogTitle>
                </DialogHeader>

                {selectedReview.images.length > 0 && (
                  <ReviewImageViewer images={selectedReview.images} name={selectedReview.name} />
                )}

                <div className="space-y-2">
                  <p className="text-muted-foreground leading-relaxed">"{selectedReview.comment}"</p>
                  <div className="flex justify-between text-sm text-purple-600">
                    <span>Service: {selectedReview.service}</span>
                    <span>{selectedReview.date}</span>
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
          <div className="text-xs text-purple-600 font-medium">Service: {review.service}</div>
          {review.images.length > 0 && (
            <div className="text-xs text-purple-500">
              📸 {review.images.length} photo{review.images.length > 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
