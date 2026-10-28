'use client'

import { DataTableSearch } from '@/components/custom/data-table/data-table-search'
import { DataTableViewOptions } from '@/components/custom/data-table/data-table-view-options'
import { DataTableActionOptions } from './data-table-action-options'

export function DataTableToolbar({ table }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <DataTableSearch
        placeholder="Search students"
        value={table.getColumn('name')?.getFilterValue() ?? ''}
        onChange={(event) =>
          table.getColumn('name')?.setFilterValue(event.target.value)
        }
      />
      <div className="flex gap-3">
        <DataTableActionOptions />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
