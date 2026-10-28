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
import { DialogFooter } from '@/components/ui/dialog'

const FormSchema = z.object({
  code: z.string(),
  name: z.string()
})

const AddCourseForm = ({ setOpenDialog, defaultData }) => {
  const { isLoading, fetchData } = useFetchApi()
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultData
      ? {
          code: defaultData.code || '',
          name: defaultData.name || ''
        }
      : {}
  })

  async function createData(data) {
    try {
      await fetchData('/courses', {
        method: 'POST',
        body: JSON.stringify({
          code: data.code,
          name: data.name
        }),
        cache: 'no-store'
      })
      setOpenDialog(false)
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
      await fetchData(`/course/${defaultData.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          code: data.code,
          name: data.name
        }),
        cache: 'no-store'
      })
      setOpenDialog(false)
      router.refresh()
      toast({
        variant: 'success',
        title: `Course ${defaultData.code} edited!`
      })
    } catch (exception) {
      console.error(exception.message)
      toast({
        variant: 'destructive',
        title: `Unable to edit course ${defaultData.code}`
      })
    }
  }

  async function onSubmit(data) {
    if (defaultData) await editData(data)
    else await createData(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder="Enter course code"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder="Enter course name"
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

export default AddCourseForm
