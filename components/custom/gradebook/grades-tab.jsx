'use client'

import { useState, useEffect, useMemo } from 'react'
import useFetchApi from '@/hooks/useFetchApi'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Loader2, Search, Save, X, RefreshCcw } from 'lucide-react'
import GradesGrid from './grades-grid'
import GradesTableLoadingSkeleton from './grades-table-loading-skeleton'
import ErrorDisplay from './error-display'

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
  const [includeInactive, setIncludeInactive] = useState(false)
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
    // Empty/null is valid (not graded)
    if (value === null || value === '' || value === undefined) {
      return { isValid: true, parsedValue: null }
    }

    const numValue = parseFloat(value)

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
   * Parse grade cell data (handle {id, value} structure)
   * @param {Object|number|null} cellData - Grade cell data
   * @returns {{id: number|null, value: number|null}}
   */
  const parseGradeCell = (cellData) => {
    if (cellData === null || cellData === undefined) {
      return { id: null, value: null }
    }
    if (typeof cellData === 'object' && 'id' in cellData) {
      return { id: cellData.id, value: cellData.value }
    }
    // Fallback for simple number
    return { id: null, value: cellData }
  }

  /**
   * Fetch grades table from API
   */
  const fetchGradesTable = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchData(
        `/course-sections/${courseSectionId}/grades/table?includeInactive=${includeInactive.toString()}`,
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
        Object.entries(err.errors).forEach(([field, messages]) => {
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

  /**
   * Filter rows by search query
   */
  const filteredRows = useMemo(() => {
    if (!gradesTableData?.rows || !searchQuery) {
      return gradesTableData?.rows || []
    }

    const query = searchQuery.toLowerCase()
    return gradesTableData.rows.filter(
      (row) =>
        row.studentName?.toLowerCase().includes(query) ||
        row.studentId?.toLowerCase().includes(query)
    )
  }, [gradesTableData?.rows, searchQuery])

  /**
   * Fetch on mount and when courseSectionId or includeInactive changes
   */
  useEffect(() => {
    if (courseSectionId) {
      fetchGradesTable()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSectionId, includeInactive])

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
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No grades data available</p>
        </CardContent>
      </Card>
    )
  }

  const { columns, totalStudents, classAverage, courseName, semesterName } =
    gradesTableData
  const categorized = categorizeColumns(columns)
  const hasUnsavedChanges = modifiedGrades.size > 0

  return (
    <div className="space-y-4">
      {/* Statistics Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{courseName}</CardTitle>
              <CardDescription>{semesterName}</CardDescription>
            </div>
            <div className="flex gap-6 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold">{totalStudents}</div>
                <div className="text-muted-foreground">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {classAverage !== undefined ? classAverage.toFixed(2) : '—'}
                </div>
                <div className="text-muted-foreground">Class Average</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full"
                onClick={() => setSearchQuery('')}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Include Inactive Toggle */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="includeInactive"
              checked={includeInactive}
              onCheckedChange={setIncludeInactive}
            />
            <Label htmlFor="includeInactive" className="text-sm cursor-pointer">
              Show inactive students
            </Label>
          </div>

          {/* Filtered count */}
          {searchQuery && (
            <div className="text-sm text-muted-foreground">
              Showing {filteredRows.length} of {totalStudents} students
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh */}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchGradesTable}
            disabled={isSaving}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          {/* Discard */}
          {hasUnsavedChanges && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDiscardChanges}
              disabled={isSaving}>
              <X className="h-4 w-4 mr-2" />
              Discard
            </Button>
          )}

          {/* Save All */}
          <Button
            variant="default"
            size="sm"
            onClick={handleSaveAll}
            disabled={!hasUnsavedChanges || isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isSaving
              ? 'Saving...'
              : `Save ${modifiedGrades.size > 0 ? modifiedGrades.size : ''} ${
                  modifiedGrades.size === 1 ? 'change' : 'changes'
                }`}
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
    </div>
  )
}
