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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import useFetchApi from '@/hooks/useFetchApi'
import { useRouter } from 'next/navigation'
import { Icons } from '@/components/ui/icons'
import { useToast } from '@/components/ui/use-toast'
import { DialogFooter } from '@/components/ui/dialog'
import { useEffect, useState } from 'react'

const FormSchema = z.object({
  major_id: z.string().min(1, 'Major is required'),
  semester_id: z.string().min(1, 'Semester is required'),
  grade_value: z
    .string()
    .min(1, 'Grade value is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: 'Grade value must be a positive number'
    })
    .refine((val) => parseFloat(val) <= 100, {
      message: 'Grade value must not exceed 100'
    })
})

const EditPassingGradeForm = ({ setOpenDialog, defaultData }) => {
  const { isLoading, fetchData } = useFetchApi()
  const router = useRouter()
  const { toast } = useToast()
  const [majors, setMajors] = useState([])
  const [semesters, setSemesters] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(true)

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      major_id: defaultData?.majorId?.toString() || '',
      semester_id: defaultData?.semesterId?.toString() || '',
      grade_value: defaultData?.gradeValue?.toString() || ''
    }
  })

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [majorsData, semestersData] = await Promise.all([
          fetchData('/majors', { method: 'GET' }),
          fetchData('/semesters', { method: 'GET' })
        ])
        setMajors(majorsData.data || [])
        setSemesters(semestersData.data || [])
      } catch (error) {
        console.error('Failed to load options:', error)
        toast({
          variant: 'destructive',
          title: 'Failed to load options'
        })
      } finally {
        setLoadingOptions(false)
      }
    }

    loadOptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  async function onSubmit(data) {
    try {
      await fetchData(`/course-passing-grades/${defaultData.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          courseId: defaultData.courseId,
          majorId: parseInt(data.major_id),
          semesterId: parseInt(data.semester_id),
          gradeValue: parseFloat(data.grade_value)
        }),
        cache: 'no-store'
      })
      setOpenDialog(false)
      router.refresh()
      toast({
        variant: 'success',
        title: 'Passing grade updated successfully!'
      })
    } catch (exception) {
      const errorMessage = exception.message || 'Unable to update passing grade'
      toast({
        variant: 'destructive',
        title: errorMessage.includes('duplicate')
          ? 'A passing grade for this combination already exists'
          : errorMessage
      })
    }
  }

  if (loadingOptions) {
    return (
      <div className="flex items-center justify-center py-8">
        <Icons.spinner className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="major_id"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Major</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a major" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {majors.map((major) => (
                      <SelectItem key={major.id} value={major.id.toString()}>
                        {major.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="col-span-3 col-start-2" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="semester_id"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Semester</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a semester" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem
                        key={semester.id}
                        value={semester.id.toString()}>
                        {semester.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="col-span-3 col-start-2" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="grade_value"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Grade Value</FormLabel>
                <FormControl>
                  <Input
                    className="col-span-3"
                    placeholder="e.g., 75 or 75.5"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-span-3 col-start-2" />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button disabled={isLoading} type="submit">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Changes
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

export default EditPassingGradeForm
