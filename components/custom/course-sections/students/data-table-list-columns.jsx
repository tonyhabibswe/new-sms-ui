'use client'

import { DataTableColumnHeader } from '../../data-table/data-table-column-header'
import { StatusSelectCell } from './status-select-cell'

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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => {
      return <div className="min-w-[80px]">{row.getValue('id')}</div>
    },
    enableSorting: false,
    enableHiding: false,
    show: false
  },
  {
    // The search box matches this, so first or last name both find a student
    id: 'name',
    accessorFn: (row) => `${row.firstName ?? ''} ${row.lastName ?? ''}`.trim(),
    label: 'Student',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold">{row.getValue('name')}</span>
        <span className="font-sans text-sm font-normal text-muted-foreground">
          {row.original.studentId}
        </span>
      </div>
    ),
    enableHiding: false
  },
  {
    accessorKey: 'studentId',
    label: 'Student ID',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student ID" />
    ),
    cell: ({ row }) => {
      return <div className="min-w-[80px]">{row.getValue('studentId')}</div>
    }
  },
  {
    accessorKey: 'firstName',
    label: 'First name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First name" />
    ),
    cell: ({ row }) => {
      return <div className="min-w-[80px]">{row.getValue('firstName')}</div>
    }
  },
  {
    accessorKey: 'fatherName',
    label: "Father's name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Father's name" />
    ),
    cell: ({ row }) => {
      return <div className="min-w-[80px]">{row.getValue('fatherName')}</div>
    }
  },
  {
    accessorKey: 'lastName',
    label: 'Last name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last name" />
    ),
    cell: ({ row }) => {
      return <div className="min-w-[80px]">{row.getValue('lastName')}</div>
    }
  },
  {
    accessorKey: 'statusId',
    label: 'Status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row, table }) => {
      const statuses = table.options.meta?.statuses || []
      const onStatusChange = table.options.meta?.onStatusChange

      return (
        <StatusSelectCell
          enrollmentId={row.original.id}
          currentStatusId={row.getValue('statusId')}
          statuses={statuses}
          onStatusChange={onStatusChange}
        />
      )
    },
    enableSorting: true,
    enableHiding: true
  },
  {
    accessorKey: 'major',
    label: 'Major',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Major" />
    ),
    cell: ({ row }) => {
      return <div className="min-w-[80px]">{row.getValue('major')}</div>
    }
  },
  {
    accessorKey: 'email',
    label: 'Email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return <div className="min-w-[80px]">{row.getValue('email')}</div>
    }
  },
  {
    accessorKey: 'campus',
    label: 'Campus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Campus" />
    ),
    cell: ({ row }) => {
      return <div className="min-w-[80px]">{row.getValue('campus')}</div>
    }
  },
  countColumn('abscences', 'Absences'),
  // Sessions this student's attendance has been taken for, of all of them
  countColumn('sessions', 'Sessions marked'),
  countColumn('totalSessions', 'Total sessions')
]
