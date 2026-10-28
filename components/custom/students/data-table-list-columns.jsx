'use client'

import Link from 'next/link'
import { DataTableColumnHeader } from '../data-table/data-table-column-header'

// Counts read as a column of figures in the table, as plain values on a phone card
const countColumn = (key, title) => ({
  accessorKey: key,
  label: title,
  header: ({ column }) => (
    <DataTableColumnHeader
      className="justify-end text-right"
      column={column}
      title={title}
    />
  ),
  cell: ({ row }) => (
    <div className="tabular-nums md:text-right">{row.getValue(key)}</div>
  )
})

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
    id: 'name',
    accessorFn: (row) => `${row.lastName} ${row.firstName}`,
    label: 'Student',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student" />
    ),
    // The search box matches the name, student ID or email
    filterFn: (row, id, value) =>
      [
        row.original.firstName,
        row.original.fatherName,
        row.original.lastName,
        row.original.studentId,
        row.original.email
      ]
        .join(' ')
        .toLowerCase()
        .includes(String(value).toLowerCase()),
    cell: ({ row }) => (
      <Link href={`/admin/students/${row.original.id}`} className="flex flex-col">
        <span className="font-display text-[17px] font-bold leading-6 text-foreground hover:text-primary">
          {row.original.firstName} {row.original.lastName}
        </span>
        <span className="font-sans text-sm font-normal leading-5 text-muted-foreground">
          {row.original.studentId}
        </span>
      </Link>
    ),
    enableHiding: false
  },
  {
    accessorKey: 'major',
    label: 'Major',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Major" />
    ),
    // Set by the major filter; an exact match
    filterFn: (row, id, value) => row.getValue(id) === value,
    cell: ({ row }) => <div>{row.getValue('major') || '–'}</div>
  },
  countColumn('coursesCount', 'Courses'),
  countColumn('semestersCount', 'Semesters'),
  {
    // Sorts by date; shows the semester's name
    accessorKey: 'lastSemesterStartDate',
    label: 'Last semester',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last semester" />
    ),
    cell: ({ row }) => <div>{row.original.lastSemesterName || '–'}</div>
  },
  {
    accessorKey: 'email',
    label: 'Email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div className="break-all">{row.getValue('email')}</div>
  },
  {
    accessorKey: 'campus',
    label: 'Campus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Campus" />
    ),
    cell: ({ row }) => <div>{row.getValue('campus')}</div>
  }
]
