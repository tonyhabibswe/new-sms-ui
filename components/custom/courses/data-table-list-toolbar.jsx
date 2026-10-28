'use client'

import { DataTableSearch } from '@/components/custom/data-table/data-table-search'

export function DataTableToolbar({ table }) {
  return (
    <DataTableSearch
      placeholder="Search by code or name"
      label="Search courses"
      value={table.getColumn('code')?.getFilterValue() ?? ''}
      onChange={(event) =>
        table.getColumn('code')?.setFilterValue(event.target.value)
      }
    />
  )
}
