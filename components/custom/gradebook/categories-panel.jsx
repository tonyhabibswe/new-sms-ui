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
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg md:text-xl">
              Grade Categories
            </CardTitle>
            <CardDescription className="text-sm">
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
