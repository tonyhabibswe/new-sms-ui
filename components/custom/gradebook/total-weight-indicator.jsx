'use client'

import { Check, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

// Alternating brand shades tell the categories apart in the bar
const SHADES = ['bg-brand-600', 'bg-brand-400']

/**
 * Total Weight Indicator
 * Shows whether the category weights add up to 100%, and how they split
 */
export default function TotalWeightIndicator({ categories }) {
  const totalWeight = categories.reduce((sum, cat) => sum + (Number(cat.weight) || 0), 0)
  const isValid = totalWeight === 100

  return (
    <div
      className={cn(
        'mt-4 flex flex-col gap-3 rounded-2xl border p-4',
        isValid ? 'border-brand-400/30 bg-brand-400/5' : 'border-absent-solid/30 bg-absent-tint'
      )}>
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
            isValid ? 'bg-card text-primary' : 'bg-card text-absent'
          )}>
          {isValid ? (
            <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          ) : (
            <TriangleAlert className="h-4 w-4" aria-hidden="true" />
          )}
        </span>
        <div className="flex flex-col">
          <span className={cn('text-sm font-semibold', isValid ? 'text-foreground' : 'text-absent')}>
            {isValid ? 'Weights add up to 100%' : `Weights add up to ${totalWeight}%`}
          </span>
          <span className="text-[13px] text-muted-foreground">
            {isValid
              ? "Final grade = each category's average × its weight, added together."
              : 'Adjust them to equal 100% for accurate final grades.'}
          </span>
        </div>
      </div>
      {categories.length > 0 && (
        <div className="flex h-2 gap-1" aria-hidden="true">
          {categories.map((cat, index) => (
            <div
              key={cat.id}
              className={cn('rounded-full', SHADES[index % SHADES.length])}
              style={{ flex: `${Number(cat.weight) || 0} 1 0` }}
            />
          ))}
          {totalWeight < 100 && (
            <div className="rounded-full bg-accent" style={{ flex: `${100 - totalWeight} 1 0` }} />
          )}
        </div>
      )}
    </div>
  )
}
