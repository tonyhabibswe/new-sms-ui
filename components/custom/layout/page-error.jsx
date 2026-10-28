'use client'

import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

// What a page shows when loading its data fails
export function PageError({ message, reset }) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-card-sm border border-border bg-card px-6 py-14 text-center shadow-card sm:rounded-card">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="h-6 w-6" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-[22px] font-bold leading-7">
          Something went wrong
        </h2>
        <p className="max-w-md text-[15px] leading-[22px] text-muted-foreground">
          {message}
        </p>
      </div>
      <Button variant="outline" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  )
}
