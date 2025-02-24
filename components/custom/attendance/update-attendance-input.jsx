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
import { useEffect, useState } from 'react'

const UpdateAttendanceInput = ({ value, attendanceId }) => {
  const { isLoading, fetchData } = useFetchApi()
  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = async (data) => {
    try {
      await fetchData(`/attendance/${attendanceId}`, {
        method: 'PUT',
        body: JSON.stringify({
          attendance: data
        }),
        cache: 'no-store'
      })
      router.refresh()
      toast({
        variant: 'success',
        title: `Attendance updated!`
      })
    } catch (exception) {
      console.error(exception.message)
      toast({
        variant: 'destructive',
        title: `Unable to update attendance`
      })
    }
  }
  return (
    <Select value={value ?? ''} onValueChange={handleInputChange}>
      <SelectTrigger className="w-[125px]">
        <SelectValue placeholder="" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="abscent">Abscent</SelectItem>
        <SelectItem value="present">Present</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default UpdateAttendanceInput
