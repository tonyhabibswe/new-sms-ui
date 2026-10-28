'use client'

import { DataTable } from '@/components/custom/data-table/data-table'
import { columns } from './data-table-list-columns'
import { DataTableToolbar } from './data-table-list-toolbar'

export function PassingGradesTable({ data, error }) {
  return (
    <DataTable
      data={data}
      columns={columns}
      toolbar={DataTableToolbar}
      error={error}
      columnVisibilityInitialState={{
        id: false,
        majorId: false,
        semesterId: false,
        courseId: false
      }}
    />
  )
}
