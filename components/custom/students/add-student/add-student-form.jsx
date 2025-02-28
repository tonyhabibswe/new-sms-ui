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
import useFetchApi from '@/hooks/useFetchApi'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
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
      setOpenSheet(false)
      router.refresh()
      toast({
        variant: 'success',
        title: 'Student created!'
      })
    } catch (exception) {
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
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Student Id</FormLabel>
                <FormControl>
                  <Input
                    className="col-span-3"
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
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">First Name</FormLabel>
                <FormControl>
                  <Input
                    className="col-span-3"
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
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Father Name</FormLabel>
                <FormControl>
                  <Input
                    className="col-span-3"
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
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Last Name</FormLabel>
                <FormControl>
                  <Input
                    className="col-span-3"
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
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Major</FormLabel>
                <FormControl>
                  <Input
                    className="col-span-3"
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
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Email</FormLabel>
                <FormControl>
                  <Input
                    className="col-span-3"
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
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Campus</FormLabel>
                <FormControl>
                  <Input
                    className="col-span-3"
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

export default AddStudentForm
