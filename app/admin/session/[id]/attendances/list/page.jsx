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

const AttendanceList = async ({ params }) => {
  const data = await getData(params.id)
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold tracking-tight">Attendance List</h2>
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
