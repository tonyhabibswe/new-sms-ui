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
  if (res.status === 401) throw new Error(res.statusText)
  if (!res.ok) {
    throw new Error('Failed to fetch courses')
  }
  const resJson = await res.json()
  return resJson.data
}

const CoursesListPage = async () => {
  let data = []
  let error = ''

  try {
    data = await getData()
  } catch (exception) {
    error = exception.message
  }

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold tracking-tight">Courses</h2>
        <AddCourseButton />
      </div>
      <DataTable
        data={data}
        columns={columns}
        toolbar={DataTableToolbar}
        error={error}
        columnVisibilityInitialState={{
          id: false
        }}
      />
    </div>
  )
}
export default CoursesListPage
