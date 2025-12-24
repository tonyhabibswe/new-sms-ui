import { DataTable } from '@/components/custom/data-table/data-table'
import AddHolidayButton from '@/components/custom/holidays/AddHoliday/add-holiday-button'
import { columns } from '@/components/custom/holidays/data-table-list-columns'
import { DataTableToolbar } from '@/components/custom/holidays/data-table-list-toolbar'
import fetchInstanceSSR from '@/lib/fetchInstanceSSR'

export const metadata = {
  title: 'Holidays',
  description: 'Holidays List'
}
export const revalidate = 0

const getData = async (id) => {
  const res = await fetchInstanceSSR(`/semester/${id}/holidays`, {
    cache: 'no-store'
  })

  if (!res.ok) {
    throw new Error('Failed to fetch courses')
  }
  const resJson = await res.json()
  return resJson.data
}

const HolidaysListPage = async ({ params }) => {
  const data = await getData(params.id)
  return (
    <div className="flex h-full flex-1 flex-col space-y-4 p-4 md:space-y-8 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight md:text-2xl">Holidays List</h2>
        <AddHolidayButton />
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

export default HolidaysListPage
