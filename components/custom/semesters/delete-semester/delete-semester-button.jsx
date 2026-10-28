import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Icons } from '@/components/ui/icons'
import { useToast } from '@/components/ui/use-toast'
import useFetchApi from '@/hooks/useFetchApi'
import useRefresh from '@/hooks/useRefresh'
import React from 'react'

const DeleteSemesterButton = ({ defaultData, setOpenDialog }) => {
  const { isLoading, fetchData } = useFetchApi()
  const { toast } = useToast()
  const { refresh, isRefreshing } = useRefresh()
  const busy = isLoading || isRefreshing
  const handleDeleteSemester = async () => {
    try {
      await fetchData(`/semester/${defaultData.id}`, {
        method: 'DELETE',
        cache: 'no-store'
      })
      await refresh()
      setOpenDialog(false)
      toast({
        variant: 'success',
        title: `Semester ${defaultData.name} deleted`
      })
    } catch {
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
        disabled={busy}
        onClick={handleDeleteSemester}>
        {busy && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Delete semester
      </Button>
    </DialogFooter>
  )
}

export default DeleteSemesterButton
