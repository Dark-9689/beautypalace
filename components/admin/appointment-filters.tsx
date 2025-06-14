"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AppointmentFiltersProps {
  selectedDate: Date | undefined
  onDateChange: (date: Date | undefined) => void
  selectedService: string | undefined
  onServiceChange: (service: string | undefined) => void
}

export function AppointmentFilters({
  selectedDate,
  onDateChange,
  selectedService,
  onServiceChange,
}: AppointmentFiltersProps) {
  const handleClearFilters = () => {
    onDateChange(undefined)
    onServiceChange(undefined)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("w-full justify-start text-left", !selectedDate && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Filter by date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={selectedDate} onSelect={onDateChange} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex-1">
        <Select value={selectedService} onValueChange={onServiceChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="haircut">Haircut & Styling</SelectItem>
            <SelectItem value="facial">Facial Treatment</SelectItem>
            <SelectItem value="smoothing">Hair Smoothing</SelectItem>
            <SelectItem value="keratin">Keratin Treatment</SelectItem>
            <SelectItem value="waxing">Waxing Services</SelectItem>
            <SelectItem value="makeup">Professional Makeup</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="ghost" onClick={handleClearFilters} disabled={!selectedDate && !selectedService}>
        Clear Filters
      </Button>
    </div>
  )
}
