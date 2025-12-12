'use client'

import { DataTableColumnHeader } from '../data-table/data-table-column-header'
import { EditableLabelCell } from './editable-label-cell'

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
    accessorKey: 'systemName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="System Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[250px] font-medium">{row.getValue('systemName')}</div>
    )
  },
  {
    accessorKey: 'label',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Label" />
    ),
    cell: ({ row }) => <EditableLabelCell row={row} />
  }
]
