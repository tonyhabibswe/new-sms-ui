import { DataTable } from '@/components/custom/data-table/data-table'
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
    <div className="flex h-full flex-1 flex-col space-y-4 p-4 md:space-y-8 md:p-8">
      <div className="flex items-center md:justify-start justify-between">
        <h2 className="text-xl font-bold tracking-tight md:text-2xl">
          Courses
        </h2>
        <AddCourseButton />
      </div>
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
