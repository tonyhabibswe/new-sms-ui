import AddCourseButton from '@/components/custom/course-sections/add-course-button'
import { columns } from '@/components/custom/course-sections/data-table-list-columns'
import { DataTableToolbar } from '@/components/custom/course-sections/data-table-list-toolbar'
import { DataTable } from '@/components/custom/data-table/data-table'
import fetchInstanceSSR from '@/lib/fetchInstanceSSR'

export const metadata = {
  title: 'Course Sections',
  description: 'Course Sections'
}
export const revalidate = 0
const getData = async (id) => {
  const res = await fetchInstanceSSR(`/semester/${id}/courses`, {
    cache: 'no-store'
  })

  if (res.status === 401) throw new Error(res.statusText)
  if (!res.ok) {
    throw new Error('Failed to fetch courses')
  }
  const resJson = await res.json()
  return resJson.data
}

const CoursesListPage = async ({ params }) => {
  let data = []
  let error = ''

  try {
    data = await getData(params.id)
  } catch (exception) {
    error = exception.message
  }
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold tracking-tight">
          Course Sections
        </h2>
        <AddCourseButton />
      </div>
      <DataTable
        data={data}
        columns={columns}
        toolbar={DataTableToolbar}
        error={error}
        columnVisibilityInitialState={{
          id: false,
          name: false,
          curveAlgorithm: false
        }}
      />
    </div>
  )
}

export default CoursesListPage
