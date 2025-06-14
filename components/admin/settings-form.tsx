"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export function SettingsForm() {
  const [settings, setSettings] = useState({
    contactNumber: "+1 (123) 456-7890",
    reminderTime: "60",
    whatsappNotifications: true,
    emailNotifications: true,
    autoApproveReviews: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
        <h3 className="text-sm font-semibold text-blue-800 mb-1">Important Note</h3>
        <p className="text-sm text-blue-700">
          For security reasons, please change the default password after your first login. The admin panel gives you
          access to manage services, appointments, reviews, and settings.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Configure how and when notifications are sent to clients and staff.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number (for WhatsApp)</Label>
              <Input
                id="contactNumber"
                value={settings.contactNumber}
                onChange={(e) => handleChange("contactNumber", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                This number will be used for sending WhatsApp notifications to clients and staff.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="reminderTime">Appointment Reminder Time</Label>
              <Select value={settings.reminderTime} onValueChange={(value) => handleChange("reminderTime", value)}>
                <SelectTrigger id="reminderTime">
                  <SelectValue placeholder="Select reminder time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes before</SelectItem>
                  <SelectItem value="30">30 minutes before</SelectItem>
                  <SelectItem value="60">1 hour before</SelectItem>
                  <SelectItem value="120">2 hours before</SelectItem>
                  <SelectItem value="1440">1 day before</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                How long before the appointment should clients receive a reminder.
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="whatsapp-notifications">WhatsApp Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Send appointment confirmations and reminders via WhatsApp.
                  </p>
                </div>
                <Switch
                  id="whatsapp-notifications"
                  checked={settings.whatsappNotifications}
                  onCheckedChange={(checked) => handleChange("whatsappNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Send appointment confirmations and reminders via email.
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleChange("emailNotifications", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Review Settings</CardTitle>
            <CardDescription>Configure how client reviews are handled.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-approve-reviews">Auto-Approve Reviews</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically approve new reviews without manual moderation.
                </p>
              </div>
              <Switch
                id="auto-approve-reviews"
                checked={settings.autoApproveReviews}
                onCheckedChange={(checked) => handleChange("autoApproveReviews", checked)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
      <Toaster />
    </>
  )
}
