'use client'

import { Checkbox } from '@/components/ui/checkbox'
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
    cell: ({ row }) => <div className="min-w-[80px]">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),

    cell: ({ row }) => (
      <div className="min-w-[80px]">
        {row.getValue('code')} - {row.original.sectionCode}
      </div>
    )
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[80px]">{row.getValue('name')}</div>
    )
  },
  {
    accessorKey: 'time',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[80px]">{row.getValue('time')}</div>
    )
  },
  {
    accessorKey: 'room',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Room" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[80px]">{row.getValue('room')}</div>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex justify-end mr-8">
        <DataTableRowActions row={row} />
      </div>
    )
  }
]
