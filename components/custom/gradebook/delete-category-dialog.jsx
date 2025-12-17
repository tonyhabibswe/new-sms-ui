'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export default function DeleteCategoryDialog({
  category,
  open,
  onOpenChange,
  onConfirm
}) {
  const { toast } = useToast()

  const handleConfirm = () => {
    try {
      onConfirm()
      onOpenChange(false)
      toast({
        variant: 'success',
        title: 'Category deleted successfully!'
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to delete category',
        description: error.message
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the category "{category?.name}"?
            <br />
            <br />
            <span className="font-semibold text-destructive">
              Warning: This will also delete all grade items and student grades
              associated with this category.
            </span>
            <br />
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
