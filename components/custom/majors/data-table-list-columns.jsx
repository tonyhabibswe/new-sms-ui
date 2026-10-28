'use client'

import { DataTableColumnHeader } from '../data-table/data-table-column-header'
import { EditableLabelCell } from './editable-label-cell'

export const columns = [
  {
    accessorKey: 'id',
    label: 'ID',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => <div>{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'systemName',
    label: 'System name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="System name" />
    ),
    cell: ({ row }) => (
      <div className="font-semibold">{row.getValue('systemName')}</div>
    )
  },
  {
    accessorKey: 'label',
    label: 'Label',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Label" />
    ),
    cell: ({ row }) => <EditableLabelCell row={row} />
  }
]
