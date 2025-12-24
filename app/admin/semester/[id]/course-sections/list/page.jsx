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

  if (!res.ok) {
    throw new Error('Failed to fetch courses')
  }
  const resJson = await res.json()
  return resJson.data
}

const CoursesListPage = async ({ params, searchParams }) => {
  const data = await getData(params.id)
  const semesterName = searchParams.semester || ''

  return (
    <div className="flex h-full flex-1 flex-col space-y-4 p-4 md:space-y-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">
            Course Sections
          </h2>
          {semesterName && (
            <p className="text-sm text-muted-foreground md:text-base">
              {semesterName}
            </p>
          )}
        </div>
        <AddCourseButton />
      </div>
      <DataTable
        data={data}
        columns={columns}
        toolbar={DataTableToolbar}
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
