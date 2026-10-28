'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from '@/lib/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const FormSchema = z.object({
  title: z.string().min(1, 'Item title is required').max(150),
  maxPoints: z
    .string()
    .min(1, 'Max points is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Max points must be a positive number'
    })
})

export default function EditItemForm({ item, open, onOpenChange, onItemEdit }) {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: item?.title || '',
      maxPoints: item?.maxPoints?.toString() || ''
    }
  })

  async function onSubmit(data) {
    try {
      await onItemEdit(item.id, {
        title: data.title,
        maxPoints: parseFloat(data.maxPoints)
      })

      onOpenChange(false)
    } catch (error) {
      // Handle validation errors from backend (422)
      if (error.status === 422 && error.errors) {
        Object.keys(error.errors).forEach((fieldName) => {
          form.setError(fieldName, {
            type: 'manual',
            message: error.errors[fieldName][0]
          })
        })
      }
      // Error toast is already shown by parent handler
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit grade item</DialogTitle>
          <DialogDescription>Update item details</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input className="w-full" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxPoints"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Max points</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        type="number"
                        min="0"
                        step="0.1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
