'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
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
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="text-muted-foreground hover:text-foreground data-[state=open]:bg-accent">
            <DotsHorizontalIcon className="h-[18px] w-[18px]" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem onClick={() => setOpenEditDialog(true)}>
            <Pencil aria-hidden="true" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDeleteDialog(true)}>
            <Trash2 className="text-destructive" aria-hidden="true" />
            <span className="font-semibold text-destructive">Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit passing grade</DialogTitle>
            <DialogDescription>
              Change its major, semester or grade.
            </DialogDescription>
          </DialogHeader>
          <EditPassingGradeForm
            setOpenDialog={setOpenEditDialog}
            defaultData={row.original}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete passing grade</DialogTitle>
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
    </>
  )
}
