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
import useFetchApi from '@/hooks/useFetchApi'
import { useRouter } from 'next/navigation'
import { Icons } from '@/components/ui/icons'
import { useToast } from '@/components/ui/use-toast'
import { SheetFooter } from '@/components/ui/sheet'
import DatePicker from '@/components/ui/datepicker'

const FormSchema = z.object({
  sessionDate: z.date({
    error: (issue) =>
      issue.input === undefined ? 'Date is required' : undefined
  }),
  startSessionTime: z.string(),
  endSessionTime: z.string(),
  // Same rule as the API
  room: z
    .string()
    .trim()
    .min(1, 'Room is required')
    .max(100, 'Room must be 100 characters or fewer')
})

const AddSessionForm = ({ setOpenDialog, courseSectionId }) => {
  const { isLoading, fetchData } = useFetchApi()

  const router = useRouter()
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {}
  })

  async function createData(data) {
    try {
      await fetchData(`/course-section/${courseSectionId}/session`, {
        method: 'POST',
        body: JSON.stringify(data),
        cache: 'no-store'
      })
      setOpenDialog(false)
      router.refresh()
      toast({
        variant: 'success',
        title: 'Session created!'
      })
    } catch {
      toast({
        variant: 'destructive',
        title: 'Unable to create session'
      })
    }
  }

  async function onSubmit(data) {
    const year = data.sessionDate.getFullYear()
    const month = data.sessionDate.getMonth() // 0-indexed
    const day = data.sessionDate.getDate()

    const [startHour, startMinute] = data.startSessionTime
      .split(':')
      .map(Number)
    const [endHour, endMinute] = data.endSessionTime.split(':').map(Number)

    const startDateTimeUTC = new Date(
      Date.UTC(year, month, day, startHour, startMinute, 0)
    )
    const endDateTimeUTC = new Date(
      Date.UTC(year, month, day, endHour, endMinute, 0)
    )

    await createData({
      sessionStart: startDateTimeUTC,
      sessionEnd: endDateTimeUTC,
      room: data.room
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="sessionDate"
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
            name="startSessionTime"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Start time</FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder="Enter session start time"
                    type="time"
                    {...field}
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
            name="endSessionTime"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>End time</FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder="Enter session end time"
                    type="time"
                    {...field}
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
            name="room"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Room</FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder="Enter session room"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <SheetFooter>
          <Button type="submit">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save changes
          </Button>
        </SheetFooter>
      </form>
    </Form>
  )
}

export default AddSessionForm
