'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Course passing grades error:', error)
  }, [error])

  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center space-y-4 p-8">
      <div className="flex flex-col items-center space-y-2 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold tracking-tight">
          Something went wrong!
        </h2>
        <p className="text-muted-foreground max-w-md">
          {error.message ||
            'Failed to load course passing grades. Please try again.'}
        </p>
      </div>
      <Button onClick={() => reset()} variant="outline">
        Try again
      </Button>
    </div>
  )
}
