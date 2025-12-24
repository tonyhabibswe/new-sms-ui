'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import useFetchApi from '@/hooks/useFetchApi'
import CategoriesItemsTab from './categories-items-tab'
import GradesTab from './grades-tab'
import AttendanceTab from './attendance-tab'

export default function GradebookTabs({ courseSectionId }) {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') || 'categories-items'
  const [activeTab, setActiveTab] = useState(initialTab)
  const { toast } = useToast()
  const router = useRouter()
  const { fetchData } = useFetchApi()

  // State management for categories and items (API-backed)
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState(null)

  const [items, setItems] = useState([])
  const [itemsLoading, setItemsLoading] = useState(true)
  const [itemsError, setItemsError] = useState(null)

  // Data transformation utilities
  const transformCategoryFromBackend = (backendCategory) => ({
    id: backendCategory.id,
    courseSectionId: backendCategory.courseSectionId,
    name: backendCategory.name,
    weight: backendCategory.weightPercent,
    algorithm: 'equal' // Frontend displays 'equal' for AVERAGE
  })

  const transformCategoryToBackend = (frontendCategory) => ({
    ...(frontendCategory.name && { name: frontendCategory.name }),
    ...(frontendCategory.weight !== undefined && {
      weightPercent: frontendCategory.weight
    }),
    algorithm: 'AVERAGE' // Backend only supports AVERAGE
  })

  const transformItemFromBackend = (backendItem) => ({
    id: backendItem.id,
    categoryId: backendItem.categoryId,
    title: backendItem.title,
    maxPoints: backendItem.maxPoints
  })

  const transformItemToBackend = (frontendItem) => ({
    ...(frontendItem.categoryId && { categoryId: frontendItem.categoryId }),
    ...(frontendItem.title && { title: frontendItem.title }),
    ...(frontendItem.maxPoints !== undefined && {
      maxPoints: frontendItem.maxPoints
    })
  })

  // Fetch categories and items on mount
  useEffect(() => {
    const loadData = async () => {
      // Fetch categories
      try {
        setCategoriesLoading(true)
        const response = await fetchData(
          `/gradeable-categories/course-section/${courseSectionId}`,
          { method: 'GET' }
        )
        const transformedCategories = (response.data || []).map(
          transformCategoryFromBackend
        )
        setCategories(transformedCategories)
        setCategoriesError(null)
      } catch (error) {
        console.error('Error fetching categories:', error)
        setCategoriesError(error.message)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load categories'
        })
      } finally {
        setCategoriesLoading(false)
      }

      // Fetch items
      try {
        setItemsLoading(true)
        const response = await fetchData(
          `/gradeable-items/course-section/${courseSectionId}`,
          { method: 'GET' }
        )
        const transformedItems = (response.data || []).map(
          transformItemFromBackend
        )
        setItems(transformedItems)
        setItemsError(null)
      } catch (error) {
        console.error('Error fetching items:', error)
        setItemsError(error.message)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load items'
        })
      } finally {
        setItemsLoading(false)
      }
    }

    if (courseSectionId) {
      loadData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSectionId])

  // Refetch functions
  const refetchCategories = async () => {
    try {
      const response = await fetchData(
        `/gradeable-categories/course-section/${courseSectionId}`,
        { method: 'GET' }
      )
      const transformedCategories = (response.data || []).map(
        transformCategoryFromBackend
      )
      setCategories(transformedCategories)
      setCategoriesError(null)
    } catch (error) {
      console.error('Error refetching categories:', error)
      setCategoriesError(error.message)
    }
  }

  const refetchItems = async () => {
    try {
      const response = await fetchData(
        `/gradeable-items/course-section/${courseSectionId}`,
        { method: 'GET' }
      )
      const transformedItems = (response.data || []).map(
        transformItemFromBackend
      )
      setItems(transformedItems)
      setItemsError(null)
    } catch (error) {
      console.error('Error refetching items:', error)
      setItemsError(error.message)
    }
  }

  // Category CRUD handlers
  const handleCategoryAdd = async (newCategory) => {
    try {
      const payload = {
        courseSectionId: parseInt(courseSectionId),
        ...transformCategoryToBackend(newCategory)
      }

      const response = await fetchData('/gradeable-categories', {
        method: 'POST',
        body: JSON.stringify(payload)
      })

      const transformedCategory = transformCategoryFromBackend(response.data)
      setCategories([...categories, transformedCategory])

      toast({
        title: 'Success',
        description: 'Category created successfully!'
      })

      await refetchCategories()
    } catch (error) {
      console.error('Error creating category:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create category'
      })
      throw error
    }
  }

  const handleCategoryEdit = async (id, updatedCategory) => {
    try {
      const payload = transformCategoryToBackend(updatedCategory)

      const response = await fetchData(`/gradeable-categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      })

      const transformedCategory = transformCategoryFromBackend(response.data)
      setCategories(
        categories.map((cat) => (cat.id === id ? transformedCategory : cat))
      )

      toast({
        title: 'Success',
        description: 'Category updated successfully!'
      })

      await refetchCategories()
    } catch (error) {
      console.error('Error updating category:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update category'
      })
      throw error
    }
  }

  const handleCategoryDelete = async (id) => {
    try {
      await fetchData(`/gradeable-categories/${id}`, {
        method: 'DELETE'
      })

      setCategories(categories.filter((cat) => cat.id !== id))

      toast({
        title: 'Success',
        description: 'Category deleted successfully!'
      })

      // Refetch both (cascade delete handled by backend)
      await Promise.all([refetchCategories(), refetchItems()])
    } catch (error) {
      console.error('Error deleting category:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete category'
      })
    }
  }

  // Item CRUD handlers
  const handleItemAdd = async (newItem) => {
    try {
      const payload = transformItemToBackend(newItem)

      const response = await fetchData('/gradeable-items', {
        method: 'POST',
        body: JSON.stringify(payload)
      })

      const transformedItem = transformItemFromBackend(response.data)
      setItems([...items, transformedItem])

      // Show special toast with grades count
      const gradesCount = response.data.gradesCount || 0
      toast({
        title: 'Success',
        description: `Item created! ${gradesCount} student grades initialized.`
      })

      await refetchItems()
    } catch (error) {
      console.error('Error creating item:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create item'
      })
      throw error
    }
  }

  const handleItemEdit = async (id, updatedItem) => {
    try {
      const payload = transformItemToBackend(updatedItem)

      const response = await fetchData(`/gradeable-items/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      })

      const transformedItem = transformItemFromBackend(response.data)
      setItems(items.map((item) => (item.id === id ? transformedItem : item)))

      toast({
        title: 'Success',
        description: 'Item updated successfully!'
      })

      await refetchItems()
    } catch (error) {
      console.error('Error updating item:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update item'
      })
      throw error
    }
  }

  const handleItemDelete = async (id) => {
    try {
      await fetchData(`/gradeable-items/${id}`, {
        method: 'DELETE'
      })

      setItems(items.filter((item) => item.id !== id))

      toast({
        title: 'Success',
        description: 'Item deleted successfully!'
      })

      await refetchItems()
    } catch (error) {
      console.error('Error deleting item:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete item'
      })
    }
  }

  /**
   * Handle tab change and update URL with query parameter
   * Preserves existing query parameters (code, section, name)
   */
  const handleTabChange = (value) => {
    setActiveTab(value)

    // Get current search params and update tab parameter
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', value)

    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full max-w-lg grid-cols-3">
        <TabsTrigger value="categories-items">Categories & Items</TabsTrigger>
        <TabsTrigger value="grades">Grades</TabsTrigger>
        <TabsTrigger value="attendance">Students</TabsTrigger>
      </TabsList>

      <TabsContent value="categories-items" className="mt-6">
        <CategoriesItemsTab
          courseSectionId={courseSectionId}
          categories={categories}
          categoriesLoading={categoriesLoading}
          categoriesError={categoriesError}
          items={items}
          itemsLoading={itemsLoading}
          itemsError={itemsError}
          onCategoryAdd={handleCategoryAdd}
          onCategoryEdit={handleCategoryEdit}
          onCategoryDelete={handleCategoryDelete}
          onItemAdd={handleItemAdd}
          onItemEdit={handleItemEdit}
          onItemDelete={handleItemDelete}
        />
      </TabsContent>

      <TabsContent value="grades" className="mt-6">
        <GradesTab courseSectionId={courseSectionId} />
      </TabsContent>

      <TabsContent value="attendance" className="mt-6">
        <AttendanceTab courseSectionId={courseSectionId} />
      </TabsContent>
    </Tabs>
  )
}
