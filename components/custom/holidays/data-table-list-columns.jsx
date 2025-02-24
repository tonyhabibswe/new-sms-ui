'use client'

import { DataTableColumnHeader } from '../data-table/data-table-column-header'
import EditableNameCell from './editable-name-cell'

export const columns = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => <div className="min-w-[80px]">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <div className="w-[250px]">
        {new Date(row.getValue('date')).toLocaleString('en-US', {
          weekday: 'long', // long, short, narrow
          year: 'numeric', // numeric, 2-digit
          month: 'long', // numeric, 2-digit, long, short, narrow
          day: 'numeric' // numeric, 2-digit
        })}
      </div>
    )
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <EditableNameCell row={row} />
  }
]
