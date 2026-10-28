'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import AddPassingGradeForm from './add-passing-grade-form'

const AddPassingGradeButton = ({ courseId }) => {
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-[18px] w-[18px]" aria-hidden="true" />
          Add passing grade
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add passing grade</DialogTitle>
          <DialogDescription>
            Set the grade a major needs to pass this course in a semester.
          </DialogDescription>
        </DialogHeader>
        <AddPassingGradeForm
          setOpenDialog={setOpenDialog}
          courseId={courseId}
        />
      </DialogContent>
    </Dialog>
  )
}

export default AddPassingGradeButton
