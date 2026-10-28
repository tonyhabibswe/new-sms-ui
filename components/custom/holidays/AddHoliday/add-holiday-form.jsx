'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
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
import useFetchApi from '@/hooks/useFetchApi'
import { useRouter } from 'next/navigation'
import { Icons } from '@/components/ui/icons'
import { useToast } from '@/components/ui/use-toast'
import DatePicker from '@/components/ui/datepicker'
import { DialogFooter } from '@/components/ui/dialog'

const FormSchema = z.object({
  name: z.string(),
  date: z.date({
    error: (issue) =>
      issue.input === undefined ? 'Date is required' : undefined
  })
})

const AddHolidayForm = ({ setOpenDialog, semesterId }) => {
  const { isLoading, fetchData } = useFetchApi()
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {}
  })

  async function createData(data) {
    const date = format(data.date, 'yyyy-MM-dd')
    try {
      await fetchData(`/semester/${semesterId}/holidays`, {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          date: date
        }),
        cache: 'no-store'
      })
      setOpenDialog(false)
      router.refresh()
      toast({
        variant: 'success',
        title: 'Holiday created!'
      })
    } catch {
      toast({
        variant: 'destructive',
        title: 'Unable to create holiday'
      })
    }
  }

  async function onSubmit(data) {
    await createData(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <DatePicker
                    className="w-full"
                    date={field.value}
                    setDate={field.onChange}
                    placeholder="Pick a date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
                    placeholder="Enter holiday name"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button disabled={isLoading} type="submit">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save changes
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

export default AddHolidayForm
