'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
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
import useFetchApi from '@/hooks/useFetchApi'
import { useRouter } from 'next/navigation'
import { Icons } from '@/components/ui/icons'
import { useToast } from '@/components/ui/use-toast'
import DatePicker from '@/components/ui/datepicker'
import { DialogFooter } from '@/components/ui/dialog'

const FormSchema = z.object({
  name: z.string(),
  date: z.date({
    required_error: 'Date is required'
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
    } catch (exception) {
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
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Select Date</FormLabel>
                <FormControl>
                  <DatePicker
                    className="col-span-3"
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
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Name</FormLabel>
                <FormControl>
                  <Input
                    className="col-span-3"
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
