'use client'

import { DataTableColumnHeader } from '../data-table/data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const columns = [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false
  // },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => <div className="w-[10px]">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'sessionStart',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date & Time" />
    ),
    cell: ({ row }) => (
      <div className="w-[400px]">
        {new Date(row.getValue('sessionStart')).toLocaleString('en-US', {
          weekday: 'long', // long, short, narrow
          year: 'numeric', // numeric, 2-digit
          month: 'long', // numeric, 2-digit, long, short, narrow
          day: 'numeric', // numeric, 2-digit
          hour: 'numeric', // numeric, 2-digit
          minute: 'numeric', // numeric, 2-digit
          second: 'numeric', // numeric, 2-digit
          hour12: true // Use 12-hour time (use false for 24-hour format)
        })}
      </div>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
]
