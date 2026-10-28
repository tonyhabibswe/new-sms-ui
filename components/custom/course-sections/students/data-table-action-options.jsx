'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useFetchApi from '@/hooks/useFetchApi'
import { useParams, useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useEffect } from 'react'

// Downloads a course section's attendance as Excel. Defaults to the section in
// the route (the gradebook); the attendance page passes it in.
export function DataTableActionOptions({ sectionId, className }) {
  const { data, isLoading, fetchData } = useFetchApi()
  const router = useRouter()
  const { toast } = useToast()
  const param = useParams()

  const handleExportClick = async (e) => {
    e.preventDefault()
    try {
      await fetchData(`/course-section/${sectionId ?? param.id}/export-attendance`, {
        method: 'GET',
        cache: 'no-store'
      })
      router.refresh()
      toast({
        variant: 'success',
        title: 'Attendance exported!'
      })
    } catch (exception) {
      console.error(exception)
      toast({
        variant: 'destructive',
        title: 'Unable to export attendance'
      })
    }
  }
  useEffect(() => {
    if (data) {
      // Convert base64 string to a Blob
      const cleanBase64 = data.data.file.replace(/\s/g, '')
      const dataUrl = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${cleanBase64}`

      fetch(dataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = data.data.fileName
          document.body.appendChild(link)
          link.click()
          link.remove()
          window.URL.revokeObjectURL(url)
        })
        .catch((error) => {
          console.error('Error converting Base64 to Blob:', error)
        })
    }
  }, [data])

  return (
    <Button
      variant="outline"
      className={className}
      disabled={isLoading}
      onClick={handleExportClick}>
      <Download className="h-[18px] w-[18px]" aria-hidden="true" />
      Export attendance
    </Button>
  )
}
