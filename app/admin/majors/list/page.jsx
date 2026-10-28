import { DataTable } from '@/components/custom/data-table/data-table'
import { PageHeader } from '@/components/custom/layout/page-header'
import fetchInstanceSSR from '@/lib/fetchInstanceSSR'
import { columns } from '@/components/custom/majors/data-table-list-columns'
import { DataTableToolbar } from '@/components/custom/majors/data-table-list-toolbar'

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
    <div className="flex flex-col gap-6 lg:gap-8">
      <PageHeader
        eyebrow="Catalog"
        title="Majors"
        description="Majors are added along with the students who study them. Double-click a label to rename it."
      />
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
