'use client'

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { GearIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import useFetchApi from '@/hooks/useFetchApi'
import { useParams, useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

export function DataTableActionOptions({ table }) {
  const { isLoading, fetchData } = useFetchApi()
  const router = useRouter()
  const { toast } = useToast()
  const param = useParams()
  const handleAbscentSelect = async (e, val) => {
    e.preventDefault()
    const attendanceIds = table
      .getSelectedRowModel()
      .flatRows.map((r) => r.original)
      .map((a) => a.id)
    try {
      await fetchData(`/course-session/${param.id}/attendances/bulk`, {
        method: 'PUT',
        body: JSON.stringify({
          attendanceIds: attendanceIds,
          attendance: val
        }),
        cache: 'no-store'
      })
      router.refresh()
      toast({
        variant: 'success',
        title: 'Attendance updated!'
      })
    } catch (exception) {
      console.error(exception)
      toast({
        variant: 'destructive',
        title: 'Unable to update attendance'
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex">
          <GearIcon className="mr-2 h-4 w-4" />
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Choose an action</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => handleAbscentSelect(e, 'abscent')}
          textValue="abscent">
          Set as Abscent
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => handleAbscentSelect(e, 'present')}
          textValue="present">
          Set as Present
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
