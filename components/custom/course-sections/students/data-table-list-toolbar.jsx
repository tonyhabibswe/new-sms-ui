'use client'

import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/custom/data-table/data-table-view-options'
import { DataTableActionOptions } from './data-table-action-options'

export function DataTableToolbar({ table }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter students..."
          value={table.getColumn('firstName')?.getFilterValue() ?? ''}
          onChange={(event) =>
            table.getColumn('firstName')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <div className="flex gap-3">
        <DataTableActionOptions table={table} />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
