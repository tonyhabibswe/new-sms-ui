'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { SessionProvider } from 'next-auth/react'

import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useState } from 'react'
import EditSessionForm from './edit-session/edit-session-form'

export function DataTableRowActions({ row, table }) {
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const meta = table?.options?.meta || {}
  const { courseCode = '', sectionCode = '', courseTime = '' } = meta

  // Format session date
  const sessionDate = row.original.sessionStart
    ? new Date(row.original.sessionStart).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      })
    : ''

  return (
    <SessionProvider>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <Link
            href={`/admin/session/${
              row.original.id
            }/attendances/list?code=${encodeURIComponent(
              courseCode
            )}&section=${encodeURIComponent(
              sectionCode
            )}&time=${encodeURIComponent(courseTime)}&date=${encodeURIComponent(
              sessionDate
            )}`}>
            <DropdownMenuItem>Attendance</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem
            onClick={() => {
              setOpenEditDialog(true)
            }}>
            Edit Session
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Session Action</DialogTitle>
          </DialogHeader>
          <EditSessionForm
            setOpenDialog={setOpenEditDialog}
            defaultData={row.original}
          />
        </DialogContent>
      </Dialog>
    </SessionProvider>
  )
}
