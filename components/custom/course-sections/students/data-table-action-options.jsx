'use client'

import { DownloadIcon, GearIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import useFetchApi from '@/hooks/useFetchApi'
import { useParams, useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useEffect } from 'react'

export function DataTableActionOptions({ table }) {
  const { data, isLoading, fetchData } = useFetchApi()
  const router = useRouter()
  const { toast } = useToast()
  const param = useParams()

  function base64ToBlob(base64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(base64Data)
    const byteArrays = []

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize)

      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }

      const byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }

    return new Blob(byteArrays, { type: contentType })
  }

  const handleExportClick = async (e) => {
    e.preventDefault()
    try {
      await fetchData(`/course-section/${param.id}/export-attendance`, {
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
      size="sm"
      className="ml-auto hidden h-8 lg:flex"
      onClick={handleExportClick}>
      <DownloadIcon className="mr-2 h-4 w-4" />
      Export
    </Button>
  )
}
