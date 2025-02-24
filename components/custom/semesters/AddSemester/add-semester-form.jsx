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
import { DialogClose, DialogFooter } from '@/components/ui/dialog'
import SemesterDatePicker from './semester-datepicker'
import useFetchApi from '@/hooks/useFetchApi'
import { useRouter } from 'next/navigation'
import { Icons } from '@/components/ui/icons'
import { useToast } from '@/components/ui/use-toast'
import MultiSelectDatePicker from '@/components/ui/multi-select-datepicker'
import { useState } from 'react'

const FormSchema = z.object({
  name: z.string(),
  startDate: z.date({
    required_error: 'Start date is required'
  }),
  endDate: z.date({
    required_error: 'End date is required'
  }),
  holidays: z.array(z.date())
})

const AddSemesterForm = ({ setOpenDialog, defaultData }) => {
  const { isLoading, fetchData } = useFetchApi()
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultData
      ? {
          name: defaultData.name || '',
          startDate: new Date(defaultData.startDate),
          endDate: new Date(defaultData.endDate),
          holidays: defaultData.holidays || []
        }
      : {}
  })

  async function createData(data) {
    const startDate = format(data.startDate, 'yyyy-MM-dd')
    const endDate = format(data.endDate, 'yyyy-MM-dd')
    const holidays = data.holidays.map((date) => format(date, 'yyyy-MM-dd'))
    try {
      await fetchData('/semesters', {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          startDate: startDate,
          endDate: endDate,
          holidays: holidays
        }),
        cache: 'no-store'
      })
      setOpenDialog(false)
      router.refresh()
      toast({
        variant: 'success',
        title: 'Semester created!'
      })
    } catch (exception) {
      toast({
        variant: 'destructive',
        title: 'Unable to create semester'
      })
    }
  }
  async function editData(data) {
    try {
      await fetchData(`/semester/${defaultData.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: data.name
        }),
        cache: 'no-store'
      })
      setOpenDialog(false)
      router.refresh()
      toast({
        variant: 'success',
        title: `Semester ${defaultData.name} edited!`
      })
    } catch (exception) {
      console.error(exception.message)
      toast({
        variant: 'destructive',
        title: `Unable to edit semester ${defaultData.name}`
      })
    }
  }

  async function onSubmit(data) {
    if (!!defaultData) await editData(data)
    else await createData(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    placeholder="Enter semester name"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!!defaultData ? (
            <></>
          ) : (
            <>
              <SemesterDatePicker
                form={form}
                label="Start Date"
                name="startDate"
                placeholder="Pick a start date"
              />
              <SemesterDatePicker
                form={form}
                label="End Date"
                name="endDate"
                placeholder="Pick an end date"
              />
              <FormField
                control={form.control}
                name="holidays"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Holidays</FormLabel>
                    <FormControl>
                      <MultiSelectDatePicker
                        placeholder="Select dates..."
                        dates={field.value}
                        setDates={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
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

export default AddSemesterForm
