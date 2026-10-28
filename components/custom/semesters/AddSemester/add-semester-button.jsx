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
import AddSemesterForm from './add-semester-form'

const AddSemesterButton = () => {
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-[18px] w-[18px]" aria-hidden="true" />
          New semester
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New semester</DialogTitle>
          <DialogDescription>
            Course sections schedule their sessions between these dates and skip
            the holidays.
          </DialogDescription>
        </DialogHeader>
        <AddSemesterForm setOpenDialog={setOpenDialog} />
      </DialogContent>
    </Dialog>
  )
}

export default AddSemesterButton
