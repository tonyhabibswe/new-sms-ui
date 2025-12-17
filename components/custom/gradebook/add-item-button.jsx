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
import AddItemForm from './add-item-form'

export default function AddItemButton({
  selectedCategoryId,
  disabled,
  onItemAdd
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" disabled={disabled}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Grade Item</DialogTitle>
          <DialogDescription>
            Create a new graded item within this category
          </DialogDescription>
        </DialogHeader>
        <AddItemForm
          categoryId={selectedCategoryId}
          onItemAdd={(item) => {
            onItemAdd(item)
            setOpen(false)
          }}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
