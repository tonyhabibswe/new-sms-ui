'use client'

import { useState, useEffect, useMemo } from 'react'
import useFetchApi from '@/hooks/useFetchApi'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2, Save, X, RefreshCcw } from 'lucide-react'
import GradesGrid from './grades-grid'
import GradesTableLoadingSkeleton from './grades-table-loading-skeleton'
import ErrorDisplay from './error-display'
import { GradesExportButton } from './grades-export-button'
import { DataTableSearch } from '../data-table/data-table-search'

/**
 * Grades Tab Component - API-integrated version
 * Fetches grades table from backend with dynamic columns
 */
export default function GradesTab({ courseSectionId }) {
  const { toast } = useToast()
  const { fetchData } = useFetchApi()

  // API data state
  const [gradesTableData, setGradesTableData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  // UI state
  const [searchQuery, setSearchQuery] = useState('')
  const [modifiedGrades, setModifiedGrades] = useState(new Map())
  const [cellErrors, setCellErrors] = useState(new Map())

  /**
   * Validate grade value
   * @param {string|null} value - Grade value to validate
   * @param {number} maxPoints - Maximum points allowed
   * @returns {{isValid: boolean, error?: string, parsedValue: number|null}}
   */
  const validateGrade = (value, maxPoints) => {
    // Empty/null is valid (not graded): clearing a cell saves the grade as empty
    const text = value === null || value === undefined ? '' : String(value).trim()
    if (text === '') {
      return { isValid: true, parsedValue: null }
    }

    // Number, not parseFloat, so "12abc" isn't saved as 12. A decimal comma
    // ("12,5") counts as a point: some phone keyboards only offer a comma.
    const numValue = Number(text.replace(',', '.'))

    // Check if valid number
    if (isNaN(numValue)) {
      return { isValid: false, error: 'Must be a valid number' }
    }

    // Check if within range
    if (numValue < 0) {
      return { isValid: false, error: 'Grade cannot be negative' }
    }

    if (numValue > maxPoints) {
      return { isValid: false, error: `Cannot exceed ${maxPoints}` }
    }

    return { isValid: true, parsedValue: numValue }
  }

  /**
   * Categorize columns by type
   * @param {Array} columns - Column definitions from API
   * @returns {{identifiers: Array, gradeableItems: Array, categories: Array, calculated: Array}}
   */
  const categorizeColumns = (columns) => {
    if (!columns)
      return {
        identifiers: [],
        gradeableItems: [],
        categories: [],
        calculated: []
      }

    return {
      identifiers: columns.filter((c) => c.type === 'identifier'),
      gradeableItems: columns.filter((c) => c.type === 'gradeableItem'),
      categories: columns.filter((c) => c.type === 'category'),
      calculated: columns.filter((c) => c.type === 'calculated')
    }
  }

  /**
   * Fetch grades table from API
   */
  const fetchGradesTable = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchData(
        `/course-sections/${courseSectionId}/grades/table`,
        { method: 'GET' }
      )

      if (response && response.data) {
        setGradesTableData(response.data)
      }
    } catch (err) {
      console.error('Error fetching grades table:', err)
      setError(err.message || 'Failed to load grades table')

      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load grades table'
      })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle grade change
   * @param {number|null} gradeId - Grade ID (null for new grades)
   * @param {number|null} newValue - New grade value
   * @param {number|null} originalValue - Original grade value
   * @param {number} enrollmentId - Student enrollment ID
   * @param {number} gradeableItemId - Gradeable item ID
   */
  const handleGradeChange = (
    gradeId,
    newValue,
    originalValue,
    enrollmentId,
    gradeableItemId
  ) => {
    // Create unique key: use gradeId if exists, otherwise enrollmentId_gradeableItemId
    const trackingKey =
      gradeId !== null && gradeId !== undefined
        ? `grade_${gradeId}`
        : `new_${enrollmentId}_${gradeableItemId}`

    // If new value equals original value, remove modification
    if (newValue === originalValue) {
      const newMap = new Map(modifiedGrades)
      newMap.delete(trackingKey)
      setModifiedGrades(newMap)

      // Clear any error for this cell
      const newErrors = new Map(cellErrors)
      newErrors.delete(trackingKey)
      setCellErrors(newErrors)
      return
    }

    // Add/update modification
    setModifiedGrades((prev) =>
      new Map(prev).set(trackingKey, {
        id: gradeId,
        gradeValue: newValue,
        originalValue: originalValue,
        enrollmentId: enrollmentId,
        gradeableItemId: gradeableItemId
      })
    )

    // Clear any error for this cell
    const newErrors = new Map(cellErrors)
    newErrors.delete(trackingKey)
    setCellErrors(newErrors)
  }

  /**
   * Save all modified grades (bulk update)
   */
  const handleSaveAll = async () => {
    if (modifiedGrades.size === 0) {
      toast({
        title: 'No changes to save'
      })
      return
    }

    setIsSaving(true)

    try {
      // Build grades array with both existing and new grades
      const grades = Array.from(modifiedGrades.values()).map((mod) => {
        // Existing grade (has ID)
        if (mod.id !== null && mod.id !== undefined) {
          return {
            id: mod.id,
            gradeValue: mod.gradeValue
          }
        }
        // New grade (no ID yet)
        return {
          enrollmentId: mod.enrollmentId,
          gradeableItemId: mod.gradeableItemId,
          gradeValue: mod.gradeValue
        }
      })

      const response = await fetchData('/grades/bulk-update', {
        method: 'POST',
        body: JSON.stringify({ grades })
      })

      toast({
        variant: 'default',
        title: 'Success',
        description: `${
          response.data?.updated || grades.length
        } grades saved successfully!`,
        className:
          'bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-50'
      })

      // Refetch to get recalculated values
      await fetchGradesTable()

      // Clear modifications
      setModifiedGrades(new Map())
      setCellErrors(new Map())
    } catch (err) {
      console.error('Error saving grades:', err)

      // Handle validation errors (422)
      if (err.statusCode === 422 && err.errors) {
        // Show specific validation errors
        Object.entries(err.errors).forEach(([, messages]) => {
          toast({
            variant: 'destructive',
            title: 'Validation Error',
            description: Array.isArray(messages) ? messages[0] : messages
          })
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to save grades'
        })
      }
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * Discard all changes
   */
  const handleDiscardChanges = () => {
    if (modifiedGrades.size === 0) return

    if (window.confirm(`Discard ${modifiedGrades.size} unsaved changes?`)) {
      setModifiedGrades(new Map())
      setCellErrors(new Map())
      toast({
        title: 'Changes discarded'
      })
    }
  }

  const rows = gradesTableData?.rows

  /**
   * Filter rows by search query
   */
  const filteredRows = useMemo(() => {
    if (!rows || !searchQuery) {
      return rows || []
    }

    const query = searchQuery.toLowerCase()
    return rows.filter(
      (row) =>
        row.studentName?.toLowerCase().includes(query) ||
        row.studentId?.toLowerCase().includes(query)
    )
  }, [rows, searchQuery])

  /**
   * Fetch on mount and when courseSectionId changes
   */
  useEffect(() => {
    if (courseSectionId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- loads data; state is set once the request settles
      fetchGradesTable()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSectionId])

  /**
   * Warn before leaving with unsaved changes
   */
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (modifiedGrades.size > 0) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [modifiedGrades])

  // Loading state
  if (isLoading) {
    return <GradesTableLoadingSkeleton />
  }

  // Error state
  if (error) {
    return <ErrorDisplay message={error} onRetry={fetchGradesTable} />
  }

  // No data
  if (!gradesTableData) {
    return (
      <Card className="flex flex-col items-center justify-center px-6 py-12">
        <p className="text-muted-foreground">No grades data available</p>
      </Card>
    )
  }

  const { columns, totalStudents, classAverage } = gradesTableData
  const categorized = categorizeColumns(columns)
  const hasUnsavedChanges = modifiedGrades.size > 0

  const saveLabel = isSaving
    ? 'Saving...'
    : hasUnsavedChanges
      ? `Save ${modifiedGrades.size} ${modifiedGrades.size === 1 ? 'change' : 'changes'}`
      : 'Save'

  return (
    <div className="flex flex-col gap-4 pb-20 md:pb-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
          <DataTableSearch
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students"
          />
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-[13px] text-muted-foreground">
              Class average
              <strong className="font-display text-[15px] text-foreground">
                {classAverage !== undefined && classAverage !== null
                  ? classAverage.toFixed(1)
                  : '—'}
              </strong>
            </span>
            <span className="inline-flex h-9 items-center rounded-full border border-border bg-card px-3.5 text-[13px] text-muted-foreground">
              {searchQuery
                ? `${filteredRows.length} of ${totalStudents} students`
                : `${totalStudents} students`}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <GradesExportButton courseSectionId={courseSectionId} />
          <Button
            variant="outline"
            size="icon"
            onClick={fetchGradesTable}
            disabled={isSaving}
            aria-label="Refresh grades">
            <RefreshCcw className="h-[18px] w-[18px]" />
          </Button>
          {hasUnsavedChanges && (
            <Button
              variant="outline"
              onClick={handleDiscardChanges}
              disabled={isSaving}
              className="hidden md:inline-flex">
              <X className="h-[18px] w-[18px]" />
              Discard
            </Button>
          )}
          <Button
            onClick={handleSaveAll}
            disabled={!hasUnsavedChanges || isSaving}
            className="hidden md:inline-flex">
            {isSaving ? (
              <Loader2 className="h-[18px] w-[18px] animate-spin" />
            ) : (
              <Save className="h-[18px] w-[18px]" />
            )}
            {saveLabel}
          </Button>
        </div>
      </div>

      {/* Grades Grid */}
      <GradesGrid
        columns={categorized}
        rows={filteredRows}
        modifiedGrades={modifiedGrades}
        onGradeChange={handleGradeChange}
        onValidate={validateGrade}
      />

      {hasUnsavedChanges && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-border bg-card px-5 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 md:hidden">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">
              {modifiedGrades.size} unsaved{' '}
              {modifiedGrades.size === 1 ? 'change' : 'changes'}
            </span>
            <button
              type="button"
              onClick={handleDiscardChanges}
              disabled={isSaving}
              className="self-start text-[13px] font-semibold text-primary">
              Discard
            </button>
          </div>
          <Button size="lg" onClick={handleSaveAll} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-[18px] w-[18px] animate-spin" />
            ) : (
              <Save className="h-[18px] w-[18px]" />
            )}
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      )}
    </div>
  )
}
