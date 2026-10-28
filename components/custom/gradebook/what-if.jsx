'use client'

import { CircleCheck, FlaskConical, Loader2, RotateCcw, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

// 70 -> "70", 62.5 -> "62.5", 54.65 -> "54.65"
export const formatPoints = (value) => String(Number(Number(value).toFixed(2)))

// Statuses whose final grade is replaced by a letter
const STATUS_NAMES = { W: 'Withdrawn', UW: 'Unofficial withdrawal', I: 'Incomplete' }

/**
 * The dark band above the grades in what-if mode: what it is, how many values
 * are being tried, and the way out.
 */
export function WhatIfBanner({ count, isUpdating, error, onReset, onExit }) {
  return (
    <section
      aria-label="What-if mode"
      className="flex flex-wrap items-center justify-between gap-4 rounded-card-sm bg-foreground px-4 py-3.5 text-background sm:rounded-card sm:px-6 sm:py-4">
      <div className="flex min-w-0 flex-[1_1_320px] items-center gap-3.5">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background/10">
          <FlaskConical className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-lg font-bold leading-6">What-if mode</p>
          <p className="text-sm text-background/80">
            Type any grades to see the results. Nothing here is saved, and the real
            grades stay as they are.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span role="status" className="inline-flex items-center gap-2 text-sm text-background/80">
          {isUpdating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Calculating…
            </>
          ) : error ? (
            error
          ) : (
            `${count} what-if ${count === 1 ? 'value' : 'values'}`
          )}
        </span>
        <Button
          variant="outline"
          onClick={onReset}
          disabled={count === 0}
          className="hidden border-background/40 bg-transparent text-background hover:bg-background/10 hover:text-background sm:inline-flex">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
        <Button
          onClick={onExit}
          className="bg-background text-foreground hover:bg-background/90">
          Exit what-if
        </Button>
      </div>
    </section>
  )
}

/**
 * "saved 49" under a result that the what-if values changed.
 */
export function SavedValue({ children }) {
  return (
    <span className="block font-sans text-xs font-medium text-muted-foreground">
      saved {children}
    </span>
  )
}

/**
 * The lowest grade a student needs on the chosen item to reach their passing
 * mark, as the API worked it out. For the desktop table.
 *
 * @param {Object} props.row - The previewed row, with needed and passingGrade
 * @param {number} props.maxPoints - The chosen item's max points
 * @param {boolean} props.ready - False while the answer for this item is on its way
 */
export function NeededGrade({ row, maxPoints, ready }) {
  if (row.finalGrade === null || row.finalGrade === undefined) {
    return (
      <span className="text-sm text-muted-foreground">
        {STATUS_NAMES[row.letterGrade] ?? '—'}
      </span>
    )
  }

  const needed = ready ? row.needed : null
  if (!needed) {
    return (
      <span className="text-muted-foreground" aria-label="Calculating">
        …
      </span>
    )
  }

  const max = formatPoints(maxPoints)
  if (needed.status === 'passing') {
    return (
      <>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          <CircleCheck className="h-4 w-4" aria-hidden="true" />
          Passing already
        </span>
        <span className="block text-xs text-muted-foreground">even with 0</span>
      </>
    )
  }
  if (needed.status === 'cannot') {
    return (
      <>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-absent">
          <TriangleAlert className="h-4 w-4" aria-hidden="true" />
          Can&apos;t pass
        </span>
        <span className="block text-xs text-muted-foreground">
          {max} / {max} gives {formatPoints(needed.best)}
        </span>
      </>
    )
  }
  return (
    <>
      <span className="block font-display text-base font-bold tabular-nums">
        {formatPoints(needed.value)}{' '}
        <span className="font-sans text-[13px] font-medium text-muted-foreground">
          / {max}
        </span>
      </span>
      <span className="block text-xs text-muted-foreground">
        to reach {formatPoints(row.passingGrade)}
      </span>
    </>
  )
}

/**
 * The same answer as NeededGrade, as one line for a phone card.
 */
export function NeededGradeLine({ row, maxPoints, ready }) {
  if (row.finalGrade === null || row.finalGrade === undefined) {
    return (
      <span className="text-xs text-muted-foreground">
        {STATUS_NAMES[row.letterGrade] ?? '—'}
      </span>
    )
  }

  const needed = ready ? row.needed : null
  if (!needed) {
    return <span className="text-xs text-muted-foreground">Working out the needed grade…</span>
  }

  const max = formatPoints(maxPoints)
  if (needed.status === 'passing') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
        <CircleCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Passing already, even with 0
      </span>
    )
  }
  if (needed.status === 'cannot') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-absent">
        <TriangleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Can&apos;t pass: {max} / {max} gives {formatPoints(needed.best)}
      </span>
    )
  }
  return (
    <span className="text-xs text-foreground">
      Needs <strong>{formatPoints(needed.value)}</strong> to reach{' '}
      {formatPoints(row.passingGrade)}
    </span>
  )
}
