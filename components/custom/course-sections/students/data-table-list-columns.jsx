'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '../../data-table/data-table-column-header'

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
    label: 'First Name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
    cell: ({ row }) => {
      return <div className="min-w-[80px]">{row.getValue('firstName')}</div>
    }
  },
  {
    accessorKey: 'fatherName',
    label: 'Father Name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Father Name" />
    ),
    cell: ({ row }) => {
      return <div className="min-w-[80px]">{row.getValue('fatherName')}</div>
    }
  },
  {
    accessorKey: 'lastName',
    label: 'Last Name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
    cell: ({ row }) => {
      return <div className="min-w-[80px]">{row.getValue('lastName')}</div>
    }
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
  {
    accessorKey: 'abscences',
    header: ({ column }) => (
      <DataTableColumnHeader
        className="justify-end text-right"
        column={column}
        title="Abscences"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-right px-3 min-w-[80px]">
          {row.getValue('abscences')}
        </div>
      )
    }
  },
  {
    accessorKey: 'sessions',
    header: ({ column }) => (
      <DataTableColumnHeader
        className="justify-end text-right"
        column={column}
        title="Sessions"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-right px-3 min-w-[100px]">
          {row.getValue('sessions')}
        </div>
      )
    }
  },
  {
    accessorKey: 'totalSessions',
    label: 'Total Sessions',
    header: ({ column }) => (
      <DataTableColumnHeader
        className="justify-end text-right"
        column={column}
        title="Total Sessions"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-right px-3 min-w-[100px]">
          {row.getValue('totalSessions')}
        </div>
      )
    }
  }
]
