'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import AddSemesterForm from './AddSemester/add-semester-form'

export function EditSemesterButton({ semester }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Edit semester
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit semester</DialogTitle>
          <DialogDescription>Rename {semester.name}.</DialogDescription>
        </DialogHeader>
        <AddSemesterForm setOpenDialog={setOpen} defaultData={semester} />
      </DialogContent>
    </Dialog>
  )
}
