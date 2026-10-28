'use client'

import { DataTableSearch } from '@/components/custom/data-table/data-table-search'
import { DataTableViewOptions } from '@/components/custom/data-table/data-table-view-options'

export function DataTableToolbar({ table }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <DataTableSearch
        placeholder="Search by course or room"
        value={table.getColumn('code')?.getFilterValue() ?? ''}
        onChange={(event) =>
          table.getColumn('code')?.setFilterValue(event.target.value)
        }
      />
      <DataTableViewOptions table={table} />
    </div>
  )
}
