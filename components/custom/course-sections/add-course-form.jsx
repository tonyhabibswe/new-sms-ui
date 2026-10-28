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
import ComboBoxMulti from '@/components/ui/comboboxmulti'
import { useEffect } from 'react'
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
    resolver: zodResolver(defaultData ? FormSchemaEdit : FormSchema),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    } catch {
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
    if (defaultData) await editData(dataToSubmit)
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
            <div className="grid gap-4 py-2">
              <FormField
                control={form.control}
                name="sectionCode"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Section</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
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
              <div className="grid gap-4 py-2">
                <FormField
                  control={form.control}
                  name="curveAlgorithm"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>
                        Curve algorithm
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
                          className="w-full"
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
                <div className="grid gap-4 py-2">
                  <FormField
                    control={form.control}
                    name="courseId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Course</FormLabel>
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
                <div className="grid gap-4 py-2">
                  <ComboBoxMulti
                    form={form}
                    name="courseDays"
                    formItemProps={{
                      className: 'flex flex-col gap-2'
                    }}
                    formLabelProps={{}}
                    formLabel="Course Days"
                    buttonProps={{
                      className: '',
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
                <div className="grid gap-4 py-2">
                  <FormField
                    control={form.control}
                    name="startSessionTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Start time</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full"
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
                <div className="grid gap-4 py-2">
                  <FormField
                    control={form.control}
                    name="endSessionTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>End time</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full"
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
                <div className="grid gap-4 py-2">
                  <FormField
                    control={form.control}
                    name="room"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Room</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full"
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
                <div className="grid gap-4 py-2">
                  <FormField
                    control={form.control}
                    name="curveAlgorithm"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>
                          Curve algorithm
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
                            className="w-full"
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
