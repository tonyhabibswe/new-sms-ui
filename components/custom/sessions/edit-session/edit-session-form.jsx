import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import * as z from 'zod'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import useFetchApi from '@/hooks/useFetchApi'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'

const FormSchema = z.object({
  attendance: z.string()
})

const EditSessionForm = ({ setOpenDialog, defaultData }) => {
  const { isLoading, fetchData } = useFetchApi()
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(FormSchema)
  })

  async function onSubmit(data) {
    try {
      await fetchData(`/Sessions/${defaultData.id}/attendances/all`, {
        method: 'PUT',
        body: JSON.stringify({
          attendance: data.attendance
        }),
        cache: 'no-store'
      })
      setOpenDialog(false)
      router.refresh()
      toast({
        variant: 'success',
        title: `Session action set to ${data}`
      })
    } catch (exception) {
      console.error(exception.message)
      toast({
        variant: 'destructive',
        title: `Unable to set session action`
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="attendance"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl className="col-span-3">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a session action" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="dismissed">Dismiss</SelectItem>
                    <SelectItem value="exam">Exam</SelectItem>
                    <SelectItem value="holiday">Holiday</SelectItem>
                  </SelectContent>
                </Select>
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

export default EditSessionForm
