'use client'

import { DataTableSearch } from '@/components/custom/data-table/data-table-search'
import { DataTableViewOptions } from '@/components/custom/data-table/data-table-view-options'

export function DataTableToolbar({ table }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <DataTableSearch
        placeholder="Search holidays"
        value={table.getColumn('name')?.getFilterValue() ?? ''}
        onChange={(event) =>
          table.getColumn('name')?.setFilterValue(event.target.value)
        }
      />
      <DataTableViewOptions table={table} />
    </div>
  )
}
