import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Icons } from '@/components/ui/icons'
import { useToast } from '@/components/ui/use-toast'
import useFetchApi from '@/hooks/useFetchApi'
import useRefresh from '@/hooks/useRefresh'
import React from 'react'

const DeleteCourseButton = ({ defaultData, setOpenDialog }) => {
  const { isLoading, fetchData } = useFetchApi()
  const { toast } = useToast()
  const { refresh, isRefreshing } = useRefresh()
  const busy = isLoading || isRefreshing
  const handleDeleteCourse = async () => {
    try {
      await fetchData(`/course-section/${defaultData.id}`, {
        method: 'DELETE',
        cache: 'no-store'
      })
      await refresh()
      setOpenDialog(false)
      toast({
        variant: 'success',
        title: `Course ${defaultData.code} deleted`
      })
    } catch {
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
        disabled={busy}
        onClick={handleDeleteCourse}>
        {busy && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Delete section
      </Button>
    </DialogFooter>
  )
}

export default DeleteCourseButton
