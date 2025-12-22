'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

/**
 * StatusSelectCell Component
 *
 * Renders an interactive dropdown for updating student enrollment status.
 * Implements optimistic UI pattern - updates immediately on selection,
 * then reverts if the API call fails.
 *
 * @param {number} enrollmentId - The enrollment ID to update
 * @param {number} currentStatusId - The current status ID of the student
 * @param {Array} statuses - Array of available status options {id, name, label}
 * @param {Function} onStatusChange - Async callback (enrollmentId, newStatusId, oldStatusId) => Promise
 * @param {boolean} disabled - Whether the dropdown should be disabled
 */
export function StatusSelectCell({
  enrollmentId,
  currentStatusId,
  statuses = [],
  onStatusChange,
  disabled = false
}) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [localStatusId, setLocalStatusId] = useState(currentStatusId)
  console.log('StatusSelectCell props:', {
    enrollmentId,
    currentStatusId,
    statusesCount: statuses.length
  })
  // Handle edge case: empty statuses array
  if (!statuses || statuses.length === 0) {
    return <span className="text-muted-foreground text-sm">No statuses</span>
  }

  // Find current status, fallback to first status if invalid
  const currentStatus =
    statuses.find((s) => s.id === localStatusId) || statuses[0]

  // Handle edge case: invalid statusId - show "Unknown" if currentStatus is still undefined
  if (!currentStatus) {
    return <span className="text-muted-foreground text-sm">Unknown</span>
  }

  /**
   * Handle status change with optimistic UI update
   * Updates UI immediately, then calls API. Reverts on error.
   */
  const handleValueChange = async (newStatusIdStr) => {
    if (!onStatusChange) return

    const newStatusId = parseInt(newStatusIdStr, 10)
    const oldStatusId = localStatusId

    // Don't update if same value
    if (newStatusId === oldStatusId) return

    try {
      // Optimistic UI update - update immediately before API call
      setLocalStatusId(newStatusId)
      setIsUpdating(true)

      // Call API to update status
      await onStatusChange(enrollmentId, newStatusId, oldStatusId)
    } catch (error) {
      // Rollback: revert to old status on error
      setLocalStatusId(oldStatusId)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Select
      value={localStatusId?.toString()}
      onValueChange={handleValueChange}
      disabled={disabled || isUpdating}>
      <SelectTrigger className="w-[140px]">
        {isUpdating ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{currentStatus.label}</span>
          </div>
        ) : (
          <SelectValue>{currentStatus.label}</SelectValue>
        )}
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => (
          <SelectItem key={status.id} value={status.id.toString()}>
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
