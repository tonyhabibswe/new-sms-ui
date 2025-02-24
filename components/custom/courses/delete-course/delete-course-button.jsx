import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Icons } from '@/components/ui/icons'
import { useToast } from '@/components/ui/use-toast'
import useFetchApi from '@/hooks/useFetchApi'
import { useRouter } from 'next/navigation'
import React from 'react'

const DeleteCourseButton = ({ defaultData, openDialog, setOpenDialog }) => {
  const { isLoading, fetchData } = useFetchApi()
  const { toast } = useToast()
  const router = useRouter()
  const handleDeleteCourse = async () => {
    try {
      await fetchData(`/course/${defaultData.id}`, {
        method: 'DELETE',
        cache: 'no-store'
      })
      setOpenDialog(false)
      router.refresh()
      toast({
        variant: 'success',
        title: `Course ${defaultData.code} deleted`
      })
    } catch (exception) {
      toast({
        variant: 'destructive',
        title: `Unable to delete ${defaultData.code} course`
      })
    }
  }
  return (
    <DialogFooter>
      <Button
        variant="destructive"
        disabled={isLoading}
        onClick={handleDeleteCourse}>
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Delete Course
      </Button>
    </DialogFooter>
  )
}

export default DeleteCourseButton
