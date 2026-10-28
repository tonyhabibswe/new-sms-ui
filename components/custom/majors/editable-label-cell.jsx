'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import useFetchApi from '@/hooks/useFetchApi'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

/**
 * EditableLabelCell - Inline editable cell for major labels
 * @param {Object} props
 * @param {Object} props.row - Table row data
 */
export function EditableLabelCell({ row }) {
  const major = row.original
  const [isEditing, setIsEditing] = useState(false)
  // A major can have no label yet
  const [value, setValue] = useState(major.label ?? '')
  const [originalValue] = useState(major.label ?? '')
  const inputRef = useRef(null)
  const { toast } = useToast()
  const router = useRouter()
  const { isLoading, fetchData } = useFetchApi()

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleDoubleClick = () => {
    if (!isLoading) {
      setIsEditing(true)
    }
  }

  const handleSave = async () => {
    // Don't save if value hasn't changed or is empty
    if (value.trim() === originalValue || value.trim() === '') {
      setIsEditing(false)
      setValue(originalValue)
      return
    }

    try {
      await fetchData(`/major/${major.id}/label`, {
        method: 'PUT',
        body: JSON.stringify({ label: value.trim() }),
        cache: 'no-store'
      })

      toast({
        variant: 'success',
        title: 'Major label updated successfully'
      })
      setIsEditing(false)
      router.refresh()
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update major label',
        variant: 'destructive'
      })
      setValue(originalValue)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setValue(originalValue)
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  const handleBlur = () => {
    // Only save on blur if we're not in the middle of saving
    if (!isLoading) {
      handleSave()
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          disabled={isLoading}
          aria-label={`Label for ${major.systemName}`}
          className="h-10 w-[300px] max-w-full rounded-lg"
        />
        {isLoading && <Loader2 className="h-4 w-4 shrink-0 animate-spin" />}
      </div>
    )
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onDoubleClick={handleDoubleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleDoubleClick()}
      aria-label={`Edit the label for ${major.systemName}`}
      className="-mx-2 w-[300px] max-w-full cursor-pointer rounded-lg px-2 py-1.5 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      title="Double-click to edit">
      {value || (
        <span className="text-primary underline underline-offset-2">
          Double click to edit
        </span>
      )}
    </div>
  )
}
