import { DataTable } from '@/components/custom/data-table/data-table'
import { columns } from '@/components/custom/majors/data-table-list-columns'
import { DataTableToolbar } from '@/components/custom/majors/data-table-list-toolbar'
import fetchInstanceSSR from '@/lib/fetchInstanceSSR'

export const metadata = {
  title: 'Majors',
  description: 'Majors'
}
export const revalidate = 0

const getData = async () => {
  const res = await fetchInstanceSSR('/majors', { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Failed to fetch majors')
  }
  const resJson = await res.json()
  return resJson.data
}

const MajorsListPage = async () => {
  const data = await getData()

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Majors</h2>
          <p className="text-muted-foreground">
            View and edit major labels. Double-click on a label to edit.
          </p>
        </div>
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

export default MajorsListPage
