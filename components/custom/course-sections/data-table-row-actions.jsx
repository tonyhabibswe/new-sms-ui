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
import { useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useParams } from 'next/navigation'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import AddCourseForm from './add-course-form'
import DeleteCourseButton from './delete-course/delete-course-button'
import ImportStudentsDialog from '../students/import-students-dialog'
import Link from 'next/link'
import AddStudentForm from '../students/add-student/add-student-form'

export function DataTableRowActions({ row }) {
  const [openEditSheet, setOpenEditSheet] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openImportStudentDialog, setOpenImportStudentDialog] = useState(false)
  const [openStudentFormSheet, setOpenStudentFormSheet] = useState(false)

  const param = useParams()
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
          <DropdownMenuItem onClick={() => setOpenImportStudentDialog(true)}>
            Import Students
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenStudentFormSheet(true)}>
            Add Students
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Link href={`/admin/course-section/${row.original.id}/sessions/list`}>
            <DropdownMenuItem>Sessions List</DropdownMenuItem>
          </Link>
          <Link href={`/admin/course-section/${row.original.id}/students/list`}>
            <DropdownMenuItem>Students List</DropdownMenuItem>
          </Link>
          <Link
            href={`/admin/course-section/${
              row.original.id
            }/gradebook?code=${encodeURIComponent(
              row.original.code
            )}&section=${encodeURIComponent(
              row.original.sectionCode
            )}&name=${encodeURIComponent(row.original.name)}`}>
            <DropdownMenuItem>Gradebook</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenEditSheet(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDeleteDialog(true)}>
            <span className="text-red-500">Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog
        open={openImportStudentDialog}
        onOpenChange={setOpenImportStudentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Import Students</DialogTitle>
            <DialogDescription>
              Drop the OGS CSV file to import the students into the course.
            </DialogDescription>
          </DialogHeader>
          <ImportStudentsDialog
            setOpenDialog={setOpenImportStudentDialog}
            defaultData={row.original}
          />
        </DialogContent>
      </Dialog>
      <Sheet open={openStudentFormSheet} onOpenChange={setOpenStudentFormSheet}>
        <SheetContent className="md:max-w-md lg:max-w-lg">
          <SheetHeader>
            <SheetTitle>Add Student</SheetTitle>
            <SheetDescription>
              Add a student here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <AddStudentForm
            setOpenSheet={setOpenStudentFormSheet}
            courseSectionId={row.original.id}
          />
        </SheetContent>
      </Sheet>
      <Sheet open={openEditSheet} onOpenChange={setOpenEditSheet}>
        <SheetContent className="md:max-w-md lg:max-w-lg">
          <SheetHeader>
            <SheetTitle>Edit Course</SheetTitle>
            <SheetDescription>
              Edit a course here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <AddCourseForm
            setOpenSheet={setOpenEditSheet}
            semesterId={param.id}
            defaultData={row.original}
          />
        </SheetContent>
      </Sheet>
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete course {row.original.code} ?
            </DialogDescription>
          </DialogHeader>
          <DeleteCourseButton
            setOpenDialog={setOpenDeleteDialog}
            defaultData={row.original}
          />
        </DialogContent>
      </Dialog>
    </SessionProvider>
  )
}
