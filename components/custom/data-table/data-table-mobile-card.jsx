'use client'

import { flexRender } from '@tanstack/react-table'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function DataTableMobileCard({ row, columns }) {
  // Filter out hidden columns and the selection column
  const visibleColumns = columns.filter((column) => {
    if (column.id === 'select') return false
    if (row.getIsVisible && !row.getIsVisible(column.id)) return false
    return column.accessorKey || column.id === 'actions'
  })

  return (
    <Card className="mb-3">
      <CardContent className="p-4 space-y-3">
        {visibleColumns.map((column, index) => {
          const cell = row
            .getVisibleCells()
            .find((c) => c.column.id === (column.accessorKey || column.id))

          if (!cell) return null

          // Special handling for actions column - render full width at the bottom
          if (column.id === 'actions') {
            return (
              <div key={column.id}>
                <Separator className="my-3" />
                <div className="flex justify-end">
                  {flexRender(column.cell, cell.getContext())}
                </div>
              </div>
            )
          }

          // Get column header title
          const headerTitle =
            column.label ||
            (typeof column.header === 'function'
              ? column.accessorKey
              : column.header) ||
            column.accessorKey

          return (
            <div key={column.accessorKey || column.id} className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground uppercase">
                {headerTitle}
              </div>
              <div className="text-sm">
                {flexRender(column.cell, cell.getContext())}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
