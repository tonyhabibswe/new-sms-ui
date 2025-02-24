'use client'

import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/custom/data-table/data-table-view-options'

export function DataTableToolbar({ table }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter courses..."
          value={table.getColumn('code')?.getFilterValue() ?? ''}
          onChange={(event) =>
            table.getColumn('code')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
