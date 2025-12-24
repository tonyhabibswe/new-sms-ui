'use client'

import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/custom/data-table/data-table-view-options'

export function DataTableToolbar({ table }) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter courses..."
          value={table.getColumn('name')?.getFilterValue() ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="h-10 w-full md:h-8 md:w-[150px] lg:w-[250px]"
        />
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
