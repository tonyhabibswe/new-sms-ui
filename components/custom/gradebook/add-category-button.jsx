'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import AddCategoryForm from './add-category-form'

export default function AddCategoryButton({ courseSectionId, onCategoryAdd }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Grade Category</DialogTitle>
          <DialogDescription>
            Create a new grading category with weight and calculation method
          </DialogDescription>
        </DialogHeader>
        <AddCategoryForm
          courseSectionId={courseSectionId}
          onCategoryAdd={(category) => {
            onCategoryAdd(category)
            setOpen(false)
          }}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
