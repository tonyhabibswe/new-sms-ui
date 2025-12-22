'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import EditableGradeCell from './editable-grade-cell'

/**
 * Dynamic Grades Grid Component
 * Renders grades table with dynamic columns from API
 *
 * @param {Object} props
 * @param {Object} props.columns - Categorized columns {identifiers, gradeableItems, categories, calculated}
 * @param {Array} props.rows - Student rows with dynamic grade data
 * @param {Map} props.modifiedGrades - Map of modified grades
 * @param {Function} props.onGradeChange - Grade change handler
 * @param {Function} props.onValidate - Validation function
 */
export default function GradesGrid({
  columns,
  rows,
  modifiedGrades,
  onGradeChange,
  onValidate
}) {
  if (!columns || !rows) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No grades data available</p>
        </CardContent>
      </Card>
    )
  }

  const { identifiers, gradeableItems, categories, calculated } = columns

  if (gradeableItems.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">
            No grade items yet. Add categories and items first.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (rows.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No enrolled students found</p>
        </CardContent>
      </Card>
    )
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

  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative overflow-auto w-full">
          <Table>
            <TableHeader className="sticky top-0 z-30">
              <TableRow className="border-b">
                {/* Sticky identifier columns */}
                {identifiers.map((col, index) => (
                  <TableHead
                    key={col.key}
                    className={cn(
                      'sticky z-40 bg-muted border-r min-w-[150px]',
                      index === 0 && 'left-0',
                      index === 1 && 'left-[150px]'
                    )}>
                    {col.label}
                  </TableHead>
                ))}

                {/* Gradeable item columns */}
                {gradeableItems.map((col) => (
                  <TableHead
                    key={col.key}
                    className="text-center min-w-[120px] bg-muted">
                    <div className="text-xs font-normal text-muted-foreground mb-1">
                      {col.categoryName}
                    </div>
                    <div className="font-medium">{col.label}</div>
                    <div className="text-xs font-normal text-muted-foreground">
                      (Max: {col.maxPoints})
                    </div>
                  </TableHead>
                ))}

                {/* Category average columns */}
                {categories.map((col) => (
                  <TableHead
                    key={col.key}
                    className="text-center min-w-[120px] bg-muted border-l-2">
                    <div className="font-medium">{col.label}</div>
                    <div className="text-xs font-normal text-muted-foreground">
                      {col.algorithm}
                    </div>
                  </TableHead>
                ))}

                {/* Calculated columns */}
                {calculated.map((col) => (
                  <TableHead
                    key={col.key}
                    className="text-center min-w-[120px] bg-accent/50 border-l-2">
                    <div className="font-medium">{col.label}</div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.map((row) => {
                const isInactive = row.enrollmentStatus === 'inactive'
                const hasModifications = gradeableItems.some((col) => {
                  const { id } = parseGradeCell(row, col.key)
                  return isGradeModified(
                    id,
                    row.enrollmentId,
                    col.gradeableItemId
                  )
                })

                return (
                  <TableRow
                    key={row.enrollmentId}
                    className={cn(
                      hasModifications &&
                        'bg-yellow-50/30 dark:bg-yellow-950/10',
                      isInactive && 'opacity-60'
                    )}>
                    {/* Sticky identifier columns */}
                    {identifiers.map((col, index) => (
                      <TableCell
                        key={col.key}
                        className={cn(
                          'sticky z-20 bg-background border-r',
                          index === 0 && 'left-0 font-medium',
                          index === 1 && 'left-[150px]',
                          hasModifications &&
                            'bg-yellow-50/30 dark:bg-yellow-950/10'
                        )}>
                        <div className="flex items-center gap-2">
                          {row[col.key]}
                          {isInactive && index === 0 && (
                            <Badge variant="outline" className="text-xs">
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    ))}

                    {/* Gradeable item cells (editable) */}
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

                    {/* Category average cells (read-only) */}
                    {categories.map((col) => {
                      const value = row[col.key]
                      return (
                        <TableCell
                          key={col.key}
                          className="text-center bg-muted/30 border-l-2 font-medium">
                          {value !== undefined && value !== null
                            ? typeof value === 'number'
                              ? value.toFixed(2)
                              : value
                            : '—'}
                        </TableCell>
                      )
                    })}

                    {/* Calculated cells (read-only) */}
                    {calculated.map((col) => {
                      const value = row[col.key]
                      return (
                        <TableCell
                          key={col.key}
                          className="text-center bg-accent/20 border-l-2 font-medium">
                          {value !== undefined && value !== null
                            ? typeof value === 'number'
                              ? value.toFixed(2)
                              : value
                            : '—'}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
