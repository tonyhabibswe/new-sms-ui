'use client'

import { DataTableColumnHeader } from '../../data-table/data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

// Ids the page needs but nobody reads; hidden and left out of the column menu
const idColumn = (key, title) => ({
  accessorKey: key,
  label: title,
  header: ({ column }) => <DataTableColumnHeader column={column} title={title} />,
  cell: ({ row }) => <div>{row.getValue(key)}</div>,
  enableSorting: false,
  enableHiding: false
})

export const columns = [
  idColumn('id', 'Id'),
  idColumn('majorId', 'Major ID'),
  idColumn('semesterId', 'Semester ID'),
  idColumn('courseId', 'Course ID'),
  {
    accessorKey: 'majorName',
    label: 'Major',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Major" />
    ),
    cell: ({ row }) => (
      <div className="font-semibold">{row.getValue('majorName') || 'N/A'}</div>
    )
  },
  {
    accessorKey: 'semesterName',
    label: 'Semester',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Semester" />
    ),
    cell: ({ row }) => <div>{row.getValue('semesterName') || 'N/A'}</div>
  },
  {
    accessorKey: 'gradeValue',
    label: 'Passing grade',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Passing grade" />
    ),
    cell: ({ row }) => (
      <div className="font-display text-[17px] font-bold tabular-nums text-primary">
        {row.getValue('gradeValue')}
      </div>
    )
  },
  {
    id: 'actions',
    label: 'Actions',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <DataTableRowActions row={row} />
      </div>
    )
  }
]
