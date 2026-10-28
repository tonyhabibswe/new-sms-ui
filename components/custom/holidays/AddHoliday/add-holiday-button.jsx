'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
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
import AddHolidayForm from './add-holiday-form'

const AddHolidayButton = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const param = useParams()

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-[18px] w-[18px]" aria-hidden="true" />
          Add holiday
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add holiday</DialogTitle>
          <DialogDescription>No classes are held on this day.</DialogDescription>
        </DialogHeader>
        <AddHolidayForm setOpenDialog={setOpenDialog} semesterId={param.id} />
      </DialogContent>
    </Dialog>
  )
}

export default AddHolidayButton
