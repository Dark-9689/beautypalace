import { supabase } from "./supabase"
import type { Profile } from "./supabase"

export interface AuthUser {
  id: string
  email: string
  name: string
  phone?: string
  is_admin: boolean
}

export const authService = {
  async signUp(email: string, password: string, name: string, phone?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
        },
      },
    })

    if (error) throw error
    return data
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    // Get user profile
    if (data.user) {
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

      return {
        user: data.user,
        session: data.session,
        profile,
      }
    }

    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (!profile) return null

    return {
      id: user.id,
      email: user.email!,
      name: profile.name,
      phone: profile.phone,
      is_admin: profile.is_admin,
    }
  },

  async updateProfile(updates: Partial<Pick<Profile, "name" | "phone">>) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Not authenticated")

    const { data, error } = await supabase.from("profiles").update(updates).eq("id", user.id).select().single()

    if (error) throw error
    return data
  },
}
