'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { DialogFooter } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'

const FormSchema = z.object({
  title: z.string().min(1, 'Item title is required').max(150),
  maxPoints: z
    .string()
    .min(1, 'Max points is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Max points must be a positive number'
    })
})

export default function AddItemForm({ categoryId, onItemAdd, onCancel }) {
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      maxPoints: ''
    }
  })

  async function onSubmit(data) {
    try {
      const newItem = {
        categoryId,
        title: data.title,
        maxPoints: parseFloat(data.maxPoints)
      }

      await onItemAdd(newItem)
      form.reset()
      onCancel()
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Title</FormLabel>
                <FormControl>
                  <Input
                    className="col-span-3"
                    placeholder="e.g., Homework 1, Midterm"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-span-3 col-start-2" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxPoints"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Max Points</FormLabel>
                <FormControl>
                  <Input
                    className="col-span-3"
                    type="number"
                    placeholder="100"
                    min="0"
                    step="0.1"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-span-3 col-start-2" />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Adding...' : 'Add Item'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
