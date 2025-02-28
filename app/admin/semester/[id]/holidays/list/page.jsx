import { DataTable } from '@/components/custom/data-table/data-table'
import AddHolidayButton from '@/components/custom/holidays/AddHoliday/add-holiday-button'
import { columns } from '@/components/custom/holidays/data-table-list-columns'
import { DataTableToolbar } from '@/components/custom/holidays/data-table-list-toolbar'
import fetchInstanceSSR from '@/lib/fetchInstanceSSR'

export const metadata = {
  title: 'Holidays',
  description: 'Holidays List'
}
export const revalidate = 0;

const getData = async (id) => {
  const res = await fetchInstanceSSR(`/semester/${id}/holidays`, {
    cache: 'no-store'
  })

  if (res.status === 401) throw new Error(res.statusText)
  if (!res.ok) {
    throw new Error('Failed to fetch courses')
  }
  const resJson = await res.json()
  return resJson.data
}

const HolidaysListPage = async ({ params }) => {
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
        <h2 className="text-2xl font-bold tracking-tight">Holidays List</h2>
        <AddHolidayButton />
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

export default HolidaysListPage
