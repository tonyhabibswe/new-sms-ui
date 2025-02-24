'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { SessionProvider } from 'next-auth/react'
import { useState } from 'react'
import AddHolidayForm from './add-holiday-form'
import { useParams } from 'next/navigation'

const { Button } = require('@/components/ui/button')
const {
  TooltipTrigger,
  TooltipProvider,
  Tooltip,
  TooltipContent
} = require('@/components/ui/tooltip')
const { PlusCircledIcon } = require('@radix-ui/react-icons')

const AddHolidayButton = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const param = useParams()

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
            <TooltipContent>Add Holiday</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Holiday</DialogTitle>
            <DialogDescription>
              Create a holiday here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <AddHolidayForm setOpenDialog={setOpenDialog} semesterId={param.id} />
        </DialogContent>
      </Dialog>
    </SessionProvider>
  )
}

export default AddHolidayButton
