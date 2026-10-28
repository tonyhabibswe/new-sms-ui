'use client'

import { useState } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import AddSemesterForm from './AddSemester/add-semester-form'
import DeleteSemesterButton from './delete-semester/delete-semester-button'

// The "…" menu on a semester card: edit and delete
export function SemesterActions({ semester }) {
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
            <span className="sr-only">Actions for {semester.name}</span>
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
            <DialogTitle>Edit semester</DialogTitle>
            <DialogDescription>Rename {semester.name}.</DialogDescription>
          </DialogHeader>
          <AddSemesterForm setOpenDialog={setOpenEditDialog} defaultData={semester} />
        </DialogContent>
      </Dialog>
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete semester</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete semester {semester.name}? Its
              holidays, passing grades and course sections go with it,
              including their attendance and grades.
            </DialogDescription>
          </DialogHeader>
          <DeleteSemesterButton setOpenDialog={setOpenDeleteDialog} defaultData={semester} />
        </DialogContent>
      </Dialog>
    </>
  )
}
