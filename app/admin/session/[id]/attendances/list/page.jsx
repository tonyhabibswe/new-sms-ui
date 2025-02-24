import { DataTableToolbar } from '@/components/custom/attendance/data-table-list-toolbar'
import { DataTable } from '@/components/custom/data-table/data-table'
import { columns } from '@/components/custom/attendance/data-table-list-columns'
import fetchInstanceSSR from '@/lib/fetchInstanceSSR'

export const metadata = {
  title: 'Attendance',
  description: 'Attendance List'
}

const getData = async (id) => {
  const res = await fetchInstanceSSR(
    `/course-session/${id}/attendances/list-students`,
    {
      cache: 'no-store'
    }
  )

  if (res.status === 401) throw new Error(res.statusText)
  if (!res.ok) {
    throw new Error('Failed to fetch attendance')
  }
  const resJson = await res.json()
  return resJson.data
}

const AttendanceList = async ({ params }) => {
  let data = []
  let error = ''

  try {
    data = await getData(params.id)
  } catch (exception) {
    if (error.message === 'Unauthorized') await signOut({ redirect: false })
    error = exception.message
  }
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold tracking-tight">Attendance List</h2>
      </div>
      <DataTable
        data={data}
        columns={columns}
        toolbar={DataTableToolbar}
        error={error}
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
