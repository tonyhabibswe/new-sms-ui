'use client'

import { DataTable } from '@/components/custom/data-table/data-table'
import { columns } from './data-table-list-columns'
import { DataTableToolbar } from './data-table-list-toolbar'

export function PassingGradesTable({ data, error, courseId }) {
  return (
    <DataTable
      data={data}
      columns={columns}
      toolbar={(props) => <DataTableToolbar {...props} courseId={courseId} />}
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
