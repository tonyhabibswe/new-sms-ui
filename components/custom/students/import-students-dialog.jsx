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
import useRefresh from '@/hooks/useRefresh'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Icons } from '@/components/ui/icons'

const FormSchema = z.object({
  file: z
    .instanceof(File, { error: 'CSV File is required' })
    .refine((val) => val.name.includes('.csv'), 'CSV File is required')
})

const ImportStudentsDialog = ({ setOpenDialog, defaultData }) => {
  const { isLoading, fetchData } = useFetchApi()
  const { refresh, isRefreshing } = useRefresh()
  const busy = isLoading || isRefreshing
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
      await refresh()
      setOpenDialog(false)
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
              <FormItem className="flex flex-col gap-2">
                <FormLabel>CSV File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    className="w-full"
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
          <Button disabled={busy} type="submit">
            {busy && (
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
