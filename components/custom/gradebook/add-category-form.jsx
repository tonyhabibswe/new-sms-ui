'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from '@/lib/zod'
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

const FormSchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  weight: z
    .string()
    .min(1, 'Weight is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: 'Weight must be a positive number'
    })
    .refine((val) => parseFloat(val) <= 100, {
      message: 'Weight cannot exceed 100%'
    })
})

export default function AddCategoryForm({ onCategoryAdd, onCancel }) {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      weight: ''
    }
  })

  async function onSubmit(data) {
    try {
      const newCategory = {
        name: data.name,
        weight: parseFloat(data.weight)
      }

      await onCategoryAdd(newCategory)
      form.reset()
      onCancel()
    } catch (error) {
      // Handle validation errors from backend (422)
      if (error.status === 422 && error.errors) {
        // Map backend field names to form field names
        Object.keys(error.errors).forEach((fieldName) => {
          const formFieldName =
            fieldName === 'weightPercent' ? 'weight' : fieldName
          form.setError(formFieldName, {
            type: 'manual',
            message: error.errors[fieldName][0] // First error message
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
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder="e.g., Assignments, Exams"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Weight (%)</FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    type="number"
                    placeholder="0-100"
                    min="0"
                    max="100"
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
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Adding...' : 'Add Category'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
