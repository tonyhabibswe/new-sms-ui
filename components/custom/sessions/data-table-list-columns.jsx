'use client'

import Link from 'next/link'
import { format, isToday } from 'date-fns'
import { ClipboardCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { attendanceLink, toDateTime } from '@/lib/section-links'
import { DataTableColumnHeader } from '../data-table/data-table-column-header'

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
    accessorKey: 'sessionStart',
    label: 'Date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const start = toDateTime(row.getValue('sessionStart'))
      return (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-display text-[17px] font-bold leading-6">
            {format(start, 'EEE, MMM d, yyyy')}
          </span>
          {isToday(start) && <Badge>Today</Badge>}
        </div>
      )
    }
  },
  {
    id: 'time',
    label: 'Time',
    header: 'Time',
    cell: ({ row }) =>
      `${format(toDateTime(row.original.sessionStart), 'HH:mm')}–${format(
        toDateTime(row.original.sessionEnd),
        'HH:mm'
      )}`
  },
  {
    accessorKey: 'room',
    label: 'Room',
    header: 'Room',
    cell: ({ row }) => row.getValue('room') || '–'
  },
  {
    id: 'actions',
    label: 'Actions',
    cell: ({ row, table }) => {
      const { sectionId, sectionParams } = table.options.meta || {}
      return (
        <div className="flex justify-end">
          <Link
            href={attendanceLink(row.original.id, sectionId, sectionParams, row.original)}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground shadow-[0_1px_4px_#2d2e320a] transition-colors hover:bg-accent">
            <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
            Attendance
          </Link>
        </div>
      )
    }
  }
]
