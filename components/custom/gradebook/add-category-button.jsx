'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4" />
          Add category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add grade category</DialogTitle>
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
