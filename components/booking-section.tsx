"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock, CheckCircle, User, PhoneIcon, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { gsap } from "@/lib/gsap"

const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
]

const services = [
  { value: "haircut", label: "Signature Haircut", duration: "1 hour", price: "$60" },
  { value: "facial", label: "Luxury Facial", duration: "1 hour 15 mins", price: "$85" },
  { value: "smoothing", label: "Hair Transformation", duration: "2 hours", price: "$120" },
  { value: "keratin", label: "Keratin Therapy", duration: "2 hours 30 mins", price: "$150" },
  { value: "waxing", label: "Smooth Skin", duration: "30 mins", price: "$40" },
  { value: "makeup", label: "Glamour Makeup", duration: "1 hour", price: "$75" },
]

const isSlotUnavailable = (date: Date, slot: string): boolean => {
  const dateString = format(date, "yyyy-MM-dd")
  const unavailableSlots: Record<string, string[]> = {
    "2025-06-13": ["10:00 AM", "1:30 PM", "4:00 PM"],
    "2025-06-14": ["9:30 AM", "11:00 AM", "2:30 PM"],
    "2025-06-15": ["12:00 PM", "12:30 PM", "3:00 PM"],
  }
  return unavailableSlots[dateString]?.includes(slot) || false
}

// WhatsApp notification functions
const sendClientConfirmation = (bookingData: any) => {
  const message = encodeURIComponent(
    `Hello ${bookingData.name}! 🌟\n\nYour appointment at Beauty Palace has been confirmed!\n\n📅 Date: ${format(bookingData.date, "MMMM d, yyyy")}\n⏰ Time: ${bookingData.timeSlot}\n💄 Service: ${bookingData.serviceName}\n💰 Price: ${bookingData.price}\n\nWe look forward to pampering you! If you need to reschedule, please let us know 24 hours in advance.\n\nThank you for choosing Beauty Palace! ✨`,
  )
  const phoneNumber = bookingData.phone.replace(/[^\d]/g, "")
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
}

const sendOwnerNotification = (bookingData: any) => {
  const ownerPhone = "1234567890" // Replace with actual owner's WhatsApp number
  const message = encodeURIComponent(
    `🔔 NEW BOOKING ALERT!\n\n👤 Client: ${bookingData.name}\n📞 Phone: ${bookingData.phone}\n💄 Service: ${bookingData.serviceName}\n📅 Date: ${format(bookingData.date, "MMMM d, yyyy")}\n⏰ Time: ${bookingData.timeSlot}\n💰 Price: ${bookingData.price}\n\nPlease confirm the appointment and prepare for the service.`,
  )
  window.open(`https://wa.me/${ownerPhone}?text=${message}`, "_blank")
}

export default function BookingSection() {
  const sectionRef = useScrollReveal()
  const formRef = useRef<HTMLDivElement>(null)
  const [date, setDate] = useState<Date>()
  const [timeSlot, setTimeSlot] = useState<string>("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [service, setService] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )
    }
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name) newErrors.name = "Name is required"
    if (!phone) newErrors.phone = "Phone number is required"
    if (!service) newErrors.service = "Please select a service"
    if (!date) newErrors.date = "Please select a date"
    if (!timeSlot) newErrors.timeSlot = "Please select a time slot"

    if (phone && !/^\+?[0-9\s\-()]{8,}$/.test(phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const selectedService = services.find((s) => s.value === service)
      const bookingData = {
        name,
        phone,
        service,
        serviceName: selectedService?.label || "",
        price: selectedService?.price || "",
        date: date!,
        timeSlot,
      }

      // Send WhatsApp notifications
      sendClientConfirmation(bookingData)
      setTimeout(() => sendOwnerNotification(bookingData), 1000) // Delay owner notification

      setIsSuccess(true)

      // Animate success state
      if (formRef.current) {
        gsap.to(formRef.current, {
          scale: 1.05,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        })
      }

      setTimeout(() => {
        setDate(undefined)
        setTimeSlot("")
        setName("")
        setPhone("")
        setService("")
        setIsSuccess(false)
      }, 6000)
    } catch (error) {
      console.error("Booking error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedService = services.find((s) => s.value === service)

  return (
    <section ref={sectionRef} id="book-appointment" className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 reveal-up">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-purple-600 font-medium">Book Your Experience</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary-foreground font-serif">
            Reserve Your Appointment
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Schedule your visit to Beauty Palace and treat yourself to our premium beauty services
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div ref={formRef} className="modern-form mx-4 sm:mx-0">
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className={cn("flex items-center gap-2", errors.name && "text-destructive")}>
                      <User size={16} />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        if (errors.name) {
                          const newErrors = { ...errors }
                          delete newErrors.name
                          setErrors(newErrors)
                        }
                      }}
                      className={cn(
                        "h-12 border-2 border-purple-100 focus:border-purple-400 focus:ring-0 bg-white",
                        errors.name && "border-red-300 focus:border-red-400",
                      )}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className={cn("flex items-center gap-2", errors.phone && "text-destructive")}
                    >
                      <PhoneIcon size={16} />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value)
                        if (errors.phone) {
                          const newErrors = { ...errors }
                          delete newErrors.phone
                          setErrors(newErrors)
                        }
                      }}
                      className={cn(
                        "h-12 border-2 border-purple-100 focus:border-purple-400 focus:ring-0 bg-white",
                        errors.phone && "border-red-300 focus:border-red-400",
                      )}
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Service Selection */}
                <div className="space-y-2">
                  <Label className={cn("flex items-center gap-2", errors.service && "text-destructive")}>
                    <Sparkles size={16} />
                    Select Service
                  </Label>
                  <Select
                    value={service}
                    onValueChange={(value) => {
                      setService(value)
                      if (errors.service) {
                        const newErrors = { ...errors }
                        delete newErrors.service
                        setErrors(newErrors)
                      }
                    }}
                  >
                    <SelectTrigger
                      className={cn(
                        "h-14 border-2 border-purple-100 focus:border-purple-400 focus:ring-0 bg-white",
                        errors.service && "border-red-300",
                      )}
                    >
                      <SelectValue placeholder="Choose your service" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-purple-100 shadow-lg max-h-60 overflow-y-auto">
                      {services.map((serviceOption) => (
                        <SelectItem
                          key={serviceOption.value}
                          value={serviceOption.value}
                          className="py-3 hover:bg-purple-50"
                        >
                          <div className="flex justify-between items-center w-full">
                            <div>
                              <div className="font-medium">{serviceOption.label}</div>
                              <div className="text-sm text-muted-foreground">{serviceOption.duration}</div>
                            </div>
                            <div className="font-bold text-purple-600 ml-4">{serviceOption.price}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedService && (
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{selectedService.label}</span>
                        <span className="text-purple-600 font-bold">{selectedService.price}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Duration: {selectedService.duration}</div>
                    </div>
                  )}
                  {errors.service && <p className="text-xs text-red-500 mt-1">{errors.service}</p>}
                </div>

                {/* Date and Time Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className={cn("flex items-center gap-2", errors.date && "text-destructive")}>
                      <CalendarIcon size={16} />
                      Select Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-14 border-2 border-purple-100 focus:border-purple-400 bg-white hover:bg-purple-50",
                            !date && "text-muted-foreground",
                            errors.date && "border-red-300",
                          )}
                          onClick={() => {
                            if (errors.date) {
                              const newErrors = { ...errors }
                              delete newErrors.date
                              setErrors(newErrors)
                            }
                          }}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "EEEE, MMMM d, yyyy") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 bg-white border-2 border-purple-100 shadow-lg"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => {
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)
                            return date < today
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className={cn("flex items-center gap-2", errors.timeSlot && "text-destructive")}>
                      <Clock size={16} />
                      Select Time
                    </Label>
                    <Select
                      value={timeSlot}
                      onValueChange={(value) => {
                        setTimeSlot(value)
                        if (errors.timeSlot) {
                          const newErrors = { ...errors }
                          delete newErrors.timeSlot
                          setErrors(newErrors)
                        }
                      }}
                      disabled={!date}
                    >
                      <SelectTrigger
                        className={cn(
                          "h-14 border-2 border-purple-100 focus:border-purple-400 focus:ring-0 bg-white",
                          errors.timeSlot && "border-red-300",
                        )}
                      >
                        <SelectValue placeholder="Choose time">
                          {timeSlot ? (
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              <span>{timeSlot}</span>
                            </div>
                          ) : (
                            <span>Select a time</span>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-purple-100 shadow-lg max-h-60">
                        {timeSlots.map((slot) => (
                          <SelectItem
                            key={slot}
                            value={slot}
                            disabled={date ? isSlotUnavailable(date, slot) : true}
                            className={cn(
                              "py-2 hover:bg-purple-50",
                              date && isSlotUnavailable(date, slot) && "opacity-50 line-through",
                            )}
                          >
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.timeSlot && <p className="text-xs text-red-500 mt-1">{errors.timeSlot}</p>}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full modern-btn-primary text-lg py-6 rounded-2xl mt-8"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Booking Your Appointment...
                    </div>
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-primary-foreground">Booking Confirmed!</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Your appointment has been successfully booked for{" "}
                  <span className="font-semibold">{date && format(date, "MMMM d, yyyy")}</span> at{" "}
                  <span className="font-semibold">{timeSlot}</span>.
                </p>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                  <p className="text-green-800 text-sm">
                    📱 WhatsApp confirmations have been sent to both you and our salon team!
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-blue-800 text-sm">
                    💡 You'll receive a reminder 24 hours before your appointment via WhatsApp.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
