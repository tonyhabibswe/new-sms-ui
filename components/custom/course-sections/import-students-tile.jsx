'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import ImportStudentsDialog from '../students/import-students-dialog'
import { SectionTile } from './section-tile'

export function ImportStudentsTile({ sectionId, title }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SectionTile as="button" icon={Upload} label="Import CSV" caption="Add a class list" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import students</DialogTitle>
          <DialogDescription>
            Choose the OGS CSV file to add its students to {title}.
          </DialogDescription>
        </DialogHeader>
        <ImportStudentsDialog setOpenDialog={setOpen} defaultData={{ id: sectionId }} />
      </DialogContent>
    </Dialog>
  )
}
