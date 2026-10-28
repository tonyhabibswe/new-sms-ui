'use client'

import Link from 'next/link'
import { BadgeCheck } from 'lucide-react'
import { DataTableColumnHeader } from '../data-table/data-table-column-header'
import { DataTableRowActions, passingGradesHref } from './data-table-row-actions'

const quickLink =
  'hidden h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-[13px] font-semibold text-foreground transition-colors hover:bg-accent lg:inline-flex'

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
    accessorKey: 'code',
    label: 'Course',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Course" />
    ),
    // The search box matches the course code or name
    filterFn: (row, id, value) =>
      [row.original.code, row.original.name]
        .join(' ')
        .toLowerCase()
        .includes(String(value).toLowerCase()),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-display text-[17px] font-bold leading-6 text-foreground">
          {row.getValue('code')}
        </span>
        <span className="font-sans text-sm font-normal leading-5 text-muted-foreground">
          {row.original.name}
        </span>
      </div>
    )
  },
  {
    id: 'actions',
    label: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-2">
        <Link href={passingGradesHref(row.original)} className={quickLink}>
          <BadgeCheck className="h-4 w-4" aria-hidden="true" />
          Passing grades
        </Link>
        <DataTableRowActions row={row} />
      </div>
    )
  }
]
