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
import useRefresh from '@/hooks/useRefresh'
import { Icons } from '@/components/ui/icons'
import { useToast } from '@/components/ui/use-toast'
import { SheetFooter } from '@/components/ui/sheet'

const FormSchema = z.object({
  studentId: z.string(),
  firstName: z.string(),
  fatherName: z.string(),
  lastName: z.string(),
  major: z.string(),
  email: z.string(),
  campus: z.string()
})

const AddStudentForm = ({ setOpenSheet, courseSectionId }) => {
  const { isLoading, fetchData } = useFetchApi()
  const { refresh, isRefreshing } = useRefresh()
  const busy = isLoading || isRefreshing
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {}
  })

  async function createData(data) {
    try {
      await fetchData(`/course-section/${courseSectionId}/student`, {
        method: 'POST',
        body: JSON.stringify(data),
        cache: 'no-store'
      })
      await refresh()
      setOpenSheet(false)
      toast({
        variant: 'success',
        title: 'Student created!'
      })
    } catch {
      toast({
        variant: 'destructive',
        title: 'Unable to create student'
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
            name="studentId"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Student ID</FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder="Enter student id"
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
            name="firstName"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder="Enter first name"
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
            name="fatherName"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Father&apos;s name</FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder="Enter father name"
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
            name="lastName"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder="Enter last name"
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
            name="major"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Major</FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder="Enter major"
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
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder="Enter email"
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
            name="campus"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Campus</FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder="Enter campus"
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
          <Button disabled={busy} type="submit">
            {busy && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save changes
          </Button>
        </SheetFooter>
      </form>
    </Form>
  )
}

export default AddStudentForm
