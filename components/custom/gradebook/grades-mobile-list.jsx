'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import EditableGradeCell from './editable-grade-cell'
import { LetterChip, isBelowPassing } from './grades-grid'
import { NeededGradeLine, formatPoints } from './what-if'

const formatGrade = (value) =>
  value !== undefined && value !== null ? formatPoints(value) : '—'

/**
 * The grades grid on phones: pick one gradeable item, then enter it for every
 * student down the list. Each row also shows the student's final grade.
 *
 * In what-if mode the item picked is also the one the needed grades are for.
 * Each row then shows the grade that's compared with the passing mark (the
 * curved one when the section has a curve) and what the student needs.
 */
export default function GradesMobileList({
  columns,
  rows,
  parseGradeCell,
  isGradeModified,
  getCurrentGradeValue,
  onGradeChange,
  onValidate,
  whatIf = false,
  computedRows = null,
  neededItem = null,
  neededReady = false,
  hasCurve = false,
  onNeededItemChange
}) {
  const { gradeableItems, categories, calculated } = columns
  const [itemKey, setItemKey] = useState(gradeableItems[0]?.key)
  const selectedKey = whatIf && neededItem ? neededItem.key : itemKey
  const item = gradeableItems.find((col) => col.key === selectedKey) ?? gradeableItems[0]
  const selectItem = (key) =>
    whatIf && onNeededItemChange ? onNeededItemChange(key) : setItemKey(key)
  const category = categories.find((col) => col.categoryId === item.categoryId)
  const finalColumn = calculated.find((col) => col.key === 'finalGrade')
  const letterColumn = calculated.find((col) => col.key === 'letterGrade')

  return (
    <div className="flex flex-col gap-3 md:hidden">
      <div
        role="group"
        aria-label={whatIf ? 'Item to try' : 'Item to grade'}
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
        {gradeableItems.map((col) => (
          <button
            key={col.key}
            type="button"
            aria-pressed={col.key === item.key}
            onClick={() => selectItem(col.key)}
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
      {whatIf ? (
        <p className="text-[13px] text-muted-foreground">
          Needed to pass on <strong className="text-foreground">{item.label}</strong>
        </p>
      ) : (
        category && <p className="text-[13px] text-muted-foreground">{category.label}</p>
      )}
      <ul className="flex flex-col gap-2">
        {rows.map((row) => {
          const isInactive = row.enrollmentStatus === 'inactive'
          const { id, value } = parseGradeCell(row, item.key)
          const isModified = isGradeModified(id, row.enrollmentId, item.gradeableItemId)
          const finalValue = finalColumn ? row[finalColumn.key] : null
          const shown = computedRows?.get(row.enrollmentId) ?? row
          const below = isBelowPassing(shown, 'curvedFinalGrade')
          const resultChanged =
            whatIf &&
            shown !== row &&
            (shown.curvedFinalGrade !== row.curvedFinalGrade ||
              shown.curvedLetterGrade !== row.curvedLetterGrade)
          return (
            <li
              key={row.enrollmentId}
              className={cn(
                'flex items-center gap-3 rounded-[18px] border border-border p-3 pl-4',
                isModified && !whatIf ? 'bg-brand-400/5' : 'bg-card',
                isInactive && 'opacity-60'
              )}>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="truncate text-[15px] font-semibold leading-5">
                  {row.studentName}
                </span>
                {whatIf ? (
                  <>
                    <span className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                      {hasCurve ? 'Curved' : 'Final'}{' '}
                      <strong
                        className={cn(
                          'font-display text-sm',
                          below ? 'text-absent' : 'text-foreground'
                        )}>
                        {formatGrade(shown.curvedFinalGrade)}
                      </strong>
                      <LetterChip
                        value={shown.curvedLetterGrade}
                        failing={below}
                        passingGrade={shown.passingGrade}
                      />
                      {resultChanged && (
                        <span>
                          saved {formatGrade(row.curvedFinalGrade)} · {row.curvedLetterGrade ?? '—'}
                        </span>
                      )}
                    </span>
                    <NeededGradeLine
                      row={shown}
                      maxPoints={item.maxPoints}
                      ready={neededReady && shown !== row}
                    />
                  </>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    Final{' '}
                    {finalValue !== undefined && finalValue !== null
                      ? Number(finalValue).toFixed(1)
                      : '—'}
                    {letterColumn && (
                      <LetterChip
                        value={row[letterColumn.key]}
                        failing={isBelowPassing(row, letterColumn.key)}
                        passingGrade={row.passingGrade}
                      />
                    )}
                  </span>
                )}
              </div>
              <EditableGradeCell
                as="div"
                gradeId={id}
                value={getCurrentGradeValue(id, value, row.enrollmentId, item.gradeableItemId)}
                maxPoints={item.maxPoints}
                isModified={isModified}
                isInactive={isInactive}
                whatIf={whatIf}
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
