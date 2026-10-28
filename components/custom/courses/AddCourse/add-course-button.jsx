'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import AddCourseForm from './add-course-form'

const AddCourseButton = () => {
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-[18px] w-[18px]" aria-hidden="true" />
          New course
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New course</DialogTitle>
          <DialogDescription>
            Semesters can then open sections of it.
          </DialogDescription>
        </DialogHeader>
        <AddCourseForm setOpenDialog={setOpenDialog} />
      </DialogContent>
    </Dialog>
  )
}

export default AddCourseButton
