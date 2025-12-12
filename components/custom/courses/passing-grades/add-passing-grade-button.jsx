'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import AddPassingGradeForm from './add-passing-grade-form'
import { SessionProvider } from 'next-auth/react'

const AddPassingGradeButton = ({ courseId }) => {
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <SessionProvider>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="ml-auto h-8">
            <PlusCircledIcon className="mr-2 h-4 w-4" />
            Add Passing Grade
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Passing Grade</DialogTitle>
            <DialogDescription>
              Set a passing grade for this course with a specific major and
              semester.
            </DialogDescription>
          </DialogHeader>
          <AddPassingGradeForm
            setOpenDialog={setOpenDialog}
            courseId={courseId}
          />
        </DialogContent>
      </Dialog>
    </SessionProvider>
  )
}

export default AddPassingGradeButton
