'use client'

import { DataTableColumnHeader } from '../data-table/data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const columns = [
  {
    accessorKey: 'id',
    label: 'ID',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'code',
    label: 'Code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    cell: ({ row }) => <div className="w-[30]">{row.getValue('code')}</div>
  },
  {
    accessorKey: 'name',
    label: 'Name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="w-[400px]">{row.getValue('name')}</div>
  },

  {
    id: 'actions',
    label: 'Actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
]
