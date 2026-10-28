'use client'

import { useState } from 'react'
import CategoriesPanel from './categories-panel'
import ItemsPanel from './items-panel'

export default function CategoriesItemsTab({
  courseSectionId,
  categories,
  categoriesLoading,
  categoriesError,
  items,
  itemsLoading,
  itemsError,
  onCategoryAdd,
  onCategoryEdit,
  onCategoryDelete,
  onItemAdd,
  onItemEdit,
  onItemDelete
}) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  // Until one is picked (or if the picked one is deleted), show the first
  const activeCategoryId = categories.some((c) => c.id === selectedCategoryId)
    ? selectedCategoryId
    : (categories[0]?.id ?? null)

  return (
    <div className="grid grid-cols-1 gap-4 lg:gap-6 xl:grid-cols-2">
      <CategoriesPanel
        courseSectionId={courseSectionId}
        categories={categories}
        categoriesLoading={categoriesLoading}
        categoriesError={categoriesError}
        selectedCategoryId={activeCategoryId}
        onCategorySelect={setSelectedCategoryId}
        onCategoryAdd={onCategoryAdd}
        onCategoryEdit={onCategoryEdit}
        onCategoryDelete={onCategoryDelete}
      />

      <ItemsPanel
        selectedCategoryId={activeCategoryId}
        categories={categories}
        items={items}
        itemsLoading={itemsLoading}
        itemsError={itemsError}
        onItemAdd={onItemAdd}
        onItemEdit={onItemEdit}
        onItemDelete={onItemDelete}
      />
    </div>
  )
}
