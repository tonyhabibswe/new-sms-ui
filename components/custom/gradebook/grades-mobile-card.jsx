'use client'

import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import EditableGradeCell from './editable-grade-cell'

/**
 * Mobile Card View for Gradebook Grades
 * Displays student grades in a card format with expandable categories
 *
 * @param {Object} props
 * @param {Object} props.row - Student row data
 * @param {Object} props.columns - Categorized columns
 * @param {Map} props.modifiedGrades - Map of modified grades
 * @param {Function} props.onGradeChange - Grade change handler
 * @param {Function} props.onValidate - Validation function
 */
export default function GradesMobileCard({
  row,
  columns,
  modifiedGrades,
  onGradeChange,
  onValidate
}) {
  const { identifiers, gradeableItems, categories, calculated } = columns
  const isInactive = row.enrollmentStatus === 'inactive'

  /**
   * Parse grade cell data from row
   */
  const parseGradeCell = (row, columnKey) => {
    const cellData = row[columnKey]
    if (cellData === null || cellData === undefined) {
      return { id: null, value: null }
    }
    if (typeof cellData === 'object' && 'id' in cellData) {
      return { id: cellData.id, value: cellData.value }
    }
    return { id: null, value: cellData }
  }

  /**
   * Check if a grade has been modified
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

  /**
   * Group gradeable items by category
   */
  const groupedItems = gradeableItems.reduce((acc, item) => {
    const categoryName = item.categoryName || 'Uncategorized'
    if (!acc[categoryName]) {
      acc[categoryName] = []
    }
    acc[categoryName].push(item)
    return acc
  }, {})

  // Check if student has any modifications
  const hasModifications = gradeableItems.some((col) => {
    const { id } = parseGradeCell(row, col.key)
    return isGradeModified(id, row.enrollmentId, col.gradeableItemId)
  })

  return (
    <Card
      className={cn(
        'mb-4',
        hasModifications &&
          'border-yellow-500/50 bg-yellow-50/30 dark:bg-yellow-950/10',
        isInactive && 'opacity-60'
      )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            {/* Student identifiers */}
            {identifiers.map((col, index) => (
              <div
                key={col.key}
                className={
                  index === 0
                    ? 'text-lg font-semibold'
                    : 'text-sm text-muted-foreground'
                }>
                {row[col.key]}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-end gap-1">
            {isInactive && (
              <Badge variant="outline" className="text-xs">
                Inactive
              </Badge>
            )}
            {hasModifications && (
              <Badge variant="secondary" className="text-xs">
                Modified
              </Badge>
            )}
          </div>
        </div>

        {/* Final grades summary */}
        {calculated.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <div className="grid grid-cols-2 gap-2">
              {calculated.map((col) => {
                const value = row[col.key]
                return (
                  <div
                    key={col.key}
                    className="text-center p-2 bg-accent/20 rounded">
                    <div className="text-xs text-muted-foreground">
                      {col.label}
                    </div>
                    <div className="text-lg font-bold">
                      {value !== undefined && value !== null
                        ? typeof value === 'number'
                          ? value.toFixed(2)
                          : value
                        : '—'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <Accordion type="multiple" className="w-full">
          {/* Gradeable items by category */}
          {Object.entries(groupedItems).map(
            ([categoryName, items], categoryIndex) => {
              // Find corresponding category average
              const categoryAvgColumn = categories.find(
                (cat) => cat.categoryName === categoryName
              )
              const categoryAvgValue = categoryAvgColumn
                ? row[categoryAvgColumn.key]
                : null

              return (
                <AccordionItem
                  key={categoryName}
                  value={`category-${categoryIndex}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-2">
                      <span className="font-medium">📂 {categoryName}</span>
                      {categoryAvgValue !== null &&
                        categoryAvgValue !== undefined && (
                          <Badge variant="secondary" className="ml-2">
                            {typeof categoryAvgValue === 'number'
                              ? `${categoryAvgValue.toFixed(2)}%`
                              : categoryAvgValue}
                          </Badge>
                        )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      {items.map((col) => {
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
                          <div
                            key={col.key}
                            className={cn(
                              'flex items-center justify-between p-3 rounded-lg border bg-card',
                              isModified &&
                                'border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20'
                            )}>
                            <div className="flex-1">
                              <div className="font-medium text-sm">
                                {col.label}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Max: {col.maxPoints} points
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <EditableGradeCell
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
                              <span className="text-xs text-muted-foreground">
                                / {col.maxPoints}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            }
          )}
        </Accordion>

        {/* Category averages summary (if no items to expand) */}
        {gradeableItems.length === 0 && categories.length > 0 && (
          <div className="space-y-2 mt-3">
            <Separator />
            <div className="text-sm font-medium text-muted-foreground">
              Category Averages
            </div>
            {categories.map((col) => {
              const value = row[col.key]
              return (
                <div
                  key={col.key}
                  className="flex items-center justify-between p-2 rounded bg-muted/30">
                  <span className="text-sm">{col.label}</span>
                  <span className="font-medium">
                    {value !== undefined && value !== null
                      ? typeof value === 'number'
                        ? value.toFixed(2)
                        : value
                      : '—'}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
