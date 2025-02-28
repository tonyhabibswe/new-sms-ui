'use client'
import { useToast } from '@/components/ui/use-toast'
import useFetchApi from '@/hooks/useFetchApi'
import { useRouter } from 'next/navigation'
import React from 'react'

// EditableNameCell: a component for inline-editing the "name" value.
const EditableNameCell = ({ row }) => {
  const initialValue = row.getValue('name')
  const [value, setValue] = React.useState(initialValue)
  const [editing, setEditing] = React.useState(false)
  const { error, isLoading, fetchData } = useFetchApi()
  const router = useRouter()
  const { toast } = useToast()

  // Switch to edit mode on double-click.
  const handleDoubleClick = () => {
    setEditing(true)
  }

  // When the input loses focus, exit edit mode.
  const handleBlur = () => {
    setEditing(false)
    setValue(initialValue)
  }

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      setEditing(false)

      try {
        await fetchData(`/holiday/${row.original.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: value
          }),
          cache: 'no-store'
        })
        setValue(e.target.value ?? '')
        toast({
          variant: 'success',
          title: `Holiday updated!`
        })
      } catch (exception) {
        setValue(initialValue)
        console.error(exception.message)
        toast({
          variant: 'destructive',
          title: `Unable to update holiday`
        })
      }
    }
  }

  return (
    <div className="min-w-[80px]" onDoubleClick={handleDoubleClick}>
      {isLoading && <div>Loading...</div>}
      {!isLoading &&
        (editing ? (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className="border rounded p-1"
          />
        ) : !!value ? (
          value
        ) : (
          <p className="text-blue-700 underline underline-offset-1 cursor-pointer">
            Double click to edit
          </p>
        ))}
    </div>
  )
}

export default EditableNameCell
