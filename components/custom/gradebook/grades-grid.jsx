'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import EditableGradeCell from './editable-grade-cell'
import GradesMobileList from './grades-mobile-list'
import { algorithmLabel } from './categories-table'
import { NeededGrade, SavedValue, formatPoints } from './what-if'

const isLetterColumn = (col) => /letter/i.test(col.key)

const formatValue = (value) =>
  value !== undefined && value !== null
    ? typeof value === 'number'
      ? value.toFixed(2)
      : value
    : '—'

// The grade each calculated column is judged by: the letter by the final grade,
// the curved letter by the curved grade, as in the Excel export
const GRADE_FOR_COLUMN = {
  finalGrade: 'finalGrade',
  letterGrade: 'finalGrade',
  curvedFinalGrade: 'curvedFinalGrade',
  curvedLetterGrade: 'curvedFinalGrade'
}

/**
 * Whether a row's grade for a calculated column is below the student's passing
 * mark: their major's passing grade for the course, or 60 when none is set.
 */
export const isBelowPassing = (row, columnKey) => {
  const grade = row[GRADE_FOR_COLUMN[columnKey]]
  if (grade === null || grade === undefined || row.passingGrade === undefined) return false
  return grade < row.passingGrade
}

// Letter grades as chips; one below the passing mark is flagged like an absence.
// Without a passing mark, an F is.
export function LetterChip({ value, failing, passingGrade }) {
  if (value === undefined || value === null || value === '') return '—'
  const isFailing = failing ?? String(value).startsWith('F')
  return (
    <span
      title={
        isFailing
          ? passingGrade !== undefined
            ? `Below the passing mark of ${formatPoints(passingGrade)}`
            : 'Failing grade'
          : undefined
      }
      className={cn(
        'inline-flex min-w-[40px] justify-center rounded-lg border px-2.5 py-1 text-[13px] font-bold',
        isFailing
          ? 'border-absent-solid/30 bg-absent-tint text-absent'
          : 'border-border bg-muted text-foreground'
      )}>
      {value}
    </span>
  )
}

function EmptyState({ children }) {
  return (
    <div className="rounded-card-sm border border-dashed border-input bg-card px-6 py-12 text-center text-sm text-muted-foreground sm:rounded-card">
      {children}
    </div>
  )
}

/**
 * Dynamic Grades Grid Component
 * Renders grades table with dynamic columns from API
 * Supports dual rendering: one item at a time on phones, the full table on desktop
 *
 * In what-if mode, modifiedGrades holds the what-if values, the calculated
 * columns come from computedRows (the API's preview), and anything the what-if
 * values changed shows its saved value under it.
 *
 * @param {Object} props
 * @param {Object} props.columns - Categorized columns {identifiers, gradeableItems, categories, calculated}
 * @param {Array} props.rows - Student rows with dynamic grade data
 * @param {Map} props.modifiedGrades - Map of modified grades
 * @param {Function} props.onGradeChange - Grade change handler
 * @param {Function} props.onValidate - Validation function
 * @param {boolean} props.whatIf - What-if mode
 * @param {Map|null} props.computedRows - Previewed rows by enrollment ID
 * @param {Object|null} props.neededItem - The item column the needed grades are for
 * @param {boolean} props.neededReady - Whether computedRows has the needed grades for neededItem
 * @param {boolean} props.hasCurve - Whether the section's grades are curved
 * @param {Function} props.onNeededItemChange - On phones the item picked is the needed item (column key)
 */
export default function GradesGrid({
  columns,
  rows,
  modifiedGrades,
  onGradeChange,
  onValidate,
  whatIf = false,
  computedRows = null,
  neededItem = null,
  neededReady = false,
  hasCurve = false,
  onNeededItemChange
}) {
  if (!columns || !rows) {
    return <EmptyState>No grades data available</EmptyState>
  }

  const { identifiers, gradeableItems, categories, calculated } = columns

  if (gradeableItems.length === 0) {
    return <EmptyState>No grade items yet. Add categories and items first.</EmptyState>
  }

  if (rows.length === 0) {
    return <EmptyState>No enrolled students found</EmptyState>
  }

  /**
   * Parse grade cell data from row
   * @param {Object} row - Student row
   * @param {string} columnKey - Column key
   * @returns {{id: number|null, value: number|null}}
   */
  const parseGradeCell = (row, columnKey) => {
    const cellData = row[columnKey]

    if (cellData === null || cellData === undefined) {
      return { id: null, value: null }
    }

    if (typeof cellData === 'object' && 'id' in cellData) {
      return { id: cellData.id, value: cellData.value }
    }

    // Fallback for simple values
    return { id: null, value: cellData }
  }

  /**
   * Check if a grade has been modified
   * @param {number|null} gradeId - Grade ID
   * @param {number} enrollmentId - Enrollment ID
   * @param {number} gradeableItemId - Gradeable item ID
   * @returns {boolean}
   */
  const isGradeModified = (gradeId, enrollmentId, gradeableItemId) => {
    const trackingKey =
      gradeId !== null && gradeId !== undefined
        ? `grade_${gradeId}`
        : `new_${enrollmentId}_${gradeableItemId}`
    return modifiedGrades.has(trackingKey)
  }

  /**
   * Get current grade value (modified or original)
   * @param {number|null} gradeId - Grade ID
   * @param {number|null} originalValue - Original value
   * @param {number} enrollmentId - Enrollment ID
   * @param {number} gradeableItemId - Gradeable item ID
   * @returns {number|null}
   */
  const getCurrentGradeValue = (
    gradeId,
    originalValue,
    enrollmentId,
    gradeableItemId
  ) => {
    const trackingKey =
      gradeId !== null && gradeId !== undefined
        ? `grade_${gradeId}`
        : `new_${enrollmentId}_${gradeableItemId}`

    const modified = modifiedGrades.get(trackingKey)
    if (modified) {
      return modified.gradeValue
    }

    return originalValue
  }

  const stickyBg = (hasModifications) =>
    hasModifications ? 'bg-[hsl(var(--card))] [background-image:linear-gradient(hsl(var(--brand-400)/0.05),hsl(var(--brand-400)/0.05))]' : 'bg-card'

  return (
    <>
      <GradesMobileList
        columns={columns}
        rows={rows}
        parseGradeCell={parseGradeCell}
        isGradeModified={isGradeModified}
        getCurrentGradeValue={getCurrentGradeValue}
        onGradeChange={onGradeChange}
        onValidate={onValidate}
        whatIf={whatIf}
        computedRows={computedRows}
        neededItem={neededItem}
        neededReady={neededReady}
        hasCurve={hasCurve}
        onNeededItemChange={onNeededItemChange}
      />

      <div className="hidden overflow-hidden rounded-card border border-border bg-card shadow-card md:block">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-30">
              <TableRow>
                {identifiers.map((col, index) => (
                  <TableHead
                    key={col.key}
                    className={cn(
                      'sticky z-40 h-auto min-w-[150px] border-r border-border bg-card py-3 align-bottom',
                      index === 0 && 'left-0',
                      index === 1 && 'left-[150px]'
                    )}>
                    {col.label}
                  </TableHead>
                ))}

                {gradeableItems.map((col) => (
                  <TableHead
                    key={col.key}
                    className="h-auto min-w-[120px] bg-card px-3 py-3 text-right align-bottom normal-case tracking-normal">
                    <div className="text-[11px] font-semibold uppercase tracking-[1.2px] text-faint">
                      {col.categoryName}
                    </div>
                    <div className="text-sm font-semibold text-foreground">{col.label}</div>
                    <div className="text-xs font-medium text-muted-foreground">
                      /{col.maxPoints}
                    </div>
                  </TableHead>
                ))}

                {categories.map((col) => (
                  <TableHead
                    key={col.key}
                    className="h-auto min-w-[120px] border-l border-border bg-muted px-3 py-3 text-right align-bottom">
                    {col.label}
                    <div className="mt-0.5 text-xs font-medium normal-case tracking-normal text-muted-foreground">
                      {algorithmLabel(col.algorithm)}
                    </div>
                  </TableHead>
                ))}

                {calculated.map((col) => (
                  <TableHead
                    key={col.key}
                    className={cn(
                      'h-auto min-w-[110px] border-l border-border bg-muted px-3 py-3 align-bottom',
                      isLetterColumn(col) ? 'text-center' : 'text-right'
                    )}>
                    {col.label}
                  </TableHead>
                ))}

                {whatIf && neededItem && (
                  <TableHead className="sticky right-0 z-40 h-auto min-w-[150px] border-l border-border bg-card px-4 py-3 align-bottom text-foreground shadow-[-8px_0_12px_-12px_rgba(45,46,50,0.35)]">
                    Needed on
                    <div className="mt-0.5 text-[13px] font-bold normal-case tracking-normal">
                      {neededItem.label}
                    </div>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.map((row) => {
                const isInactive = row.enrollmentStatus === 'inactive'
                const hasModifications = gradeableItems.some((col) => {
                  const { id } = parseGradeCell(row, col.key)
                  return isGradeModified(id, row.enrollmentId, col.gradeableItemId)
                })
                // Only real, unsaved changes tint the row
                const tinted = hasModifications && !whatIf
                // The numbers to show: the preview's in what-if mode
                const shown = computedRows?.get(row.enrollmentId) ?? row
                const changed = (key) => whatIf && shown !== row && shown[key] !== row[key]

                return (
                  <TableRow
                    key={row.enrollmentId}
                    className={cn(
                      tinted && 'bg-brand-400/5',
                      isInactive && 'opacity-60'
                    )}>
                    {identifiers.map((col, index) => (
                      <TableCell
                        key={col.key}
                        className={cn(
                          'sticky z-20 border-r border-border',
                          stickyBg(tinted),
                          index === 0 && 'left-0',
                          index === 1 && 'left-[150px] font-semibold'
                        )}>
                        <div className="flex items-center gap-2">
                          {row[col.key]}
                          {isInactive && index === 0 && (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </div>
                        {whatIf && col.key === 'studentName' && (
                          <div className="whitespace-nowrap text-[13px] font-normal text-muted-foreground">
                            {shown.majorName ?? 'No major'} · pass{' '}
                            {formatPoints(shown.passingGrade ?? 60)}
                          </div>
                        )}
                      </TableCell>
                    ))}

                    {gradeableItems.map((col) => {
                      const { id, value } = parseGradeCell(row, col.key)
                      const currentValue = getCurrentGradeValue(
                        id,
                        value,
                        row.enrollmentId,
                        col.gradeableItemId
                      )
                      const isModified = isGradeModified(
                        id,
                        row.enrollmentId,
                        col.gradeableItemId
                      )

                      return (
                        <EditableGradeCell
                          key={col.key}
                          gradeId={id}
                          value={currentValue}
                          maxPoints={col.maxPoints}
                          isModified={isModified}
                          isInactive={isInactive}
                          whatIf={whatIf}
                          label={`${row.studentName}, ${col.label}`}
                          onChange={(gradeId, newValue) =>
                            onGradeChange(
                              gradeId,
                              newValue,
                              value,
                              row.enrollmentId,
                              col.gradeableItemId
                            )
                          }
                          onValidate={onValidate}
                        />
                      )
                    })}

                    {categories.map((col) => (
                      <TableCell
                        key={col.key}
                        className="border-l border-border bg-muted/60 px-3 text-right font-medium tabular-nums">
                        <span className={cn(changed(col.key) && 'font-bold')}>
                          {formatValue(shown[col.key])}
                        </span>
                        {changed(col.key) && <SavedValue>{formatValue(row[col.key])}</SavedValue>}
                      </TableCell>
                    ))}

                    {calculated.map((col) => (
                      <TableCell
                        key={col.key}
                        className={cn(
                          'border-l border-border bg-muted/60 px-3',
                          isLetterColumn(col)
                            ? 'text-center'
                            : 'text-right font-display text-base font-bold tabular-nums'
                        )}>
                        {isLetterColumn(col) ? (
                          <LetterChip
                            value={shown[col.key]}
                            failing={isBelowPassing(shown, col.key)}
                            passingGrade={shown.passingGrade}
                          />
                        ) : (
                          <span className={cn(isBelowPassing(shown, col.key) && 'text-absent')}>
                            {formatValue(shown[col.key])}
                          </span>
                        )}
                        {changed(col.key) && <SavedValue>{formatValue(row[col.key])}</SavedValue>}
                      </TableCell>
                    ))}

                    {whatIf && neededItem && (
                      <TableCell className="sticky right-0 z-20 whitespace-nowrap border-l border-border bg-card px-4 shadow-[-8px_0_12px_-12px_rgba(45,46,50,0.35)]">
                        <NeededGrade
                          row={shown}
                          maxPoints={neededItem.maxPoints}
                          ready={neededReady && shown !== row}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-border px-6 py-4 text-[13px] text-faint">
          {whatIf ? (
            <>
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-4 w-4 rounded border-2 border-dashed border-foreground bg-muted"
                />
                What-if value, not saved
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="font-display text-sm font-bold text-foreground">74</span>
                Result with the what-if values, the saved one under it
              </span>
            </>
          ) : (
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-4 w-4 rounded border-2 border-primary bg-brand-400/5"
              />
              Changed, not saved yet
            </span>
          )}
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-flex h-[18px] items-center rounded border border-absent-solid/30 bg-absent-tint px-1.5 text-[11px] font-bold text-absent">
              F
            </span>
            Below the passing mark: the major&apos;s passing grade, else 60
          </span>
          {whatIf && neededItem && (
            <span className="inline-flex items-center gap-2">
              <span className="font-semibold text-foreground">Needed on</span>
              The lowest score on that item that reaches the passing mark, with the
              other grades as shown and the curve
            </span>
          )}
        </div>
      </div>
    </>
  )
}
