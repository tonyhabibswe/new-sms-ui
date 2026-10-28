'use client'

import Link from 'next/link'
import { ClipboardCheck, Sheet as SheetIcon } from 'lucide-react'
import { sectionLinks, sectionParams } from '@/lib/section-links'
import { DataTableColumnHeader } from '../data-table/data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

// "MW 09:00-10:30" -> days and a time range
const splitTime = (time = '') => {
  const [days, ...rest] = time.split(' ')
  return { days, hours: rest.join(' ').replace('-', '–') }
}

const quickLink =
  'hidden h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-[13px] font-semibold text-foreground transition-colors hover:bg-accent lg:inline-flex'

const linksFor = (row, table) =>
  sectionLinks(row.original.id, sectionParams(row.original, table.options.meta?.semester))

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
    // The search box matches the course code, section, name or room
    filterFn: (row, id, value) =>
      [row.original.code, row.original.sectionCode, row.original.name, row.original.room]
        .join(' ')
        .toLowerCase()
        .includes(String(value).toLowerCase()),
    cell: ({ row, table }) => (
      <Link href={linksFor(row, table).overview} className="flex flex-col">
        <span className="font-display text-[17px] font-bold leading-6 text-foreground">
          {row.getValue('code')} · {row.original.sectionCode}
        </span>
        <span className="font-sans text-sm font-normal leading-5 text-muted-foreground">
          {row.original.name}
        </span>
      </Link>
    )
  },
  {
    accessorKey: 'time',
    label: 'Schedule',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Schedule" />
    ),
    cell: ({ row }) => {
      const { days, hours } = splitTime(row.getValue('time'))
      return (
        <div className="flex flex-col">
          <span className="font-semibold">{days}</span>
          <span className="text-sm text-muted-foreground">{hours}</span>
        </div>
      )
    }
  },
  {
    accessorKey: 'room',
    label: 'Room',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Room" />
    ),
    cell: ({ row }) => <div>{row.getValue('room') || '–'}</div>
  },
  {
    accessorKey: 'curveAlgorithm',
    label: 'Curve algorithm',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Curve algorithm" />
    ),
    cell: ({ row }) => <div>{row.getValue('curveAlgorithm') || '—'}</div>
  },
  {
    id: 'actions',
    label: 'Actions',
    cell: ({ row, table }) => {
      const links = linksFor(row, table)
      return (
        <div className="flex items-center justify-end gap-2">
          <Link href={links.sessions} className={quickLink}>
            <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
            Sessions
          </Link>
          <Link href={links.gradebook} className={quickLink}>
            <SheetIcon className="h-4 w-4" aria-hidden="true" />
            Gradebook
          </Link>
          <DataTableRowActions row={row} links={links} />
        </div>
      )
    }
  }
]
