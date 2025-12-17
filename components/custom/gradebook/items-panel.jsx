'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import AddItemButton from './add-item-button'
import ItemsTable from './items-table'
import ItemsLoadingSkeleton from './items-loading-skeleton'
import ErrorDisplay from './error-display'

export default function ItemsPanel({
  selectedCategoryId,
  categories,
  items,
  itemsLoading,
  itemsError,
  onItemAdd,
  onItemEdit,
  onItemDelete
}) {
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId)
  const categoryItems = items.filter(
    (item) => item.categoryId === selectedCategoryId
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Grade Items</CardTitle>
            <CardDescription>
              {selectedCategory
                ? `Items in "${selectedCategory.name}"`
                : 'Select a category to view items'}
            </CardDescription>
          </div>
          <AddItemButton
            selectedCategoryId={selectedCategoryId}
            disabled={!selectedCategoryId || itemsLoading}
            onItemAdd={onItemAdd}
          />
        </div>
      </CardHeader>
      <CardContent>
        {itemsLoading ? (
          <ItemsLoadingSkeleton />
        ) : itemsError ? (
          <ErrorDisplay error={itemsError} />
        ) : (
          <ItemsTable
            items={categoryItems}
            selectedCategoryId={selectedCategoryId}
            onItemEdit={onItemEdit}
            onItemDelete={onItemDelete}
          />
        )}
      </CardContent>
    </Card>
  )
}
