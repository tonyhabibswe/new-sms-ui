'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { TableCell } from '@/components/ui/table'
import { cn } from '@/lib/utils'

/**
 * Editable cell component for grade input
 * @param {Object} props
 * @param {number} props.gradeId - Grade ID for updates
 * @param {number|null} props.value - Current grade value
 * @param {number} props.maxPoints - Maximum points for validation
 * @param {boolean} props.isModified - Whether grade has been modified
 * @param {boolean} props.isInactive - Whether student is inactive
 * @param {Function} props.onChange - Callback when grade changes (gradeId, value)
 * @param {Function} props.onValidate - Validation function
 * @param {string} props.label - Accessible name, e.g. "Lea Haddad, Midterm"
 * @param {'td'|'div'} props.as - Render as a table cell (default) or a block
 */
export default function EditableGradeCell({
  gradeId,
  value,
  maxPoints,
  isModified,
  isInactive,
  onChange,
  onValidate,
  label,
  as = 'td'
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleClick = () => {
    if (isInactive) return // Don't allow editing inactive students
    setIsEditing(true)
    setInputValue(value !== undefined && value !== null ? value.toString() : '')
    setError(null)
  }

  const commitValue = () => {
    const validation = onValidate(inputValue, maxPoints)

    if (!validation.isValid) {
      setError(validation.error)
      return
    }

    // Call onChange with grade ID and parsed value
    onChange(gradeId, validation.parsedValue)
    setError(null)
    setIsEditing(false)
  }

  const handleBlur = () => {
    commitValue()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      commitValue()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setError(null)
      setInputValue(
        value !== undefined && value !== null ? value.toString() : ''
      )
      setIsEditing(false)
    }
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
    setError(null)
  }

  const displayValue = value !== undefined && value !== null ? value : '—'
  // A table cell in the desktop grid, a plain block in the phone list
  const Cell = as === 'div' ? 'div' : TableCell

  // Reads as a field; a changed, unsaved grade gets the brand outline
  return (
    <Cell className={cn(as === 'div' ? 'flex flex-col items-end' : 'px-3 py-2.5')}>
      {isEditing ? (
        <div className="inline-flex flex-col items-end gap-1">
          <Input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            aria-label={label}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={cn(
              'h-10 w-20 rounded-lg px-2.5 text-right tabular-nums',
              error && 'border-destructive focus-visible:ring-destructive'
            )}
            disabled={isInactive}
          />
          {error && <span className="text-xs text-destructive">{error}</span>}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={isInactive}
          aria-label={
            label ? `${label}: ${displayValue}${isModified ? ', not saved yet' : ''}` : undefined
          }
          className={cn(
            'inline-flex h-10 min-w-[80px] items-center justify-end rounded-lg border px-2.5 text-[15px] tabular-nums transition-colors',
            isModified
              ? 'border-2 border-primary bg-brand-400/5 font-semibold'
              : 'border-input bg-card hover:bg-muted',
            isInactive && 'cursor-not-allowed border-border text-muted-foreground opacity-60'
          )}>
          {displayValue}
        </button>
      )}
    </Cell>
  )
}
