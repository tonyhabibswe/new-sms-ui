'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import {
  ClipboardCheck,
  Pencil,
  Sheet as SheetIcon,
  Trash2,
  Upload,
  UserPlus
} from 'lucide-react'

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

export function DataTableRowActions({ row, links }) {
  const [openEditSheet, setOpenEditSheet] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openImportStudentDialog, setOpenImportStudentDialog] = useState(false)
  const [openStudentFormSheet, setOpenStudentFormSheet] = useState(false)
  const title = `${row.original.code} · ${row.original.sectionCode}`

  const param = useParams()
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
        <DropdownMenuContent align="end" className="w-[232px]">
          <Link href={links.sessions}>
            <DropdownMenuItem>
              <ClipboardCheck aria-hidden="true" />
              Sessions
            </DropdownMenuItem>
          </Link>
          <Link href={links.gradebook}>
            <DropdownMenuItem>
              <SheetIcon aria-hidden="true" />
              Gradebook
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenStudentFormSheet(true)}>
            <UserPlus aria-hidden="true" />
            Add a student
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenImportStudentDialog(true)}>
            <Upload aria-hidden="true" />
            Import students (CSV)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenEditSheet(true)}>
            <Pencil aria-hidden="true" />
            Edit section
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenDeleteDialog(true)}>
            <Trash2 className="text-destructive" aria-hidden="true" />
            <span className="font-semibold text-destructive">Delete section</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog
        open={openImportStudentDialog}
        onOpenChange={setOpenImportStudentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import students</DialogTitle>
            <DialogDescription>
              Choose the OGS CSV file to add its students to {title}.
            </DialogDescription>
          </DialogHeader>
          <ImportStudentsDialog
            setOpenDialog={setOpenImportStudentDialog}
            defaultData={row.original}
          />
        </DialogContent>
      </Dialog>
      <Sheet open={openStudentFormSheet} onOpenChange={setOpenStudentFormSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add a student</SheetTitle>
            <SheetDescription>Enrol a student in {title}.</SheetDescription>
          </SheetHeader>
          <AddStudentForm
            setOpenSheet={setOpenStudentFormSheet}
            courseSectionId={row.original.id}
          />
        </SheetContent>
      </Sheet>
      <Sheet open={openEditSheet} onOpenChange={setOpenEditSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit course section</SheetTitle>
            <SheetDescription>Change {title}&apos;s section code or curve.</SheetDescription>
          </SheetHeader>
          <AddCourseForm
            setOpenSheet={setOpenEditSheet}
            semesterId={param.id}
            defaultData={row.original}
          />
        </SheetContent>
      </Sheet>
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete course section</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {title}?
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
