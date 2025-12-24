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

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
      <CategoriesPanel
        courseSectionId={courseSectionId}
        categories={categories}
        categoriesLoading={categoriesLoading}
        categoriesError={categoriesError}
        selectedCategoryId={selectedCategoryId}
        onCategorySelect={setSelectedCategoryId}
        onCategoryAdd={onCategoryAdd}
        onCategoryEdit={onCategoryEdit}
        onCategoryDelete={onCategoryDelete}
      />

      <ItemsPanel
        selectedCategoryId={selectedCategoryId}
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
