'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { calculateTotalWeight } from '@/lib/utils/grade-calculations'

export default function TotalWeightIndicator({ categories }) {
  const totalWeight = calculateTotalWeight(categories)
  const isValid = totalWeight === 100

  if (categories.length === 0) {
    return null
  }

  return (
    <Alert variant={isValid ? 'default' : 'destructive'} className="mt-4">
      <div className="flex items-center gap-2">
        {isValid ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <AlertTriangle className="h-4 w-4" />
        )}
        <AlertDescription>
          <span className="font-semibold">Total Weight: {totalWeight}%</span>
          {!isValid && (
            <span className="ml-2">
              — Adjust weights to equal 100% for accurate final grades
            </span>
          )}
        </AlertDescription>
      </div>
    </Alert>
  )
}
