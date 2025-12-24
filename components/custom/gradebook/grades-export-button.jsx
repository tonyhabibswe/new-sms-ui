'use client'

import { useState, useEffect } from 'react'
import { DownloadIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import useFetchApi from '@/hooks/useFetchApi'
import { useToast } from '@/components/ui/use-toast'

export function GradesExportButton({ courseSectionId }) {
  const { data, isLoading, fetchData } = useFetchApi()
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)

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
    setIsExporting(true)

    try {
      await fetchData(`/course-sections/${courseSectionId}/grades/export`, {
        method: 'GET',
        cache: 'no-store'
      })
    } catch (exception) {
      console.error(exception)
      toast({
        variant: 'destructive',
        title: 'Export Failed',
        description: 'Unable to export gradebook'
      })
      setIsExporting(false)
    }
  }

  useEffect(() => {
    if (data && data.data) {
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

          toast({
            variant: 'success',
            title: 'Export Successful',
            description: 'Gradebook downloaded successfully!'
          })
        })
        .catch((error) => {
          console.error('Error converting Base64 to Blob:', error)
          toast({
            variant: 'destructive',
            title: 'Download Failed',
            description: 'Failed to download file'
          })
        })
        .finally(() => {
          setIsExporting(false)
        })
    }
  }, [data, toast])

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExportClick}
      disabled={isExporting || isLoading}>
      <DownloadIcon className="h-4 w-4 mr-2" />
      {isExporting ? 'Exporting...' : 'Export Gradebook'}
    </Button>
  )
}
