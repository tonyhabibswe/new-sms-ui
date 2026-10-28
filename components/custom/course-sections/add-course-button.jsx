'use client'

import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import AddCourseForm from './add-course-form'
import { useParams } from 'next/navigation'

const {
  TooltipTrigger,
  TooltipProvider,
  Tooltip,
  TooltipContent
} = require('@/components/ui/tooltip')
const { PlusCircledIcon } = require('@radix-ui/react-icons')

const AddCourseButton = () => {
  const [openSheet, setOpenSheet] = useState(false)
  const param = useParams()

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger className="ml-1 px-2 hover:bg-transparent">
              <PlusCircledIcon className="w-6 h-6" />
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>Add Course</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <SheetContent className="md:max-w-md lg:max-w-lg">
        <SheetHeader>
          <SheetTitle>Add Course</SheetTitle>
          <SheetDescription>
            Create a course here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <AddCourseForm setOpenSheet={setOpenSheet} semesterId={param.id} />
      </SheetContent>
    </Sheet>
  )
}

export default AddCourseButton
