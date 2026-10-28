'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import EditableGradeCell from './editable-grade-cell'
import { LetterChip } from './grades-grid'

/**
 * The grades grid on phones: pick one gradeable item, then enter it for every
 * student down the list. Each row also shows the student's final grade.
 */
export default function GradesMobileList({
  columns,
  rows,
  parseGradeCell,
  isGradeModified,
  getCurrentGradeValue,
  onGradeChange,
  onValidate
}) {
  const { gradeableItems, categories, calculated } = columns
  const [itemKey, setItemKey] = useState(gradeableItems[0]?.key)
  const item = gradeableItems.find((col) => col.key === itemKey) ?? gradeableItems[0]
  const category = categories.find((col) => col.categoryId === item.categoryId)
  const finalColumn = calculated.find((col) => col.key === 'finalGrade')
  const letterColumn = calculated.find((col) => col.key === 'letterGrade')

  return (
    <div className="flex flex-col gap-3 md:hidden">
      <div
        role="group"
        aria-label="Item to grade"
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
        {gradeableItems.map((col) => (
          <button
            key={col.key}
            type="button"
            aria-pressed={col.key === item.key}
            onClick={() => setItemKey(col.key)}
            className={cn(
              'h-10 shrink-0 rounded-full border px-3.5 text-[13px] font-semibold transition-colors',
              col.key === item.key
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-card text-foreground'
            )}>
            {col.label}{' '}
            <span className={col.key === item.key ? 'font-medium' : 'font-medium text-muted-foreground'}>
              /{col.maxPoints}
            </span>
          </button>
        ))}
      </div>
      {category && (
        <p className="text-[13px] text-muted-foreground">{category.label}</p>
      )}
      <ul className="flex flex-col gap-2">
        {rows.map((row) => {
          const isInactive = row.enrollmentStatus === 'inactive'
          const { id, value } = parseGradeCell(row, item.key)
          const isModified = isGradeModified(id, row.enrollmentId, item.gradeableItemId)
          const finalValue = finalColumn ? row[finalColumn.key] : null
          return (
            <li
              key={row.enrollmentId}
              className={cn(
                'flex items-center gap-3 rounded-[18px] border border-border p-3 pl-4',
                isModified ? 'bg-brand-400/5' : 'bg-card',
                isInactive && 'opacity-60'
              )}>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="truncate text-[15px] font-semibold leading-5">
                  {row.studentName}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  Final{' '}
                  {finalValue !== undefined && finalValue !== null
                    ? Number(finalValue).toFixed(1)
                    : '—'}
                  {letterColumn && <LetterChip value={row[letterColumn.key]} />}
                </span>
              </div>
              <EditableGradeCell
                as="div"
                gradeId={id}
                value={getCurrentGradeValue(id, value, row.enrollmentId, item.gradeableItemId)}
                maxPoints={item.maxPoints}
                isModified={isModified}
                isInactive={isInactive}
                label={`${row.studentName}, ${item.label}`}
                onChange={(gradeId, newValue) =>
                  onGradeChange(gradeId, newValue, value, row.enrollmentId, item.gradeableItemId)
                }
                onValidate={onValidate}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
