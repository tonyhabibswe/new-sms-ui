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
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg md:text-xl">Grade Items</CardTitle>
            <CardDescription className="text-sm">
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
