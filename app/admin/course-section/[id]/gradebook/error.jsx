'use client'

import { Button } from '@/components/ui/button'

export default function GradebookError({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-muted-foreground mt-2">
          {error.message || 'Failed to load gradebook'}
        </p>
      </div>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  )
}
