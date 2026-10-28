'use client'

import Link from 'next/link'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { BadgeCheck, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import AddCourseForm from './AddCourse/add-course-form'
import DeleteCourseButton from './delete-course/delete-course-button'
import { toQuery } from '@/lib/section-links'

// The passing grades page shows the course's code and name from the query
export const passingGradesHref = (course) =>
  `/admin/courses/${course.id}/passing-grades${toQuery({ code: course.code, name: course.name })}`

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
          <DropdownMenuItem asChild>
            <Link href={passingGradesHref(row.original)}>
              <BadgeCheck aria-hidden="true" />
              Passing grades
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenEditDialog(true)}>
            <Pencil aria-hidden="true" />
            Edit course
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDeleteDialog(true)}>
            <Trash2 className="text-destructive" aria-hidden="true" />
            <span className="font-semibold text-destructive">Delete course</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit course</DialogTitle>
            <DialogDescription>
              Change {row.original.code}&apos;s code or name.
            </DialogDescription>
          </DialogHeader>
          <AddCourseForm
            setOpenDialog={setOpenEditDialog}
            defaultData={row.original}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {row.original.code}?
            </DialogDescription>
          </DialogHeader>
          <DeleteCourseButton
            setOpenDialog={setOpenDeleteDialog}
            defaultData={row.original}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
