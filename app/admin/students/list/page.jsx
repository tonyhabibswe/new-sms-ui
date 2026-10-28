import { DataTable } from '@/components/custom/data-table/data-table'
import { PageHeader } from '@/components/custom/layout/page-header'
import { columns } from '@/components/custom/students/data-table-list-columns'
import { DataTableToolbar } from '@/components/custom/students/data-table-list-toolbar'
import fetchInstanceSSR from '@/lib/fetchInstanceSSR'

export const metadata = {
  title: 'Students',
  description: 'Students and the courses they took'
}
export const revalidate = 0

const getData = async () => {
  const res = await fetchInstanceSSR('/students', { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Failed to fetch students')
  }
  const resJson = await res.json()
  return resJson.data
}

const StudentsListPage = async () => {
  const data = await getData()

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <PageHeader
        eyebrow="Directory"
        title="Students"
        description="Everyone who took a course section with you. Open a student to see their courses by semester."
      />
      <DataTable
        data={data}
        columns={columns}
        toolbar={DataTableToolbar}
        columnVisibilityInitialState={{
          id: false,
          email: false,
          campus: false
        }}
      />
    </div>
  )
}

export default StudentsListPage
