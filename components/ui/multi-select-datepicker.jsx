'use client'

import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

export default function MultiSelectDatePicker({
  placeholder,
  dates,
  setDates
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            (!dates || dates.length === 0) && 'text-muted-foreground'
          )}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dates && dates.length > 0 ? (
            dates.length > 1 ? (
              <span>{dates.length} dates selected</span>
            ) : (
              dates.map((date, idx) => (
                <span key={idx}>
                  {format(date, 'PPP')}
                  {idx < dates.length - 1 && ', '}
                </span>
              ))
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="multiple"
          selected={dates}
          onSelect={(selected) => setDates(selected || [])}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
