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
import { SheetFooter } from '@/components/ui/sheet'
import ComboBoxMulti from '@/components/ui/comboboxmulti'
import { useEffect, useState } from 'react'
import { Combobox } from '@/components/ui/combobox'

const FormSchema = z.object({
  courseId: z.number(),
  sectionCode: z.string(),
  courseDays: z.array(z.string()).optional(),
  startSessionTime: z.string(),
  endSessionTime: z.string(),
  room: z.string(),
  curveAlgorithm: z.string().nullable().optional()
})

const FormSchemaEdit = z.object({
  id: z.number(),
  sectionCode: z.string(),
  curveAlgorithm: z.string().nullable().optional()
})

const AddCourseForm = ({ setOpenSheet, defaultData, semesterId }) => {
  const { isLoading, fetchData } = useFetchApi()
  const {
    data: courses,
    isLoading: isCoursesLoading,
    fetchData: fetchCoursesData
  } = useFetchApi()
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(!!defaultData ? FormSchemaEdit : FormSchema),
    defaultValues: defaultData
      ? {
          id: defaultData.id || 0,
          sectionCode: defaultData.sectionCode || '',
          curveAlgorithm: defaultData.curveAlgorithm || null
        }
      : {
          courseId: 0,
          sectionCode: '',
          courseDays: [],
          startSessionTime: '',
          endSessionTime: '',
          room: '',
          curveAlgorithm: null
        }
  })

  useEffect(() => {
    async function fetchCourses() {
      try {
        await fetchCoursesData('/courses', {
          method: 'GET',
          cache: 'no-store'
        })
      } catch (exception) {
        console.error(exception.message)
      }
    }
    fetchCourses()
  }, [])

  async function createData(data) {
    try {
      await fetchData('/course-sections', {
        method: 'POST',
        body: JSON.stringify(data),
        cache: 'no-store'
      })
      setOpenSheet(false)
      router.refresh()
      toast({
        variant: 'success',
        title: 'Course created!'
      })
    } catch (exception) {
      toast({
        variant: 'destructive',
        title: 'Unable to create course'
      })
    }
  }
  async function editData(data) {
    try {
      await fetchData(`/course-section/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          sectionCode: data.sectionCode,
          curveAlgorithm: data.curveAlgorithm
        }),
        cache: 'no-store'
      })
      setOpenSheet(false)
      router.refresh()
      toast({
        variant: 'success',
        title: `Course ${defaultData.code}-${defaultData.sectionCode} edited!`
      })
    } catch (exception) {
      console.error(exception.message)
      toast({
        variant: 'destructive',
        title: `Unable to edit course ${defaultData.code}-${defaultData.sectionCode}`
      })
    }
  }

  async function onSubmit(data) {
    const dataToSubmit = {
      ...data,
      semesterId: parseInt(semesterId)
    }
    if (!!defaultData) await editData(dataToSubmit)
    else await createData(dataToSubmit)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {!!defaultData && (
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        {isCoursesLoading ? (
          <Icons.spinner className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="sectionCode"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Section</FormLabel>
                    <FormControl>
                      <Input
                        className="col-span-3"
                        placeholder="Enter course section"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {!!defaultData && (
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="curveAlgorithm"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">
                        Curve Algorithm
                      </FormLabel>
                      <FormControl>
                        <Combobox
                          items={[
                            { id: 'AVERAGE_BASED', code: 'AVERAGE_BASED' }
                          ]}
                          placeholder="Select curve algorithm..."
                          value={field.value}
                          onValueChange={field.onChange}
                          valueKey="id"
                          displayKey="code"
                          searchKey="code"
                          allowClear={true}
                          className="col-span-3"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {!defaultData && (
              <>
                <div className="grid gap-4 py-4">
                  <FormField
                    control={form.control}
                    name="courseId"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Course</FormLabel>
                        <FormControl>
                          <Combobox
                            items={courses?.data || []}
                            placeholder="Select a course..."
                            value={field.value}
                            onValueChange={field.onChange}
                            valueKey="id"
                            displayKey="code"
                            searchKey="code"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>{' '}
                <div className="grid gap-4 py-4">
                  <ComboBoxMulti
                    form={form}
                    name="courseDays"
                    formItemProps={{
                      className: 'grid grid-cols-4 items-center gap-4'
                    }}
                    formLabelProps={{ className: 'text-right' }}
                    formLabel="Course Days"
                    buttonProps={{
                      className: 'col-span-3',
                      placeholder: 'Select course days'
                    }}
                    options={[
                      { value: 'Monday', label: 'Monday' },
                      { value: 'Tuesday', label: 'Tuesday' },
                      { value: 'Wednesday', label: 'Wednesday' },
                      { value: 'Thursday', label: 'Thursday' },
                      { value: 'Friday', label: 'Friday' }
                    ]}
                  />
                </div>
                <div className="grid gap-4 py-4">
                  <FormField
                    control={form.control}
                    name="startSessionTime"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Start Time</FormLabel>
                        <FormControl>
                          <Input
                            className="col-span-3"
                            placeholder="Enter course start time"
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
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">End Time</FormLabel>
                        <FormControl>
                          <Input
                            className="col-span-3"
                            placeholder="Enter course end time"
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
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Room</FormLabel>
                        <FormControl>
                          <Input
                            className="col-span-3"
                            placeholder="Enter course room"
                            type="text"
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
                    name="curveAlgorithm"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">
                          Curve Algorithm
                        </FormLabel>
                        <FormControl>
                          <Combobox
                            items={[
                              { id: 'AVERAGE_BASED', code: 'AVERAGE_BASED' }
                            ]}
                            placeholder="Select curve algorithm..."
                            value={field.value}
                            onValueChange={field.onChange}
                            valueKey="id"
                            displayKey="code"
                            searchKey="code"
                            allowClear={true}
                            className="col-span-3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}
          </>
        )}

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

export default AddCourseForm
