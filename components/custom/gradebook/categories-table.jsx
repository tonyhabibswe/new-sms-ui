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
            <TableHead>Name</TableHead>
            <TableHead className="w-24">Weight (%)</TableHead>
            <TableHead className="w-32">Algorithm</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow
              key={category.id}
              className={cn(
                'cursor-pointer',
                selectedCategoryId === category.id && 'bg-muted'
              )}
              onClick={() => onCategorySelect(category.id)}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>{category.weight}%</TableCell>
              <TableCell className="capitalize">
                {category.algorithm === 'equal'
                  ? 'Equal Weight'
                  : 'Points Based'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingCategory(category)
                    }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeletingCategory(category)
                    }}>
                    <Trash2 className="h-4 w-4" />
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
