'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import AddCategoryButton from './add-category-button'
import CategoriesTable from './categories-table'
import TotalWeightIndicator from './total-weight-indicator'
import CategoriesLoadingSkeleton from './categories-loading-skeleton'
import ErrorDisplay from './error-display'

export default function CategoriesPanel({
  courseSectionId,
  categories,
  categoriesLoading,
  categoriesError,
  selectedCategoryId,
  onCategorySelect,
  onCategoryAdd,
  onCategoryEdit,
  onCategoryDelete
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Grade Categories</CardTitle>
            <CardDescription>
              Define grading structure and weights
            </CardDescription>
          </div>
          <AddCategoryButton
            courseSectionId={courseSectionId}
            onCategoryAdd={onCategoryAdd}
            disabled={categoriesLoading}
          />
        </div>
        {!categoriesLoading && !categoriesError && (
          <TotalWeightIndicator categories={categories} />
        )}
      </CardHeader>
      <CardContent>
        {categoriesLoading ? (
          <CategoriesLoadingSkeleton />
        ) : categoriesError ? (
          <ErrorDisplay error={categoriesError} />
        ) : (
          <CategoriesTable
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={onCategorySelect}
            onCategoryEdit={onCategoryEdit}
            onCategoryDelete={onCategoryDelete}
          />
        )}
      </CardContent>
    </Card>
  )
}
