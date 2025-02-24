import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import useFetchApi from '@/hooks/useFetchApi'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Icons } from '@/components/ui/icons'

const FormSchema = z.object({
  file: z
    .instanceof(File)
    .refine((val) => val.name.includes('.csv'), 'CSV File is required')
})

const ImportStudentsDialog = ({ setOpenDialog, defaultData }) => {
  const { isLoading, fetchData } = useFetchApi()
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(FormSchema)
  })

  const onSubmit = async (data) => {
    try {
      let formData = new FormData()
      formData.append('file', data.file)
      await fetchData(
        `/course-section/${defaultData.id}/import-students`,
        {
          method: 'POST',
          body: formData
        },
        true
      )
      setOpenDialog(false)
      router.refresh()
      toast({
        variant: 'success',
        title: `Students imported successfully!`
      })
    } catch (exception) {
      console.error(exception.message)
      toast({
        variant: 'destructive',
        title: `Unable to import students`
      })
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">CSV File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    className="col-span-3"
                    onChange={(e) =>
                      field.onChange(e.target.files ? e.target.files[0] : null)
                    }
                  />
                </FormControl>
                <FormMessage className="text-right" />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button disabled={isLoading} type="submit">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Import
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

export default ImportStudentsDialog
