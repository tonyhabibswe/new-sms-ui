import { DataTable } from '@/components/custom/data-table/data-table'
import { PageHeader } from '@/components/custom/layout/page-header'
import fetchInstanceSSR from '@/lib/fetchInstanceSSR'
import { columns } from '@/components/custom/courses/data-table-list-columns'
import { DataTableToolbar } from '@/components/custom/courses/data-table-list-toolbar'
import AddCourseButton from '@/components/custom/courses/AddCourse/add-course-button'

export const metadata = {
  title: 'Courses',
  description: 'Courses'
}
export const revalidate = 0

const getData = async () => {
  const res = await fetchInstanceSSR('/courses', { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Failed to fetch courses')
  }
  const resJson = await res.json()
  return resJson.data
}

const CoursesListPage = async () => {
  const data = await getData()

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <PageHeader
        eyebrow="Catalog"
        title="Courses"
        description="Every course a semester can open sections of, and the grade each major needs to pass it."
        actions={<AddCourseButton />}
      />
      <DataTable
        data={data}
        columns={columns}
        toolbar={DataTableToolbar}
        columnVisibilityInitialState={{
          id: false
        }}
      />
    </div>
  )
}
export default CoursesListPage
