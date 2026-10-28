'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import EditItemForm from './edit-item-form'
import DeleteItemDialog from './delete-item-dialog'

export default function ItemsTable({
  items,
  selectedCategoryId,
  onItemEdit,
  onItemDelete
}) {
  const [editingItem, setEditingItem] = useState(null)
  const [deletingItem, setDeletingItem] = useState(null)

  if (!selectedCategoryId) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">Select a category to view items</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">
          No items yet. Add your first item.
        </p>
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-3">Title</TableHead>
            <TableHead className="hidden px-3 sm:table-cell">Max points</TableHead>
            <TableHead className="px-3">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="px-3 font-semibold">
                {item.title}
                <span className="mt-0.5 block text-[13px] font-normal text-muted-foreground sm:hidden">
                  {item.maxPoints} points
                </span>
              </TableCell>
              <TableCell className="hidden px-3 sm:table-cell">
                <span className="whitespace-nowrap rounded-lg border border-border bg-muted px-2.5 py-1 text-xs font-medium text-faint">
                  {item.maxPoints} points
                </span>
              </TableCell>
              <TableCell className="px-3 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={`Edit ${item.title}`}
                    onClick={() => setEditingItem(item)}>
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={`Delete ${item.title}`}
                    onClick={() => setDeletingItem(item)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingItem && (
        <EditItemForm
          item={editingItem}
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          onItemEdit={(id, data) => {
            onItemEdit(id, data)
            setEditingItem(null)
          }}
        />
      )}

      {deletingItem && (
        <DeleteItemDialog
          item={deletingItem}
          open={!!deletingItem}
          onOpenChange={(open) => !open && setDeletingItem(null)}
          onConfirm={() => {
            onItemDelete(deletingItem.id)
            setDeletingItem(null)
          }}
        />
      )}
    </>
  )
}
