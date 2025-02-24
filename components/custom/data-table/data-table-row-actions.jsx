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
import Link from 'next/link'
import { useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import AddSemesterForm from '../semesters/AddSemester/add-semester-form'
import DeleteSemesterButton from '../semesters/delete-semester/delete-semester-button'

export function DataTableRowActions({ row }) {
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
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
            href={`/admin/semester/${row.original.id}/course-sections/list`}>
            <DropdownMenuItem>Courses List</DropdownMenuItem>
          </Link>
          <Link href={`/admin/semester/${row.original.id}/holidays/list`}>
            <DropdownMenuItem>Holidays</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenEditDialog(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDeleteDialog(true)}>
            <span className="text-red-500">Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Semester</DialogTitle>
            <DialogDescription>
              Edit a semester here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <AddSemesterForm
            setOpenDialog={setOpenEditDialog}
            defaultData={row.original}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Semester</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete semester {row.original.name} ?
            </DialogDescription>
          </DialogHeader>
          <DeleteSemesterButton
            setOpenDialog={setOpenDeleteDialog}
            defaultData={row.original}
          />
          {/* <AddSemesterForm
            setOpenDialog={setOpenEditDialog}
            defaultData={row.original}
          /> */}
        </DialogContent>
      </Dialog>
    </SessionProvider>
  )
}
