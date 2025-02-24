import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Icons } from '@/components/ui/icons'
import { useToast } from '@/components/ui/use-toast'
import useFetchApi from '@/hooks/useFetchApi'
import { useRouter } from 'next/navigation'
import React from 'react'

const DeleteSemesterButton = ({ defaultData, openDialog, setOpenDialog }) => {
  const { isLoading, fetchData } = useFetchApi()
  const { toast } = useToast()
  const router = useRouter()
  const handleDeleteSemester = async () => {
    try {
      await fetchData(`/semester/${defaultData.id}`, {
        method: 'DELETE',
        cache: 'no-store'
      })
      setOpenDialog(false)
      router.refresh()
      toast({
        variant: 'success',
        title: `Semester ${defaultData.name} deleted`
      })
    } catch (exception) {
      toast({
        variant: 'destructive',
        title: `Unable to delete ${defaultData.name} semester`
      })
    }
  }
  return (
    <DialogFooter>
      <Button
        variant="destructive"
        disabled={isLoading}
        onClick={handleDeleteSemester}>
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Delete Semester
      </Button>
    </DialogFooter>
  )
}

export default DeleteSemesterButton
