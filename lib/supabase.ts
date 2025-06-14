import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Profile {
  id: string
  name: string
  phone?: string
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  image_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  user_id: string
  service_id: string
  appointment_date: string
  appointment_time: string
  status: "upcoming" | "completed" | "cancelled"
  notes?: string
  created_at: string
  updated_at: string
  profiles?: Profile
  services?: Service
}

export interface Review {
  id: string
  user_id: string
  service_name: string
  rating: number
  comment: string
  status: "pending" | "approved" | "rejected"
  created_at: string
  updated_at: string
  profiles?: Profile
  review_images?: ReviewImage[]
}

export interface ReviewImage {
  id: string
  review_id: string
  image_path: string
  created_at: string
}

export interface Offer {
  id: string
  title: string
  description: string
  discount_percentage: number
  valid_until: string
  terms?: string
  is_active: boolean
  created_at: string
  updated_at: string
}
