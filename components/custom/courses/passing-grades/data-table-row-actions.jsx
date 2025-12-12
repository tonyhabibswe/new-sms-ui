'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import EditPassingGradeForm from './edit-passing-grade-form'
import DeletePassingGrade from './delete-passing-grade'

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
            <DialogTitle>Edit Passing Grade</DialogTitle>
            <DialogDescription>
              Update the passing grade for this course-major-semester
              combination.
            </DialogDescription>
          </DialogHeader>
          <EditPassingGradeForm
            setOpenDialog={setOpenEditDialog}
            defaultData={row.original}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Passing Grade</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this passing grade?
            </DialogDescription>
          </DialogHeader>
          <DeletePassingGrade
            setOpenDialog={setOpenDeleteDialog}
            defaultData={row.original}
          />
        </DialogContent>
      </Dialog>
    </SessionProvider>
  )
}
