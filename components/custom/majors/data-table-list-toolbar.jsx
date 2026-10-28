'use client'

import { DataTableSearch } from '@/components/custom/data-table/data-table-search'
import { DataTableViewOptions } from '@/components/custom/data-table/data-table-view-options'

export function DataTableToolbar({ table }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <DataTableSearch
        placeholder="Search majors"
        value={table.getColumn('systemName')?.getFilterValue() ?? ''}
        onChange={(event) =>
          table.getColumn('systemName')?.setFilterValue(event.target.value)
        }
      />
      <DataTableViewOptions table={table} />
    </div>
  )
}
