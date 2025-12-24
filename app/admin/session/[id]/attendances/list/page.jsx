import { DataTableToolbar } from '@/components/custom/attendance/data-table-list-toolbar'
import { DataTable } from '@/components/custom/data-table/data-table'
import { columns } from '@/components/custom/attendance/data-table-list-columns'
import fetchInstanceSSR from '@/lib/fetchInstanceSSR'

export const metadata = {
  title: 'Attendance',
  description: 'Attendance List'
}
export const revalidate = 0

const getData = async (id) => {
  const res = await fetchInstanceSSR(
    `/course-session/${id}/attendances/list-students`,
    {
      cache: 'no-store'
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch attendance')
  }
  const resJson = await res.json()
  return resJson.data
}

const AttendanceList = async ({ params, searchParams }) => {
  const data = await getData(params.id)
  const courseCode = searchParams.code || ''
  const sectionCode = searchParams.section || ''
  const courseTime = searchParams.time || ''
  const sessionDate = searchParams.date || ''

  return (
    <div className="flex h-full flex-1 flex-col space-y-4 p-4 md:space-y-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">
            Attendance List
          </h2>
          {(courseCode || sectionCode || courseTime) && (
            <p className="text-sm text-muted-foreground md:text-base">
              {[courseCode, sectionCode, courseTime]
                .filter(Boolean)
                .join(' - ')}
            </p>
          )}
          {sessionDate && (
            <p className="text-sm text-muted-foreground md:text-base">
              {sessionDate}
            </p>
          )}
        </div>
      </div>
      <DataTable
        data={data}
        columns={columns}
        toolbar={DataTableToolbar}
        columnVisibilityInitialState={{
          id: false,
          campus: false,
          email: false,
          fatherName: false,
          major: false
        }}
      />
    </div>
  )
}

export default AttendanceList
