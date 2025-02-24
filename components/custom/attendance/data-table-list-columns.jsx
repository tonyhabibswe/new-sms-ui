'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '../data-table/data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import UpdateAttendanceInput from './update-attendance-input'
import { SessionProvider } from 'next-auth/react'

export const columns = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
    visible: false
  },
  {
    accessorKey: 'studentId',
    label: 'Student ID',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue('studentId')}</div>
    )
  },
  {
    accessorKey: 'firstName',
    label: 'First Name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue('firstName')}</div>
    )
  },
  {
    accessorKey: 'fatherName',
    label: 'Father Name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Father Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue('fatherName')}</div>
    )
  },
  {
    accessorKey: 'lastName',
    label: 'Last Name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue('lastName')}</div>
    )
  },
  {
    accessorKey: 'major',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Major" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('major')}</div>
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('email')}</div>
  },
  {
    accessorKey: 'campus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Campus" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('campus')}</div>
  },
  {
    accessorKey: 'attendance',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Attendance" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">
        {['dismissed', 'exam', 'holiday'].includes(
          row.getValue('attendance')
        ) ? (
          <span className="text-red-500">
            {row.getValue('attendance').charAt(0).toUpperCase() +
              row.getValue('attendance').slice(1)}
          </span>
        ) : (
          <SessionProvider>
            <UpdateAttendanceInput
              value={row.getValue('attendance')}
              attendanceId={row.getValue('id')}
            />
          </SessionProvider>
        )}
      </div>
    )
  }
]
