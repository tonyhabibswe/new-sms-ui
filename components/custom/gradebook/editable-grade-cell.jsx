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
 */
export default function EditableGradeCell({
  gradeId,
  value,
  maxPoints,
  isModified,
  isInactive,
  onChange,
  onValidate
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

  return (
    <TableCell
      className={cn(
        'text-center relative group',
        isModified && 'bg-yellow-50 dark:bg-yellow-950/20',
        isInactive && 'text-muted-foreground opacity-60',
        !isInactive && 'cursor-pointer hover:bg-accent/50',
        error && 'bg-red-50 dark:bg-red-950/20'
      )}
      onClick={handleClick}>
      {isEditing ? (
        <div className="flex flex-col items-center">
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={cn(
              'h-8 w-20 text-center',
              error && 'border-red-500 focus-visible:ring-red-500'
            )}
            disabled={isInactive}
          />
          {error && (
            <span className="text-xs text-red-600 dark:text-red-400 mt-1">
              {error}
            </span>
          )}
        </div>
      ) : (
        <span className={cn(isModified && 'font-semibold')}>
          {displayValue}
        </span>
      )}
      {isModified && !isEditing && (
        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-yellow-500" />
      )}
    </TableCell>
  )
}
