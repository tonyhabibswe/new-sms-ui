'use client'

import { DataTableSearch } from '@/components/custom/data-table/data-table-search'
import { DataTableViewOptions } from '@/components/custom/data-table/data-table-view-options'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const ALL = 'all'

export function DataTableToolbar({ table }) {
  const majorColumn = table.getColumn('major')
  const majors = [...(majorColumn?.getFacetedUniqueValues().keys() ?? [])]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))

  return (
    <div className="flex flex-wrap items-center gap-3">
      <DataTableSearch
        placeholder="Search by name, ID or email"
        label="Search students"
        value={table.getColumn('name')?.getFilterValue() ?? ''}
        onChange={(event) =>
          table.getColumn('name')?.setFilterValue(event.target.value)
        }
      />
      <Select
        value={majorColumn?.getFilterValue() ?? ALL}
        onValueChange={(value) =>
          majorColumn?.setFilterValue(value === ALL ? undefined : value)
        }>
        <SelectTrigger aria-label="Filter by major" className="w-full rounded-full sm:w-[220px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All majors</SelectItem>
          {majors.map((major) => (
            <SelectItem key={major} value={major}>
              {major}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DataTableViewOptions table={table} />
    </div>
  )
}
