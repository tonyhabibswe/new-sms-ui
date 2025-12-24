import { DataTable } from '@/components/custom/data-table/data-table'
import { columns } from '@/components/custom/semesters/data-table-list-columns'
import { DataTableToolbar } from '@/components/custom/semesters/data-table-list-toolbar'
import fetchInstanceSSR from '@/lib/fetchInstanceSSR'
import AddSemesterButton from '@/components/custom/semesters/AddSemester/add-semester-button'

export const metadata = {
  title: 'Semesters',
  description: 'Semester List'
}
export const revalidate = 0

const getData = async () => {
  const res = await fetchInstanceSSR('/semesters', { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Failed to fetch semesters')
  }
  const resJson = await res.json()
  return resJson.data
}
const SemestersListPage = async () => {
  const data = await getData()

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold tracking-tight">Semesters</h2>
        <AddSemesterButton />
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
export default SemestersListPage
