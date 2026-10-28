'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Plus } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import AddCourseForm from './add-course-form'

const AddCourseButton = () => {
  const [openSheet, setOpenSheet] = useState(false)
  const param = useParams()

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="h-[18px] w-[18px]" aria-hidden="true" />
          Add course section
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add course section</SheetTitle>
          <SheetDescription>
            Its sessions are scheduled on the chosen days for the whole
            semester.
          </SheetDescription>
        </SheetHeader>
        <AddCourseForm setOpenSheet={setOpenSheet} semesterId={param.id} />
      </SheetContent>
    </Sheet>
  )
}

export default AddCourseButton
