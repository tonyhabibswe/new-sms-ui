'use client'

import { DataTableColumnHeader } from '../../data-table/data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const columns = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'majorId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Major ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue('majorId')}</div>
    ),
    enableSorting: false,
    enableHiding: true
  },
  {
    accessorKey: 'semesterId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Semester ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue('semesterId')}</div>
    ),
    enableSorting: false,
    enableHiding: true
  },
  {
    accessorKey: 'courseId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Course ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue('courseId')}</div>
    ),
    enableSorting: false,
    enableHiding: true
  },
  {
    accessorKey: 'majorName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Major" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px] font-medium">
        {row.getValue('majorName') || 'N/A'}
      </div>
    )
  },
  {
    accessorKey: 'semesterName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Semester" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px]">{row.getValue('semesterName') || 'N/A'}</div>
    )
  },
  {
    accessorKey: 'gradeValue',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Passing Grade" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px] font-semibold">
        {row.getValue('gradeValue')}
      </div>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
]
