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
import EditCategoryForm from './edit-category-form'
import DeleteCategoryDialog from './delete-category-dialog'
import { cn } from '@/lib/utils'

const algorithmLabel = (algorithm) =>
  algorithm === 'equal' ? 'Equal weight' : 'Points based'

export default function CategoriesTable({
  categories,
  selectedCategoryId,
  onCategorySelect,
  onCategoryEdit,
  onCategoryDelete
}) {
  const [editingCategory, setEditingCategory] = useState(null)
  const [deletingCategory, setDeletingCategory] = useState(null)

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">
          Get started by adding your first grade category
        </p>
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-3">Name</TableHead>
            <TableHead className="hidden px-3 sm:table-cell">Weight</TableHead>
            <TableHead className="hidden px-3 sm:table-cell">Algorithm</TableHead>
            <TableHead className="px-3">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow
              key={category.id}
              className={cn(
                'cursor-pointer',
                selectedCategoryId === category.id && 'bg-brand-400/5 hover:bg-brand-400/5'
              )}
              onClick={() => onCategorySelect(category.id)}>
              <TableCell className="px-3 font-semibold">
                <button
                  type="button"
                  aria-pressed={selectedCategoryId === category.id}
                  className="text-left hover:text-primary">
                  {category.name}
                </button>
                <span className="mt-0.5 block text-[13px] font-normal text-muted-foreground sm:hidden">
                  {category.weight}% · {algorithmLabel(category.algorithm)}
                </span>
              </TableCell>
              <TableCell className="hidden px-3 font-display text-base font-bold text-primary sm:table-cell">
                {category.weight}%
              </TableCell>
              <TableCell className="hidden whitespace-nowrap px-3 sm:table-cell">
                {algorithmLabel(category.algorithm)}
              </TableCell>
              <TableCell className="px-3 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={`Edit ${category.name}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingCategory(category)
                    }}>
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={`Delete ${category.name}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeletingCategory(category)
                    }}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingCategory && (
        <EditCategoryForm
          category={editingCategory}
          open={!!editingCategory}
          onOpenChange={(open) => !open && setEditingCategory(null)}
          onCategoryEdit={(id, data) => {
            onCategoryEdit(id, data)
            setEditingCategory(null)
          }}
        />
      )}

      {deletingCategory && (
        <DeleteCategoryDialog
          category={deletingCategory}
          open={!!deletingCategory}
          onOpenChange={(open) => !open && setDeletingCategory(null)}
          onConfirm={() => {
            onCategoryDelete(deletingCategory.id)
            setDeletingCategory(null)
          }}
        />
      )}
    </>
  )
}
