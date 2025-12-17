'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { TableCell } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { validateGrade } from '@/lib/utils/grade-calculations'

export default function GradeCell({
  studentId,
  itemId,
  maxPoints,
  value,
  isModified,
  onChange
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  // Update input value when value prop changes
  useEffect(() => {
    if (!isEditing) {
      setInputValue(
        value !== undefined && value !== null ? value.toString() : ''
      )
    }
  }, [value, isEditing])

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleClick = () => {
    setIsEditing(true)
    setInputValue(value !== undefined && value !== null ? value.toString() : '')
    setError(null)
  }

  const handleBlur = () => {
    commitValue()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      commitValue()
      // TODO: Move to next cell
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setInputValue(
        value !== undefined && value !== null ? value.toString() : ''
      )
      setError(null)
    }
  }

  const commitValue = () => {
    const trimmed = inputValue.trim()

    // Allow empty values (clearing a grade)
    if (trimmed === '') {
      onChange(studentId, itemId, null)
      setIsEditing(false)
      setError(null)
      return
    }

    const numValue = parseFloat(trimmed)

    // Validate
    const validation = validateGrade(numValue, maxPoints)
    if (!validation.valid) {
      setError(validation.error)
      return
    }

    // Save
    onChange(studentId, itemId, numValue)
    setIsEditing(false)
    setError(null)
  }

  const displayValue = value !== undefined && value !== null ? value : '—'
  const percentage =
    value !== undefined && value !== null && maxPoints > 0
      ? ((value / maxPoints) * 100).toFixed(1)
      : null

  return (
    <TableCell
      className={cn(
        'text-center cursor-pointer hover:bg-muted/50 transition-colors p-2',
        isModified && 'bg-blue-50 dark:bg-blue-950',
        error && 'bg-destructive/10'
      )}
      onClick={!isEditing ? handleClick : undefined}>
      {isEditing ? (
        <div className="space-y-1">
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={cn(
              'h-8 text-center',
              error && 'border-destructive focus-visible:ring-destructive'
            )}
            placeholder="0"
          />
          {error && <div className="text-xs text-destructive">{error}</div>}
        </div>
      ) : (
        <div>
          <div className="font-medium">{displayValue}</div>
          {percentage !== null && (
            <div className="text-xs text-muted-foreground">{percentage}%</div>
          )}
        </div>
      )}
    </TableCell>
  )
}
