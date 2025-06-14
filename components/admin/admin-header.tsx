"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface AdminHeaderProps {
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function AdminHeader({ title, description, action }: AdminHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>

      {action && (
        <Button
          className="mt-4 md:mt-0 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={action.onClick}
        >
          <PlusCircle size={16} className="mr-2" />
          {action.label}
        </Button>
      )}
    </div>
  )
}
