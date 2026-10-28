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
import AddSessionForm from './add-session-form'

const AddSessionButton = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const param = useParams()

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-[18px] w-[18px]" aria-hidden="true" />
          Add session
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add session</DialogTitle>
          <DialogDescription>
            An extra class outside the weekly schedule.
          </DialogDescription>
        </DialogHeader>
        <AddSessionForm
          setOpenDialog={setOpenDialog}
          courseSectionId={param.id}
        />
      </DialogContent>
    </Dialog>
  )
}

export default AddSessionButton
