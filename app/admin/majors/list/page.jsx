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
    <div className="flex h-full flex-1 flex-col space-y-4 p-4 md:space-y-8 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">
            Majors
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">
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
