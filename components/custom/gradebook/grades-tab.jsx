'use client'

import { useState, useEffect, useMemo } from 'react'
import useFetchApi from '@/hooks/useFetchApi'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { FlaskConical, Loader2, Save, X, RefreshCcw, RotateCcw } from 'lucide-react'
import GradesGrid from './grades-grid'
import GradesTableLoadingSkeleton from './grades-table-loading-skeleton'
import ErrorDisplay from './error-display'
import { GradesExportButton } from './grades-export-button'
import { DataTableSearch } from '../data-table/data-table-search'
import useGradesPreview from './use-grades-preview'
import { WhatIfBanner, formatPoints } from './what-if'

const chipClass =
  'inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-[13px] text-muted-foreground'

/**
 * The item "needed to pass" starts on: the last one that no active student has
 * a grade for yet (usually the final exam), else the last item.
 */
const defaultNeededItemId = (columns, rows) => {
  const items = columns.filter((col) => col.type === 'gradeableItem')
  const active = rows.filter((row) => row.enrollmentStatus === 'active')
  const ungraded = items.filter((col) =>
    active.every((row) => row[col.key] === null || row[col.key] === undefined)
  )
  return (ungraded.at(-1) ?? items.at(-1))?.gradeableItemId ?? null
}

/**
 * Grades Tab Component - API-integrated version
 * Fetches grades table from backend with dynamic columns
 *
 * What-if mode tries grades without saving them: the API calculates the table
 * with them (the same calculation as saved grades) and, for one item, the
 * lowest grade each student needs on it to reach their passing mark.
 */
export default function GradesTab({ courseSectionId }) {
  const { toast } = useToast()
  const { fetchData } = useFetchApi()

  // API data state
  const [gradesTableData, setGradesTableData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  // Bumped on each load, so what-if results from older saved grades are dropped
  const [savedVersion, setSavedVersion] = useState(0)

  // UI state
  const [searchQuery, setSearchQuery] = useState('')
  const [modifiedGrades, setModifiedGrades] = useState(new Map())
  const [cellErrors, setCellErrors] = useState(new Map())

  // What-if state: the values being tried, keyed like modifiedGrades, and the
  // item the needed grades are worked out on
  const [whatIf, setWhatIf] = useState(false)
  const [whatIfGrades, setWhatIfGrades] = useState(new Map())
  const [neededItemId, setNeededItemId] = useState(null)
  const [whatIfSession, setWhatIfSession] = useState(0)
  const [askToSave, setAskToSave] = useState(false)

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

    // Grades are kept to 2 decimals, so the API turns down more
    if (Number(numValue.toFixed(2)) !== numValue) {
      return { isValid: false, error: 'Use 2 decimals at most' }
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
        setSavedVersion((version) => version + 1)
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

    // In what-if mode a change is only tried, never saved
    const setChanges = whatIf ? setWhatIfGrades : setModifiedGrades

    // If new value equals original value, remove modification
    if (newValue === originalValue) {
      setChanges((prev) => {
        const newMap = new Map(prev)
        newMap.delete(trackingKey)
        return newMap
      })

      // Clear any error for this cell
      const newErrors = new Map(cellErrors)
      newErrors.delete(trackingKey)
      setCellErrors(newErrors)
      return
    }

    // Add/update modification
    setChanges((prev) =>
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
   * @returns {Promise<boolean>} Whether the grades were saved
   */
  const handleSaveAll = async () => {
    if (modifiedGrades.size === 0) {
      toast({
        title: 'No changes to save'
      })
      return true
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
      return true
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
      return false
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
   * Start what-if mode from the saved grades
   */
  const enterWhatIf = () => {
    setNeededItemId(
      (current) =>
        current ?? defaultNeededItemId(gradesTableData.columns, gradesTableData.rows)
    )
    setWhatIfGrades(new Map())
    setWhatIfSession((session) => session + 1)
    setWhatIf(true)
  }

  // What-if starts from the saved grades, so unsaved changes are saved or
  // discarded first
  const handleWhatIfClick = () => {
    if (modifiedGrades.size > 0) {
      setAskToSave(true)
      return
    }
    enterWhatIf()
  }

  // Saving reloads the table, so close the question first; a failed save
  // stays out of what-if mode with the changes kept
  const handleSaveThenWhatIf = async () => {
    setAskToSave(false)
    if (await handleSaveAll()) enterWhatIf()
  }

  const handleDiscardThenWhatIf = () => {
    setModifiedGrades(new Map())
    setCellErrors(new Map())
    setAskToSave(false)
    enterWhatIf()
  }

  // Leaving drops every what-if value; the saved grades were never touched
  const exitWhatIf = () => {
    setWhatIf(false)
    setWhatIfGrades(new Map())
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

  // The what-if values as the preview endpoint takes them
  const previewGrades = useMemo(
    () =>
      Array.from(whatIfGrades.values()).map(({ enrollmentId, gradeableItemId, gradeValue }) => ({
        enrollmentId,
        gradeableItemId,
        gradeValue
      })),
    [whatIfGrades]
  )
  const {
    preview,
    neededItemId: previewNeededItemId,
    isUpdating,
    error: previewError
  } = useGradesPreview({
    courseSectionId,
    enabled: whatIf,
    grades: previewGrades,
    neededItemId,
    session: `${whatIfSession}.${savedVersion}`
  })
  const computedRows = useMemo(
    () => (preview ? new Map(preview.rows.map((row) => [row.enrollmentId, row])) : null),
    [preview]
  )

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

  const { columns, totalStudents, classAverage, curveAlgorithm, curveAdjustment } =
    gradesTableData
  const categorized = categorizeColumns(columns)
  const hasUnsavedChanges = modifiedGrades.size > 0
  const canTryWhatIf = categorized.gradeableItems.length > 0 && rows.length > 0
  const neededItem =
    categorized.gradeableItems.find((col) => col.gradeableItemId === neededItemId) ?? null
  const hasCurve = curveAlgorithm === 'AVERAGE_BASED'
  const shownAverage = preview?.classAverage ?? classAverage
  const shownAdjustment = preview?.curveAdjustment ?? curveAdjustment

  const stats = (
    <div className="flex flex-wrap gap-2">
      <span className={chipClass}>
        Class average
        <strong className="font-display text-[15px] text-foreground">
          {shownAverage !== undefined && shownAverage !== null
            ? shownAverage.toFixed(whatIf ? 2 : 1)
            : '—'}
        </strong>
        {whatIf && preview && preview.classAverage !== classAverage && (
          <span>· saved {classAverage.toFixed(2)}</span>
        )}
      </span>
      {whatIf && (
        <span className={chipClass}>
          {hasCurve ? (
            <>
              Curve
              <strong className="font-display text-[15px] text-foreground">
                +{formatPoints(shownAdjustment)}
              </strong>
              · average based
              {preview && preview.curveAdjustment !== curveAdjustment && (
                <span>· saved +{formatPoints(curveAdjustment)}</span>
              )}
            </>
          ) : (
            'No curve'
          )}
        </span>
      )}
      <span className={chipClass}>
        {searchQuery
          ? `${filteredRows.length} of ${totalStudents} students`
          : `${totalStudents} students`}
      </span>
    </div>
  )

  const saveLabel = isSaving
    ? 'Saving...'
    : hasUnsavedChanges
      ? `Save ${modifiedGrades.size} ${modifiedGrades.size === 1 ? 'change' : 'changes'}`
      : 'Save'

  return (
    <div className="flex flex-col gap-4 pb-20 md:pb-0">
      {whatIf && (
        <WhatIfBanner
          count={whatIfGrades.size}
          isUpdating={isUpdating}
          error={previewError}
          onReset={() => setWhatIfGrades(new Map())}
          onExit={exitWhatIf}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
          <DataTableSearch
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students"
          />
          {whatIf && (
            <div className="hidden items-center gap-2.5 text-sm font-semibold md:flex">
              Needed on
              <Select
                value={neededItemId !== null ? String(neededItemId) : undefined}
                onValueChange={(value) => setNeededItemId(Number(value))}>
                <SelectTrigger aria-label="Needed on" className="w-[220px] rounded-full">
                  <SelectValue placeholder="Pick an item" />
                </SelectTrigger>
                <SelectContent>
                  {categorized.gradeableItems.map((col) => (
                    <SelectItem key={col.key} value={String(col.gradeableItemId)}>
                      {col.label} /{col.maxPoints}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {!whatIf && stats}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <GradesExportButton courseSectionId={courseSectionId} />
          {!whatIf && (
            <>
              <Button
                variant="outline"
                onClick={handleWhatIfClick}
                disabled={isSaving || !canTryWhatIf}>
                <FlaskConical className="h-[18px] w-[18px]" />
                What-if
              </Button>
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
            </>
          )}
        </div>
      </div>

      {whatIf && stats}

      {/* Grades Grid */}
      <GradesGrid
        columns={categorized}
        rows={filteredRows}
        modifiedGrades={whatIf ? whatIfGrades : modifiedGrades}
        onGradeChange={handleGradeChange}
        onValidate={validateGrade}
        whatIf={whatIf}
        computedRows={whatIf ? computedRows : null}
        neededItem={whatIf ? neededItem : null}
        neededReady={previewNeededItemId !== null && previewNeededItemId === neededItemId}
        hasCurve={hasCurve}
        onNeededItemChange={(key) =>
          setNeededItemId(
            categorized.gradeableItems.find((col) => col.key === key)?.gradeableItemId ?? null
          )
        }
      />

      {whatIf ? (
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-border bg-card px-5 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 md:hidden">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">
              {whatIfGrades.size} what-if {whatIfGrades.size === 1 ? 'value' : 'values'}
            </span>
            <span className="text-[13px] text-muted-foreground">
              {isUpdating ? 'Calculating…' : 'Dashed, not saved'}
            </span>
          </div>
          <Button
            size="lg"
            variant="outline"
            onClick={() => setWhatIfGrades(new Map())}
            disabled={whatIfGrades.size === 0}>
            <RotateCcw className="h-[18px] w-[18px]" />
            Reset
          </Button>
        </div>
      ) : (
        hasUnsavedChanges && (
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
        )
      )}

      <Dialog open={askToSave} onOpenChange={setAskToSave}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save your changes first?</DialogTitle>
            <DialogDescription>
              You have {modifiedGrades.size} unsaved{' '}
              {modifiedGrades.size === 1 ? 'change' : 'changes'}. What-if mode starts
              from the saved grades, so save or discard them first.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDiscardThenWhatIf} disabled={isSaving}>
              Discard changes
            </Button>
            <Button onClick={handleSaveThenWhatIf} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-[18px] w-[18px] animate-spin" />
              ) : (
                <Save className="h-[18px] w-[18px]" />
              )}
              {isSaving ? 'Saving...' : 'Save and continue'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
