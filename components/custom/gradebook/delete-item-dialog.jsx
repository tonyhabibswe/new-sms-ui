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

export default function DeleteItemDialog({
  item,
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
        title: 'Grade item deleted successfully!'
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to delete item',
        description: error.message
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Grade Item</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{item?.title}"?
            <br />
            <br />
            This will also remove all student grades for this item. This action
            cannot be undone.
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
