'use client'

import { DataTableColumnHeader } from '../data-table/data-table-column-header'
import EditableNameCell from './editable-name-cell'
import { format } from 'date-fns'
import { toDay } from '@/lib/semesters'

export const columns = [
  {
    accessorKey: 'id',
    label: 'ID',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => <div className="min-w-[80px]">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'date',
    label: 'Date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <div className="font-display text-[17px] font-bold leading-6">
        {format(toDay(row.getValue('date')), 'EEEE, MMMM d, yyyy')}
      </div>
    )
  },
  {
    accessorKey: 'name',
    label: 'Name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <EditableNameCell row={row} />
  }
]
