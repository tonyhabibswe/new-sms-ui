import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Icons } from '@/components/ui/icons'
import { useToast } from '@/components/ui/use-toast'
import useFetchApi from '@/hooks/useFetchApi'
import { useRouter } from 'next/navigation'
import React from 'react'

const DeletePassingGrade = ({ defaultData, setOpenDialog }) => {
  const { isLoading, fetchData } = useFetchApi()
  const { toast } = useToast()
  const router = useRouter()

  const handleDelete = async () => {
    try {
      await fetchData(`/course-passing-grades/${defaultData.id}`, {
        method: 'DELETE',
        cache: 'no-store'
      })
      setOpenDialog(false)
      router.refresh()
      toast({
        variant: 'success',
        title: 'Passing grade deleted successfully'
      })
    } catch (exception) {
      toast({
        variant: 'destructive',
        title: 'Unable to delete passing grade'
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-sm">
        <p className="mb-2">This will delete the passing grade:</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Major: {defaultData?.majorName || 'N/A'}</li>
          <li>Semester: {defaultData?.semesterName || 'N/A'}</li>
          <li>Grade Value: {defaultData?.gradeValue}</li>
        </ul>
      </div>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => setOpenDialog(false)}
          disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          disabled={isLoading}
          onClick={handleDelete}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Delete
        </Button>
      </DialogFooter>
    </div>
  )
}

export default DeletePassingGrade
