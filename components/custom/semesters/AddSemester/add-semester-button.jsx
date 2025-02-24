'use client'

import DatePicker from '@/components/ui/datepicker'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import AddSemesterForm from './add-semester-form'
import { SessionProvider } from 'next-auth/react'
import { useState } from 'react'

const { Button } = require('@/components/ui/button')
const {
  TooltipTrigger,
  TooltipProvider,
  Tooltip,
  TooltipContent
} = require('@/components/ui/tooltip')
const { PlusCircledIcon } = require('@radix-ui/react-icons')

const AddSemesterButton = () => {
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <SessionProvider>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="ml-1 px-2 hover:bg-transparent">
                  <PlusCircledIcon className="w-6 h-6" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Add Semester</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Semester</DialogTitle>
            <DialogDescription>
              Create a semester here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <AddSemesterForm setOpenDialog={setOpenDialog} />
        </DialogContent>
      </Dialog>
    </SessionProvider>
  )
}

export default AddSemesterButton
